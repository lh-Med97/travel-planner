import { Router } from 'express';
import {
  getRecommendations,
  generateItinerary,
  getTravelTips,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/recommendations', authenticate, getRecommendations);
router.post('/itinerary', authenticate, generateItinerary);
router.post('/travel-tips', authenticate, getTravelTips);

export default router;
