/**
 * Mock AI prediction engine — rule-based heuristics with realistic-ish outputs.
 * Designed to be swapped for a real ML service later.
 */

const CROP_PROFILES = {
  Rice: {
    baseYieldPerAcre: 4.2,
    costPerAcre: 1850,
    pricePerTon: 420,
    idealRainMin: 100,
    idealRainMax: 220,
    idealTempMin: 22,
    idealTempMax: 32,
    idealSoils: ['Clay', 'Black'],
    waterNeed: 'High',
  },
  Cotton: {
    baseYieldPerAcre: 1.6,
    costPerAcre: 2100,
    pricePerTon: 980,
    idealRainMin: 50,
    idealRainMax: 110,
    idealTempMin: 24,
    idealTempMax: 36,
    idealSoils: ['Black', 'Red'],
    waterNeed: 'Moderate',
  },
  Maize: {
    baseYieldPerAcre: 3.4,
    costPerAcre: 1420,
    pricePerTon: 310,
    idealRainMin: 65,
    idealRainMax: 140,
    idealTempMin: 18,
    idealTempMax: 30,
    idealSoils: ['Sandy', 'Red', 'Black'],
    waterNeed: 'Moderate',
  },
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function pickRecommendedCrop({
  rainfall,
  soilType,
  waterAvailability,
  temperature,
  cropPreference,
}) {
  const highRain = rainfall >= 115;
  const mediumRain = rainfall >= 65 && rainfall < 115;
  const lowWater =
    /low|scarce|limited/i.test(String(waterAvailability || ''));

  // Priority rules from spec
  if (highRain && soilType === 'Clay') return 'Rice';
  if (lowWater && soilType === 'Black') return 'Cotton';
  if (mediumRain && soilType === 'Sandy') return 'Maize';

  // Preference when user chose a specific crop
  if (cropPreference && cropPreference !== 'Auto' && CROP_PROFILES[cropPreference]) {
    return cropPreference;
  }

  // Fallback heuristics
  if (rainfall >= 100) return 'Rice';
  if (lowWater || rainfall < 70) return soilType === 'Black' ? 'Cotton' : 'Maize';
  if (soilType === 'Sandy') return 'Maize';
  if (soilType === 'Clay') return 'Rice';
  return 'Maize';
}

function climateMismatchScore(profile, rainfall, temperature) {
  let rainPenalty = 0;
  if (rainfall < profile.idealRainMin) {
    rainPenalty = (profile.idealRainMin - rainfall) * 0.35;
  } else if (rainfall > profile.idealRainMax) {
    rainPenalty = (rainfall - profile.idealRainMax) * 0.25;
  }

  let tempPenalty = 0;
  if (temperature < profile.idealTempMin) {
    tempPenalty = (profile.idealTempMin - temperature) * 2.2;
  } else if (temperature > profile.idealTempMax) {
    tempPenalty = (temperature - profile.idealTempMax) * 2.0;
  }

  return clamp(rainPenalty + tempPenalty, 0, 55);
}

function soilCompatibilityPercent(soilType, profile) {
  if (profile.idealSoils.includes(soilType)) return clamp(88 + Math.random() * 8, 85, 97);
  return clamp(58 + Math.random() * 15, 52, 78);
}

function climateSuitabilityPercent(profile, rainfall, temperature) {
  const mismatch = climateMismatchScore(profile, rainfall, temperature);
  return clamp(96 - mismatch, 45, 99);
}

function waterNeedStatus(profile, waterAvailability) {
  const w = String(waterAvailability || '').toLowerCase();
  const need = profile.waterNeed;
  if (need === 'High' && /low|scarce|limited/.test(w)) return 'Stress — increase irrigation';
  if (need === 'Moderate' && /abundant|high/.test(w)) return 'Comfortable reserve';
  if (need === 'High' && /abundant|high|moderate/.test(w)) return 'Adequate for paddy-style practice';
  return 'Monitor weekly';
}

function buildReason(crop, soilType, rainfall, waterAvailability) {
  const parts = [
    `${crop} aligns with your soil (${soilType}) and seasonal rainfall (~${rainfall} mm).`,
  ];
  if (crop === 'Rice') parts.push('High moisture regimes favor flooded or saturated root zones.');
  if (crop === 'Cotton') parts.push('Drier canopy periods help boll development when water is managed.');
  if (crop === 'Maize') parts.push('Warm days with controlled water stress windows suit grain fill.');
  parts.push(`Water availability noted as "${waterAvailability}" — plan field operations accordingly.`);
  return parts.join(' ');
}

function alternatives(primary) {
  const all = ['Rice', 'Cotton', 'Maize'];
  return all.filter((c) => c !== primary).map((c) => ({
    crop: c,
    ...CROP_PROFILES[c],
  }));
}

function fertilizersFor(crop) {
  if (crop === 'Rice') return ['Urea split doses', 'DAP at basal', 'Potash for tillering'];
  if (crop === 'Cotton') return ['Complex NPK', 'ZnSO₄ if deficiency', 'Boron spray at flowering'];
  return ['Balanced NPK', 'Organic compost integration', 'Micronutrient foliar if yellowing'];
}

function pestWarnings(crop, season) {
  const s = String(season || '').toLowerCase();
  const base =
    crop === 'Rice'
      ? ['Watch stem borer & leaf folder in humid stretches', 'Scout for blast if nights stay cool-wet']
      : crop === 'Cotton'
        ? ['Pink bollworm monitoring after square formation', 'Whitefly vector vigil in warm dry spells']
        : ['Fall armyworm early-season sweeps', 'Stored grain pests if harvest moisture is high'];
  if (/monsoon|kharif|rainy/.test(s)) base.push('Elevated fungal pressure — improve canopy airflow');
  return base;
}

/**
 * @param {object} input - normalized simulation inputs
 * @returns {object} prediction payload + numbers for persistence
 */
export function runPrediction(input) {
  const {
    landSize,
    soilType,
    waterAvailability,
    budget,
    season,
    rainfall,
    temperature,
    cropPreference,
  } = input;

  const land = Number(landSize) || 1;
  const rain = Number(rainfall) || 0;
  const temp = Number(temperature) || 26;
  const soil = soilType || 'Sandy';

  const recommendedCrop = pickRecommendedCrop({
    rainfall: rain,
    soilType: soil,
    waterAvailability,
    temperature: temp,
    cropPreference,
  });

  const profile = CROP_PROFILES[recommendedCrop];
  const yieldVariance = 0.92 + Math.random() * 0.12;
  const yieldTons = Number((profile.baseYieldPerAcre * land * yieldVariance).toFixed(2));

  const baseCost = profile.costPerAcre * land * (0.95 + Math.random() * 0.08);
  const cost = Math.min(Number(budget) || Infinity, Math.round(baseCost));
  const revenue = Math.round(yieldTons * profile.pricePerTon * (0.97 + Math.random() * 0.05));
  const profit = revenue - cost;

  const climateMismatch = climateMismatchScore(profile, rain, temp);
  const riskScore = Math.round(
    clamp(18 + climateMismatch + (profit < 0 ? 22 : 0) + (cost > (Number(budget) || cost) ? 12 : 0), 8, 94),
  );

  const climateSuitability = Math.round(climateSuitabilityPercent(profile, rain, temp));
  const soilCompatibility = Math.round(soilCompatibilityPercent(soil, profile));
  const waterStatus = waterNeedStatus(profile, waterAvailability);

  return {
    recommendedCrop,
    yield: yieldTons,
    cost,
    revenue,
    profit,
    risk: riskScore,
    climateSuitability,
    soilCompatibility,
    waterNeedStatus: waterStatus,
    recommendationReason: buildReason(recommendedCrop, soil, rain, waterAvailability),
    alternativeCrops: alternatives(recommendedCrop).map((a) => ({
      name: a.crop,
      estProfit: Math.round(
        a.baseYieldPerAcre * land * a.pricePerTon - a.costPerAcre * land,
      ),
    })),
    suggestedFertilizers: fertilizersFor(recommendedCrop),
    pestWarnings: pestWarnings(recommendedCrop, season),
  };
}

export { CROP_PROFILES };
