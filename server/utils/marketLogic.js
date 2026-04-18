/**
 * Deterministic mock market intelligence for hackathon demos.
 */

const BASE_PRICES = {
  Tomato: 18,
  Cotton: 62,
  Maize: 22,
  Wheat: 24,
  Rice: 32,
  Chilli: 85,
  Potato: 16,
  Soybean: 48,
  Sugarcane: 3.2,
  Groundnut: 58,
};

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function getCurrentMockPrice({ crop, state = '', district = '' }) {
  const base = BASE_PRICES[crop] ?? 28;
  const loc = `${state}|${district}`.toLowerCase();
  const jitter = (hashStr(loc) % 15) / 100 - 0.05;
  const price = Math.max(2, Math.round(base * (1 + jitter) * 10) / 10);
  return { currentPrice: price, unit: crop === 'Sugarcane' ? '₹/q' : '₹/kg' };
}

export function predictMarketMock({ crop, state = '', district = '' }) {
  const { currentPrice, unit } = getCurrentMockPrice({ crop, state, district });
  const seed = hashStr(`${crop}|${state}|${district}`);
  const weekDrift = ((seed % 17) - 8) / 200;
  const monthDrift = ((seed % 23) - 9) / 120;

  const predictedPriceWeek = Math.round(currentPrice * (1 + weekDrift) * 10) / 10;
  const predictedPriceMonth = Math.round(currentPrice * (1 + monthDrift) * 10) / 10;

  let recommendation = 'Hold';
  if (predictedPriceMonth > currentPrice * 1.08) recommendation = 'Hold';
  else if (predictedPriceMonth < currentPrice * 0.92) recommendation = 'Sell';
  else if (predictedPriceWeek > currentPrice * 1.04) recommendation = 'Hold';
  else if (predictedPriceMonth > currentPrice * 1.03) recommendation = 'Buy';
  else recommendation = 'Hold';

  if (predictedPriceMonth >= currentPrice * 1.12) recommendation = 'Hold';
  if (predictedPriceMonth <= currentPrice * 0.88) recommendation = 'Sell';

  const confidence = 68 + (seed % 22);

  const trendSeries = [];
  for (let i = -6; i <= 14; i += 1) {
    const wave = Math.sin((seed + i) / 3) * 0.04;
    const p =
      i <= 0
        ? Math.round(currentPrice * (1 + wave + i * 0.008) * 10) / 10
        : Math.round(currentPrice * (1 + wave + (predictedPriceMonth - currentPrice) * (i / 14)) * 10) / 10;
    trendSeries.push({
      label: i <= 0 ? `W${i + 6}` : `+${i}d`,
      price: Math.max(1, p),
      projected: i > 0,
    });
  }

  const location = [district, state].filter(Boolean).join(', ') || 'India';

  return {
    crop,
    state,
    district,
    location,
    currentPrice,
    predictedPriceWeek,
    predictedPriceMonth,
    predictedPrice: predictedPriceMonth,
    recommendation,
    confidence,
    trendSeries,
    unit,
  };
}
