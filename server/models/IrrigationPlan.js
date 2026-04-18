import mongoose from 'mongoose';

const scheduleEntrySchema = new mongoose.Schema(
  {
    date: String,
    dayLabel: String,
    liters: Number,
    note: String,
  },
  { _id: false },
);

const irrigationPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: String,
    landSize: Number,
    soilType: String,
    weather: String,
    waterSource: String,
    waterNeeded: { type: Number, required: true },
    waterNeededToday: Number,
    nextIrrigationDate: String,
    schedule: [scheduleEntrySchema],
    tips: [String],
    droughtWarning: { type: Boolean, default: false },
    droughtMessage: String,
  },
  { timestamps: true },
);

irrigationPlanSchema.index({ userId: 1, createdAt: -1 });

export const IrrigationPlan = mongoose.model('IrrigationPlan', irrigationPlanSchema);
