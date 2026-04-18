/** Mock government scheme recommendations */

const SCHEME_CATALOG = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    benefitAmount: '₹6,000 / year (3 instalments)',
    eligibility: 'Small & marginal farmers with cultivable land; valid land records.',
    applySteps: ['Visit PM-KISAN portal', 'Register with Aadhaar & land details', 'Track status online'],
    officialLink: 'https://pmkisan.gov.in/',
    minLand: 0,
    requireCategory: null,
  },
  {
    id: 'crop-insurance',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefitAmount: 'Premium subsidy up to ~90% for notified crops',
    eligibility: 'Loanee & non-loanee farmers growing notified crops in notified areas.',
    applySteps: ['Contact bank / CSC / insurer', 'Declare crop & area', 'Pay subsidised premium before deadline'],
    officialLink: 'https://pmfby.gov.in/',
    minLand: 0,
    requireCategory: null,
  },
  {
    id: 'drip',
    name: 'Micro Irrigation Fund / State Drip Subsidy',
    benefitAmount: 'Up to 55–90% subsidy on drip & sprinkler (state dependent)',
    eligibility: 'Farmers adopting micro-irrigation on eligible crops; DPR may be required.',
    applySteps: ['Apply via state horticulture / agriculture portal', 'Vendor empanelment', 'Inspection & release'],
    officialLink: 'https://agricoop.gov.in/',
    minLand: 0.5,
    requireCategory: null,
  },
  {
    id: 'seed-subsidy',
    name: 'Seed Mini-Kit / Certified Seed Subsidy',
    benefitAmount: '₹500–5,000 / ha (illustrative)',
    eligibility: 'Farmers purchasing certified seeds through designated agencies.',
    applySteps: ['Visit block agriculture office', 'Submit land passbook', 'Collect subsidised seed voucher'],
    officialLink: 'https://agricoop.gov.in/',
    minLand: 0,
    requireCategory: null,
  },
  {
    id: 'agri-infra',
    name: 'Agriculture Infrastructure Fund (AIF)',
    benefitAmount: 'Interest subvention + credit guarantee for eligible projects',
    eligibility: 'FPOs, startups, entrepreneurs setting up cold storage, processing, etc.',
    applySteps: ['Prepare project report', 'Apply through lending institutions', 'Approval & disbursement'],
    officialLink: 'https://agriinfra.dac.gov.in/',
    minLand: 0,
    requireCategory: ['FPO', 'Entrepreneur', 'Startup', 'Large farmer'],
  },
  {
    id: 'custom-hiring',
    name: 'National Mission on Agricultural Mechanisation',
    benefitAmount: '40–50% subsidy on farm machinery (CHC model)',
    eligibility: 'Farmers / groups establishing custom hiring centres in cluster areas.',
    applySteps: ['Apply on state SAM portal', 'Quotations from OEM', 'Inspection & subsidy release'],
    officialLink: 'https://agricoop.gov.in/',
    minLand: 1,
    requireCategory: null,
  },
];

function categoryMatch(requireCategory, farmerCategory) {
  if (!requireCategory) return true;
  const fc = (farmerCategory || '').toLowerCase();
  return requireCategory.some((c) => fc.includes(c.toLowerCase()));
}

export function recommendSchemesMock({ state, landSize, cropType, farmerCategory }) {
  const land = Number(landSize) || 0;

  return SCHEME_CATALOG.filter((s) => {
    if (land < s.minLand) return false;
    if (!categoryMatch(s.requireCategory, farmerCategory)) return false;
    return true;
  }).map(({ id, name, benefitAmount, eligibility, applySteps, officialLink }) => ({
    id,
    name,
    benefitAmount,
    eligibility,
    applySteps,
    officialLink,
    stateHint: state || 'Your state agriculture portal',
    cropType: cropType || 'Any',
  }));
}
