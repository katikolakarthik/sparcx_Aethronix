/** Mock pest outbreak risk */

const PEST_BY_CROP = {
  Cotton: [
    { name: 'American Bollworm', note: 'Flowering to boll stage is most vulnerable.' },
    { name: 'Whitefly', note: 'Virus vector — monitor underside of leaves.' },
  ],
  Tomato: [
    { name: 'Fruit borer (Helicoverpa)', note: 'Fruit scarring and entry holes.' },
    { name: 'Leaf miner', note: 'Serpentine mines reduce photosynthesis.' },
  ],
  Rice: [
    { name: 'Brown planthopper', note: 'Hopper burn in dense humid canopies.' },
    { name: 'Stem borer', note: 'Dead hearts in vegetative stage.' },
  ],
  Maize: [{ name: 'Fall armyworm', note: 'Ragged feeding in whorl leaves.' }],
  Wheat: [{ name: 'Aphid', note: 'Sooty mould risk under prolonged humid cool weather.' }],
  default: [{ name: 'Generic chewing pests', note: 'Scout field edges weekly.' }],
};

export function predictPestMock({ crop, location, season, weather }) {
  const c = crop || 'Cotton';
  let risk = 38;
  const w = (weather || '').toLowerCase();
  if (w.includes('humid') || w.includes('rain')) risk += 22;
  if (w.includes('hot') || w.includes('dry')) risk += 8;
  if ((season || '').toLowerCase().includes('kharif')) risk += 10;
  if (c === 'Cotton' && w.includes('humid')) risk += 15;

  risk = Math.min(98, Math.max(12, Math.round(risk)));

  let severity = 'Low';
  if (risk >= 70) severity = 'High';
  else if (risk >= 45) severity = 'Medium';

  const pests = (PEST_BY_CROP[c] || PEST_BY_CROP.default).map((p, i) => ({
    name: p.name,
    riskContribution: Math.round(risk / (i + 2)),
    note: p.note,
  }));

  const preventionTips = [
    'Install pheromone traps at economic threshold levels.',
    'Encourage natural enemies — avoid broad-spectrum sprays early season.',
    'Rotate chemistries with different IRAC groups to delay resistance.',
    'Maintain field sanitation — destroy crop residues responsibly.',
  ];

  const treatmentNote =
    severity === 'High'
      ? 'Consider targeted IPM spray after field scouting confirmation; follow label PHI strictly.'
      : 'Preventive bio-pesticides or neem-based formulations may suffice — confirm with local extension.';

  return {
    crop: c,
    location: location || '—',
    season: season || 'Kharif',
    weather: weather || 'Normal',
    riskScore: risk,
    severity,
    pests,
    preventionTips,
    treatmentNote,
  };
}
