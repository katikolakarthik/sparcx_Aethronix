import mongoose from 'mongoose';

const pestEntrySchema = new mongoose.Schema(
  {
    name: String,
    riskContribution: Number,
    note: String,
  },
  { _id: false },
);

const pestAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: String,
    location: String,
    season: String,
    weather: String,
    riskScore: { type: Number, required: true },
    severity: { type: String, required: true },
    pests: [pestEntrySchema],
    preventionTips: [String],
    treatmentNote: String,
  },
  { timestamps: true },
);

pestAlertSchema.index({ userId: 1, createdAt: -1 });

export const PestAlert = mongoose.model('PestAlert', pestAlertSchema);
