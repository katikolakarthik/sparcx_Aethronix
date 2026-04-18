import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    lang: { type: String, default: 'en' },
  },
  { timestamps: true },
);

chatHistorySchema.index({ userId: 1, createdAt: -1 });

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
