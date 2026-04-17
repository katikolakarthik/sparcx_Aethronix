import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    landSize: { type: Number, required: true },
    soilType: { type: String, required: true },
    water: { type: String, required: true },
    budget: { type: Number, required: true },
    season: { type: String, default: '' },
    rainfall: { type: Number, default: 0 },
    temperature: { type: Number, default: 0 },
    cropPreference: { type: String, default: 'Auto' },
    recommendedCrop: { type: String, required: true },
    yield: { type: Number, required: true },
    cost: { type: Number, required: true },
    revenue: { type: Number, required: true },
    profit: { type: Number, required: true },
    risk: { type: Number, required: true },
    // Extended AI-style fields (returned to client & history)
    climateSuitability: { type: Number, default: 0 },
    soilCompatibility: { type: Number, default: 0 },
    waterNeedStatus: { type: String, default: '' },
    recommendationReason: { type: String, default: '' },
    alternativeCrops: [{ name: String, estProfit: Number }],
    suggestedFertilizers: [{ type: String }],
    pestWarnings: [{ type: String }],
  },
  { timestamps: true },
);

simulationSchema.index({ userId: 1, createdAt: -1 });

export const Simulation = mongoose.model('Simulation', simulationSchema);
