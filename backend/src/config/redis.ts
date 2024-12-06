import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => logger.error('Redis Client Error', err));
redis.on('connect', () => logger.info('Redis Client Connected'));

// Connect to Redis if URL is provided
if (process.env.REDIS_URL) {
  redis.connect().catch((err) => {
    logger.error('Failed to connect to Redis:', err);
  });
}
