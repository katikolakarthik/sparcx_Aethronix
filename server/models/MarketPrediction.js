import mongoose from 'mongoose';

const trendPointSchema = new mongoose.Schema(
  {
    label: String,
    price: Number,
    projected: { type: Boolean, default: false },
  },
  { _id: false },
);

const marketPredictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: { type: String, required: true },
    state: String,
    district: String,
    location: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    predictedPriceWeek: Number,
    predictedPriceMonth: Number,
    predictedPrice: Number,
    recommendation: { type: String, required: true },
    confidence: { type: Number, required: true },
    trendSeries: [trendPointSchema],
    unit: { type: String, default: '₹/kg' },
  },
  { timestamps: true },
);

marketPredictionSchema.index({ userId: 1, createdAt: -1 });

export const MarketPrediction = mongoose.model('MarketPrediction', marketPredictionSchema);
