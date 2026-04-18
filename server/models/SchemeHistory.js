import mongoose from 'mongoose';

const schemeHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    filters: {
      state: String,
      landSize: Number,
      cropType: String,
      farmerCategory: String,
    },
    results: [
      {
        name: String,
        benefitAmount: String,
        eligibility: String,
        applySteps: [String],
        officialLink: String,
      },
    ],
  },
  { timestamps: true },
);

schemeHistorySchema.index({ userId: 1, createdAt: -1 });

export const SchemeHistory = mongoose.model('SchemeHistory', schemeHistorySchema);
