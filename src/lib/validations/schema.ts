import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  destinations: z.array(
    z.object({
      name: z.string().min(1, 'Destination name is required'),
      description: z.string().optional(),
      date: z.string().or(z.date()).optional()
    })
  )
});

export const tripQuerySchema = z.object({
  userId: z.string().optional(),
  title: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  sortBy: z.string().optional(),
});

// AI Validation Schemas
export const recommendationSchema = z.object({
  body: z.object({
    budget: z.string().min(1),
    duration: z.string().min(1),
    interests: z.array(z.string()).min(1),
    travelStyle: z.string().min(1),
    season: z.string().min(1),
  }),
});

export const itinerarySchema = z.object({
  body: z.object({
    destination: z.string().min(1),
    duration: z.string().min(1),
    preferences: z.object({
      travelStyle: z.string().min(1),
      interests: z.array(z.string()).min(1),
      budget: z.string().min(1),
    }),
  }),
});

export const travelTipsSchema = z.object({
  body: z.object({
    destination: z.string().min(1),
    preferences: z.object({
      travelStyle: z.string().min(1),
      budget: z.string().min(1),
      season: z.string().min(1),
    }),
  }),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type TripQueryInput = z.infer<typeof tripQuerySchema>;
