import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Rate limit configuration
const WINDOW_SIZE_IN_SECONDS = 3600; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 100;

export function getRateLimitConfig() {
  return {
    windowSize: WINDOW_SIZE_IN_SECONDS,
    maxRequests: MAX_REQUESTS_PER_WINDOW,
  };
}

export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const windowStart = now - (WINDOW_SIZE_IN_SECONDS * 1000);

  // Clean up expired entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });

  // Initialize or get current rate limit info
  if (!store[identifier] || store[identifier].resetTime < now) {
    store[identifier] = {
      count: 0,
      resetTime: now + (WINDOW_SIZE_IN_SECONDS * 1000),
    };
  }

  // Increment counter
  store[identifier].count++;

  // Check if rate limit is exceeded
  if (store[identifier].count > MAX_REQUESTS_PER_WINDOW) {
    const resetInSeconds = Math.ceil((store[identifier].resetTime - now) / 1000);
    return {
      isLimited: true,
      resetInSeconds,
      remaining: 0,
    };
  }

  return {
    isLimited: false,
    resetInSeconds: Math.ceil((store[identifier].resetTime - now) / 1000),
    remaining: MAX_REQUESTS_PER_WINDOW - store[identifier].count,
  };
}

export function withRateLimit(handler: Function) {
  return async function rateLimit(request: Request) {
    // Use IP address or session ID as identifier
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    
    const rateLimitInfo = checkRateLimit(identifier);
    
    if (rateLimitInfo.isLimited) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Please try again in ${rateLimitInfo.resetInSeconds} seconds`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitInfo.resetInSeconds.toString(),
          },
        }
      );
    }
    
    // Add rate limit headers to the response
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitInfo.resetInSeconds.toString());
    
    return response;
  };
}
