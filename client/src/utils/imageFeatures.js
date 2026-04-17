/**
 * Lightweight color/texture heuristics from a browser canvas (placeholder for real CV).
 * @param {File|Blob} file
 * @returns {Promise<object>}
 */
export async function extractImageFeatures(file) {
  const bmp = await createImageBitmap(file);
  const w = 128;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return defaultFeatures();
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const n = w * h;
  let yellow = 0;
  let white = 0;
  let brown = 0;
  let dark = 0;
  let edgeDry = 0;
  let edgeCount = 0;
  let innerSat = 0;
  let innerCount = 0;
  let gVarAccum = 0;
  let gMean = 0;
  const gVals = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;

    if (r > 0.72 && g > 0.62 && b < 0.48) yellow += 1;
    if (lum > 0.8 && r + g + b > 2.15) white += 1;
    if (r > 0.32 && r < 0.62 && g > 0.22 && g < 0.48 && b < 0.38) brown += 1;
    if (lum < 0.28) dark += 1;

    const px = (i / 4) % w;
    const py = Math.floor(i / 4 / w);
    const onEdge = px < 6 || py < 6 || px >= w - 6 || py >= h - 6;
    if (onEdge) {
      edgeDry += lum < 0.45 ? 1 : 0;
      edgeCount += 1;
    } else if (px > 32 && px < 96 && py > 32 && py < 96) {
      innerSat += sat;
      innerCount += 1;
    }
    gVals.push(g);
  }

  gMean = gVals.reduce((a, v) => a + v, 0) / gVals.length;
  gVarAccum = gVals.reduce((a, v) => a + (v - gMean) ** 2, 0) / gVals.length;

  const yellowRatio = yellow / n;
  const whiteRatio = white / n;
  const brownRatio = brown / n;
  const darkRatio = dark / n;
  const edgeDryScore = edgeCount ? edgeDry / edgeCount : 0;
  const curlScore = clamp(Math.sqrt(gVarAccum) * 1.4, 0, 1);

  if (typeof bmp.close === 'function') bmp.close();

  return {
    yellowRatio,
    whiteRatio,
    brownRatio,
    darkRatio,
    edgeDryScore,
    curlScore,
    avgSaturation: innerCount ? innerSat / innerCount : 0,
  };
}

function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

function defaultFeatures() {
  return {
    yellowRatio: 0.05,
    whiteRatio: 0.05,
    brownRatio: 0.05,
    darkRatio: 0.05,
    edgeDryScore: 0.05,
    curlScore: 0.05,
    avgSaturation: 0.2,
  };
}
