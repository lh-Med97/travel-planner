import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const destinationSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  category: z.string().optional(),
  priceRange: z.string().optional(),
  image: z.string().url().optional()
});

const tripSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  budget: z.number().optional(),
  destinationIds: z.array(z.string())
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  destinationId: z.string()
});

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.path.includes('login')) {
      loginSchema.parse(req.body);
    } else {
      userSchema.parse(req.body);
    }
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid input' });
    }
  }
};

export const validateDestination = (req: Request, res: Response, next: NextFunction) => {
  try {
    destinationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid destination data' });
    }
  }
};

export const validateTrip = (req: Request, res: Response, next: NextFunction) => {
  try {
    tripSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid trip data' });
    }
  }
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  try {
    reviewSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid review data' });
    }
  }
};
