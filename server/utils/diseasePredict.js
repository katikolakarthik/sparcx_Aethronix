/**
 * Mock disease classifier from coarse image features (computed on the client).
 * Swap for a real vision model endpoint later.
 */

const DISEASE_PACKS = {
  'Leaf Blight': {
    cause: 'Fungal complexes (Alternaria / Helminthosporium-type) exploit prolonged leaf wetness and nutrient stress.',
    preventionTips: [
      'Improve row spacing for faster canopy dry-down.',
      'Avoid overhead irrigation late in the day.',
      'Rotate with non-host crops where possible.',
    ],
    medicines: [
      {
        name: 'Mancozeb 75% WP',
        usageAmount: '2.0–2.5 g per litre of water',
        sprayMethod: 'Fine mist foliar spray covering both leaf surfaces',
        duration: 'Every 7–10 days for 2–3 cycles',
        safetyPrecautions: 'Use gloves and mask; observe pre-harvest interval (PHI).',
        priceEstimate: 980,
      },
      {
        name: 'Azoxystrobin + Difenoconazole (combo)',
        usageAmount: 'As per label ml/acre in adequate water volume',
        sprayMethod: 'Alternate nozzle for uniform coverage; spray before dew sets',
        duration: 'Two applications 10 days apart if infection persists',
        safetyPrecautions: 'Do not mix with strongly alkaline products.',
        priceEstimate: 2450,
      },
    ],
  },
  'Powdery Mildew': {
    cause: 'Erysiphe / Oidium-type fungi on susceptible tissue under warm days and cool nights.',
    preventionTips: [
      'Prune dense foliage to increase light penetration.',
      'Apply preventive sulfur-based sprays before peak humidity.',
      'Choose resistant cultivars for next season.',
    ],
    medicines: [
      {
        name: 'Sulfur Fungicide',
        usageAmount: '2–3 g per litre (check label for crop)',
        sprayMethod: 'Even foliar coat; avoid high temperatures (>32°C)',
        duration: '7-day interval; max 3 sprays per outbreak',
        safetyPrecautions: 'Avoid mixing with oils; eye protection required.',
        priceEstimate: 620,
      },
      {
        name: 'Neem Oil Spray',
        usageAmount: '5 ml oil + 1 ml mild soap per litre',
        sprayMethod: 'Spray underside of leaves in early morning',
        duration: 'Every 5–7 days as anti-feedant / mild fungistat',
        safetyPrecautions: 'Test-spray a small area to rule out phytotoxicity.',
        priceEstimate: 410,
      },
      {
        name: 'Potassium Bicarbonate',
        usageAmount: '5–8 g per litre',
        sprayMethod: 'High-volume spray to runoff on affected foliage',
        duration: '3 applications, 4–5 days apart',
        safetyPrecautions: 'Rinse equipment; avoid tank-mix incompatibilities.',
        priceEstimate: 360,
      },
    ],
  },
  'Rust Disease': {
    cause: 'Rust fungi (urediniospores) cycling on living tissue under moist, mild conditions.',
    preventionTips: [
      'Destroy volunteer hosts and crop debris after harvest.',
      'Scout lower canopy weekly during humid spells.',
      'Balance nitrogen to reduce lush susceptible growth.',
    ],
    medicines: [
      {
        name: 'Propiconazole / Tebuconazole (systemic)',
        usageAmount: 'Label rate per hectare in 500 L water typical',
        sprayMethod: 'Ground sprayer with hollow-cone nozzles',
        duration: 'Two sprays 12–15 days apart',
        safetyPrecautions: 'Rotate MOA groups; respect PHI.',
        priceEstimate: 1890,
      },
      {
        name: 'Sulfur Fungicide',
        usageAmount: '2 g per litre',
        sprayMethod: 'Contact coverage on pustule-heavy leaves',
        duration: 'Weekly until pustules dry',
        safetyPrecautions: 'Do not apply with oils on sensitive crops.',
        priceEstimate: 620,
      },
    ],
  },
  'Viral Infection': {
    cause: 'Viral pathogens often vectored by aphids / whiteflies; curling from hormone disruption.',
    preventionTips: [
      'Control vectors with reflective mulches and biocontrol.',
      'Remove infected plants early to slow spread.',
      'Sanitize tools between plots.',
    ],
    medicines: [
      {
        name: 'Insecticidal Soap + Neem rotation',
        usageAmount: 'Soap 2%; neem 0.5–1% emulsion',
        sprayMethod: 'Target vector hotspots (leaf undersides)',
        duration: '5-day interval for 3 weeks',
        safetyPrecautions: 'Beneficial-safe windows; avoid bloom if pollinators active.',
        priceEstimate: 520,
      },
      {
        name: 'Imidacloprid (seedling drench) — if permitted',
        usageAmount: 'Strictly label-only for your crop/region',
        sprayMethod: 'Drench or soil application per agronomist advice',
        duration: 'Single establishment treatment where legal',
        safetyPrecautions: 'Follow local regulations; protect pollinators.',
        priceEstimate: 890,
      },
    ],
  },
  'Bacterial Rot': {
    cause: 'Bacteria enter through wounds; spread via splashing rain and high humidity films.',
    preventionTips: [
      'Avoid working wet fields; disinfect pruning tools.',
      'Improve drainage and reduce soil splash onto fruit.',
      'Copper-based protectants before forecast rains.',
    ],
    medicines: [
      {
        name: 'Copper Oxychloride',
        usageAmount: '2.5 g per litre (crop-specific)',
        sprayMethod: 'Preventive spray before infection windows',
        duration: '7–10 day interval during wet phase',
        safetyPrecautions: 'Copper accumulation risk — do not overdose.',
        priceEstimate: 740,
      },
      {
        name: 'Streptomycin Spray (where legally allowed)',
        usageAmount: 'As per local extension bulletin only',
        sprayMethod: 'Fine spray early morning',
        duration: 'Maximum 2 sprays; alternate with copper',
        safetyPrecautions: 'Antibiotic stewardship — follow national rules.',
        priceEstimate: 1320,
      },
    ],
  },
  'Healthy (no clear disease signature)': {
    cause: 'No dominant disease pattern detected from color texture heuristics.',
    preventionTips: [
      'Continue weekly scouting with clear photos in natural light.',
      'Maintain balanced nutrition and irrigation scheduling.',
      'Re-run detection if symptoms worsen.',
    ],
    medicines: [
      {
        name: 'Preventive Neem Oil (maintenance)',
        usageAmount: '3–5 ml per litre with sticker',
        sprayMethod: 'Light foliar maintenance spray',
        duration: 'Every 14 days during high-risk weeks',
        safetyPrecautions: 'Avoid midday heat application.',
        priceEstimate: 280,
      },
    ],
  },
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function inferCrop(hint) {
  const h = String(hint || '').toLowerCase();
  if (!h) return 'Mixed / unspecified';
  if (/(tomato|potato|chilli|rice|cotton|maize|wheat)/i.test(h)) return hint.trim();
  return hint.trim() || 'Mixed / unspecified';
}

/**
 * @param {object} features - ratios 0..1 from client image scan
 * @param {string} cropHint
 */
export function predictDiseaseFromFeatures(features, cropHint = '') {
  const f = features || {};
  const yellow = Number(f.yellowRatio) || 0;
  const white = Number(f.whiteRatio) || 0;
  const brown = Number(f.brownRatio) || 0;
  const dark = Number(f.darkRatio) || 0;
  const dryEdge = Number(f.edgeDryScore) || 0;
  const curl = Number(f.curlScore) || 0;

  let key = 'Healthy (no clear disease signature)';
  let confidence = 58 + Math.floor(Math.random() * 8);

  // Priority rules (user examples)
  if (yellow > 0.1 && dryEdge > 0.12) {
    key = 'Leaf Blight';
    confidence = 86 + Math.floor(Math.random() * 8);
  } else if (white > 0.14) {
    key = 'Powdery Mildew';
    confidence = 84 + Math.floor(Math.random() * 10);
  } else if (brown > 0.09) {
    key = 'Rust Disease';
    confidence = 81 + Math.floor(Math.random() * 9);
  } else if (curl > 0.16) {
    key = 'Viral Infection';
    confidence = 72 + Math.floor(Math.random() * 10);
  } else if (dark > 0.22) {
    key = 'Bacterial Rot';
    confidence = 78 + Math.floor(Math.random() * 9);
  }

  const pack = DISEASE_PACKS[key];
  const medicines = pack.medicines.map((m) => ({ ...m }));
  const estimatedTreatmentCost = medicines.reduce((a, m) => a + (m.priceEstimate || 0), 0);

  let severity = 'Low';
  if (key !== 'Healthy (no clear disease signature)') {
    if (confidence > 88 || ['Bacterial Rot', 'Rust Disease'].includes(key)) severity = 'High';
    else if (confidence > 78) severity = 'Medium';
    else severity = 'Low';
  }

  const recoveryChance =
    key === 'Healthy (no clear disease signature)'
      ? 94
      : clamp(92 - (severity === 'High' ? 18 : severity === 'Medium' ? 10 : 4), 55, 93);

  return {
    diseaseName: key,
    confidence: clamp(confidence, 55, 97),
    severity,
    cropType: inferCrop(cropHint),
    cause: pack.cause,
    preventionTips: [...pack.preventionTips],
    medicines,
    recoveryChance,
    estimatedTreatmentCost,
  };
}
