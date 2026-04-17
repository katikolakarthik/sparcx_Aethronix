/**
 * Mock agricultural input stores (coordinates near Hyderabad / generic India belt).
 * Replace with maps API or partner inventory later.
 */
export const MOCK_STORES = [
  {
    id: 's1',
    name: 'GreenAgro Supply Co.',
    lat: 17.4678,
    lng: 78.3877,
    address: '12 Field Lane, Medchal Road, Telangana',
    medicines: ['Sulfur Fungicide', 'Neem Oil Spray', 'Copper Oxychloride', 'Potassium Bicarbonate'],
    phone: '+91 98765 43210',
  },
  {
    id: 's2',
    name: 'Krishi Mitra Inputs',
    lat: 17.4419,
    lng: 78.3967,
    address: 'Plot 4, Agri Complex, Secunderabad',
    medicines: ['Neem Oil Spray', 'Streptomycin Spray', 'Mancozeb', 'Bio-fungicide'],
    phone: '+91 91234 55678',
  },
  {
    id: 's3',
    name: 'Village Crop Care Center',
    lat: 17.385,
    lng: 78.4867,
    address: 'NH44 Service Road, Shamshabad',
    medicines: ['Sulfur Fungicide', 'Systemic Fungicide', 'Insecticidal Soap'],
    phone: '+91 99887 77665',
  },
  {
    id: 's4',
    name: 'Haritha Agri Mart',
    lat: 17.4065,
    lng: 78.4772,
    address: 'Near Rythu Bazar, LB Nagar',
    medicines: ['Potassium Bicarbonate', 'Neem Oil Spray', 'Horticultural Oil'],
    phone: '+91 90001 22334',
  },
  {
    id: 's5',
    name: 'Southern Farm Chemists',
    lat: 17.3606,
    lng: 78.4747,
    address: '88 Sultan Bazar, Hyderabad',
    medicines: ['Copper Oxychloride', 'Mancozeb', 'Sulfur Fungicide'],
    phone: '+91 94400 11223',
  },
];

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in km */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * @param {{ lat?: number, lng?: number, city?: string, neededMedicines?: string[] }} query
 */
export function findNearbyStores(query) {
  const lat = Number(query.lat) || 17.4065;
  const lng = Number(query.lng) || 78.4772;
  const needed = (query.neededMedicines || []).map((m) => m.toLowerCase());

  const hour = new Date().getHours();
  const openDefault = hour >= 8 && hour < 20;

  const ranked = MOCK_STORES.map((s) => {
    const km = distanceKm(lat, lng, s.lat, s.lng);
    const matchScore = needed.length
      ? needed.filter((m) => s.medicines.some((x) => x.toLowerCase().includes(m))).length
      : 0;
    return { ...s, km, matchScore };
  })
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return a.km - b.km;
    })
    .slice(0, 5);

  return ranked.map((s) => {
    const isOpen = openDefault && s.km < 80;
    return {
      name: s.name,
      distance: `${s.km.toFixed(1)} km`,
      distanceKm: Number(s.km.toFixed(2)),
      address: s.address,
      availableMedicines: s.medicines,
      isOpen,
      contactNumber: s.phone,
      lat: s.lat,
      lng: s.lng,
    };
  });
}
