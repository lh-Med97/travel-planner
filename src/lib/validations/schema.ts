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
  sortBy: z.string().optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type TripQueryInput = z.infer<typeof tripQuerySchema>;
