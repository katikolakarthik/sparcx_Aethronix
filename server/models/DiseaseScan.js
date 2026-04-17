import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: String,
    usageAmount: String,
    sprayMethod: String,
    duration: String,
    safetyPrecautions: String,
    priceEstimate: Number,
  },
  { _id: false },
);

const storeSchema = new mongoose.Schema(
  {
    name: String,
    distance: String,
    address: String,
    availableMedicines: [String],
    isOpen: Boolean,
    contactNumber: String,
  },
  { _id: false },
);

const diseaseScanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true },
    cropType: { type: String, default: '' },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, required: true },
    severity: { type: String, required: true },
    medicines: [medicineSchema],
    stores: [storeSchema],
    // Extended report fields
    cause: { type: String, default: '' },
    preventionTips: [{ type: String }],
    recoveryChance: { type: Number, default: 0 },
    estimatedTreatmentCost: { type: Number, default: 0 },
  },
  { timestamps: true },
);

diseaseScanSchema.index({ userId: 1, createdAt: -1 });

export const DiseaseScan = mongoose.model('DiseaseScan', diseaseScanSchema);
