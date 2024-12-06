import { Router } from 'express';
import { getRecommendations, generateItinerary, getTravelTips } from '../controllers/ai.controller';
import { aiLimiter } from '../utils/rateLimit';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { recommendationSchema, itinerarySchema, travelTipsSchema } from '../lib/validations/schema';

const router = Router();

// Apply rate limiting to all AI routes
router.use(aiLimiter);

// Protected AI routes
router.post('/recommendations', 
  authenticate,
  validateRequest(recommendationSchema),
  getRecommendations
);

router.post('/itinerary',
  authenticate,
  validateRequest(itinerarySchema),
  generateItinerary
);

router.post('/travel-tips',
  authenticate,
  validateRequest(travelTipsSchema),
  getTravelTips
);

export default router;
