import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ChatHistory } from '../models/ChatHistory.js';
import { chatReplyMock } from '../utils/chatLogic.js';

const router = Router();
router.use(requireAuth);

/** POST /api/chat/message */
router.post('/message', async (req, res) => {
  try {
    const { message, lang = 'en' } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'message is required' });
    }
    const response = chatReplyMock(message, lang);
    const doc = await ChatHistory.create({
      userId: req.userId,
      message: message.slice(0, 2000),
      response,
      lang,
    });
    return res.status(201).json({ response: doc.response, id: doc._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Chat failed' });
  }
});

export default router;
