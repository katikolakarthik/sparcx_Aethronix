/** Mock irrigation planner */

const CROP_WATER = {
  Tomato: 5.2,
  Cotton: 7.8,
  Maize: 5.5,
  Wheat: 4.8,
  Rice: 12,
  Chilli: 5.0,
  Potato: 4.2,
  Soybean: 5.6,
  Sugarcane: 8.5,
  Groundnut: 4.9,
};

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function buildIrrigationPlanMock(body) {
  const crop = body.crop || 'Cotton';
  const landSize = Number(body.landSize) || 1;
  const soilType = body.soilType || 'Loamy';
  const weather = body.weather || 'Normal';
  const waterSource = body.waterSource || 'Borewell';

  let factor = CROP_WATER[crop] ?? 5.5;
  if (/sandy/i.test(soilType)) factor *= 1.15;
  if (/clay/i.test(soilType)) factor *= 0.92;
  if (/hot|dry/i.test(weather)) factor *= 1.12;
  if (/rain|humid/i.test(weather)) factor *= 0.88;

  const waterNeeded = Math.round(factor * landSize * 1000);
  const waterNeededToday = Math.round(waterNeeded * 0.18);

  const today = new Date();
  const interval = /rain|humid/i.test(weather) ? 4 : 2;
  const nextIrrigationDate = addDays(today, interval);

  const schedule = [];
  for (let i = 0; i < 7; i += 1) {
    const day = addDays(today, i * interval);
    schedule.push({
      date: day,
      dayLabel: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day).getDay()],
      liters: Math.round(waterNeeded * (0.12 + (i % 3) * 0.04)),
      note: i === 0 ? 'Light morning pass' : 'Deep soil wetting',
    });
  }

  const droughtWarning = /hot|dry/i.test(weather) && landSize > 5;
  const droughtMessage = droughtWarning
    ? 'Elevated evapotranspiration — shorten intervals and mulch exposed rows.'
    : '';

  const tips = [
    'Irrigate early morning (5–8 AM) to minimise evaporation loss.',
    waterSource === 'Canal'
      ? 'Align with canal rotation — top-up root zone 24h before dry spell.'
      : 'Check pump discharge — target uniform emitter flow in drip systems.',
    'Maintain field bunds to reduce percolation losses on sloped plots.',
  ];

  return {
    crop,
    landSize,
    soilType,
    weather,
    waterSource,
    waterNeeded,
    waterNeededToday,
    nextIrrigationDate,
    schedule,
    tips,
    droughtWarning,
    droughtMessage,
  };
}
