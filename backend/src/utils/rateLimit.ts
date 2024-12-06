import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';
import { logger } from './logger';

// Create a limiter for AI endpoints
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many AI requests, please try again later',
  store: process.env.REDIS_URL
    ? new RedisStore({
        client: redis,
        prefix: 'ai-rate-limit:',
      })
    : undefined,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: Math.ceil(res.getHeader('X-RateLimit-Reset') as number / 1000),
    });
  },
});
