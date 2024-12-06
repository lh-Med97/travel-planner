import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/error';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const CACHE_TTL = 60 * 60; // 1 hour in seconds

async function getCachedOrGenerateResponse(cacheKey: string, generateFn: () => Promise<string>): Promise<string> {
  try {
    // Try to get from cache first
    if (process.env.REDIS_URL) {
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        logger.info('Cache hit for key:', cacheKey);
        return cachedResult;
      }
    }

    // Generate new response
    const result = await generateFn();

    // Cache the result
    if (process.env.REDIS_URL) {
      await redis.setEx(cacheKey, CACHE_TTL, result);
      logger.info('Cached result for key:', cacheKey);
    }

    return result;
  } catch (error) {
    logger.error('Error in getCachedOrGenerateResponse:', error);
    throw error;
  }
}

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { budget, duration, interests, travelStyle, season } = req.body;
    
    const cacheKey = `recommendations:${JSON.stringify({ budget, duration, interests, travelStyle, season })}`;
    
    const result = await getCachedOrGenerateResponse(cacheKey, async () => {
      const prompt = `As a travel expert, recommend 5 destinations based on these preferences:
        Budget: ${budget}
        Duration: ${duration}
        Interests: ${interests?.join(', ')}
        Travel Style: ${travelStyle}
        Season: ${season}
        
        For each destination, provide:
        1. Name
        2. Brief description
        3. Estimated budget range
        4. Best time to visit
        5. Top 3 attractions`;

      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    res.json({ recommendations: result });
  } catch (error) {
    logger.error('Error getting AI recommendations:', error);
    if ((error as any).message?.includes('rate limit exceeded')) {
      throw new AppError(429, 'AI service rate limit exceeded. Please try again later.');
    }
    throw new AppError(500, 'Failed to get recommendations');
  }
};

export const generateItinerary = async (req: Request, res: Response) => {
  try {
    const { destination, duration, preferences } = req.body;
    
    const cacheKey = `itinerary:${JSON.stringify({ destination, duration, preferences })}`;
    
    const result = await getCachedOrGenerateResponse(cacheKey, async () => {
      const prompt = `Create a detailed ${duration} itinerary for ${destination} considering:
        Travel Style: ${preferences.travelStyle}
        Interests: ${preferences.interests?.join(', ')}
        Budget Level: ${preferences.budget}
        
        Include:
        1. Day-by-day schedule
        2. Recommended activities
        3. Estimated timing
        4. Travel tips
        5. Estimated costs`;

      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    res.json({ itinerary: result });
  } catch (error) {
    logger.error('Error generating itinerary:', error);
    if ((error as any).message?.includes('rate limit exceeded')) {
      throw new AppError(429, 'AI service rate limit exceeded. Please try again later.');
    }
    throw new AppError(500, 'Failed to generate itinerary');
  }
};

export const getTravelTips = async (req: Request, res: Response) => {
  try {
    const { destination, preferences } = req.body;
    
    const cacheKey = `travel-tips:${JSON.stringify({ destination, preferences })}`;
    
    const result = await getCachedOrGenerateResponse(cacheKey, async () => {
      const prompt = `Provide personalized travel tips for ${destination} considering:
        Travel Style: ${preferences.travelStyle}
        Budget: ${preferences.budget}
        Season: ${preferences.season}
        
        Include:
        1. Local customs and etiquette
        2. Safety tips
        3. Money-saving advice
        4. Transportation recommendations
        5. Must-try local experiences`;

      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    res.json({ tips: result });
  } catch (error) {
    logger.error('Error getting travel tips:', error);
    if ((error as any).message?.includes('rate limit exceeded')) {
      throw new AppError(429, 'AI service rate limit exceeded. Please try again later.');
    }
    throw new AppError(500, 'Failed to get travel tips');
  }
};
