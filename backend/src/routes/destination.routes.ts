import { Router } from 'express';
import {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destination.controller';
import { authenticate } from '../middleware/auth';
import { validateDestination } from '../middleware/validation';

const router = Router();

router.get('/', getAllDestinations);
router.get('/:id', getDestination);
router.post('/', authenticate, validateDestination, createDestination);
router.put('/:id', authenticate, validateDestination, updateDestination);
router.delete('/:id', authenticate, deleteDestination);

export default router;
