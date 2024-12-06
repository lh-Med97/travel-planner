import { Router } from 'express';
import authRoutes from './auth.routes';
import destinationRoutes from './destination.routes';
import tripRoutes from './trip.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationRoutes);
router.use('/trips', tripRoutes);
router.use('/ai', aiRoutes);

export default router;
