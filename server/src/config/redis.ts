/**
 * Redis Client Configuration
 * Used for rate limiting, session storage, and caching
 * 
 * @module config/redis
 */

import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let isConnected = false;

/**
 * Get or create Redis client
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient && isConnected) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis: Max reconnection attempts reached');
          return new Error('Max reconnection attempts reached');
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
    isConnected = false;
  });

  redisClient.on('connect', () => {
    console.log('Redis: Connected');
    isConnected = true;
  });

  redisClient.on('reconnecting', () => {
    console.log('Redis: Reconnecting...');
  });

  redisClient.on('end', () => {
    console.log('Redis: Connection closed');
    isConnected = false;
  });

  await redisClient.connect();
  return redisClient;
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    if (!redisClient || !isConnected) {
      await getRedisClient();
    }
    await redisClient?.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting helpers
 */
export const rateLimitStore = {
  /**
   * Increment and get current count for a key
   */
  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const client = await getRedisClient();
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;
    
    const multi = client.multi();
    multi.incr(windowKey);
    multi.pExpire(windowKey, windowMs);
    
    const results = await multi.exec();
    const count = (results?.[0] as number) || 1;
    
    return {
      count,
      resetTime: Math.ceil(now / windowMs) * windowMs
    };
  },

  /**
   * Get current count for a key
   */
  async getCount(key: string, windowMs: number): Promise<number> {
    const client = await getRedisClient();
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;
    
    const count = await client.get(windowKey);
    return count ? parseInt(count, 10) : 0;
  },

  /**
   * Reset rate limit for a key
   */
  async reset(key: string, windowMs: number): Promise<void> {
    const client = await getRedisClient();
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;
    
    await client.del(windowKey);
  }
};

/**
 * Token blacklist for logout
 */
export const tokenBlacklist = {
  /**
   * Add token to blacklist
   */
  async add(tokenId: string, expiresInMs: number): Promise<void> {
    const client = await getRedisClient();
    await client.setEx(`blacklist:${tokenId}`, Math.ceil(expiresInMs / 1000), 'revoked');
  },

  /**
   * Check if token is blacklisted
   */
  async isBlacklisted(tokenId: string): Promise<boolean> {
    const client = await getRedisClient();
    const result = await client.get(`blacklist:${tokenId}`);
    return result === 'revoked';
  }
};

/**
 * Session storage
 */
export const sessionStore = {
  /**
   * Store session data
   */
  async set(sessionId: string, data: Record<string, any>, ttlSeconds: number): Promise<void> {
    const client = await getRedisClient();
    await client.setEx(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
  },

  /**
   * Get session data
   */
  async get(sessionId: string): Promise<Record<string, any> | null> {
    const client = await getRedisClient();
    const data = await client.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Delete session
   */
  async delete(sessionId: string): Promise<void> {
    const client = await getRedisClient();
    await client.del(`session:${sessionId}`);
  },

  /**
   * Extend session TTL
   */
  async extend(sessionId: string, ttlSeconds: number): Promise<void> {
    const client = await getRedisClient();
    await client.expire(`session:${sessionId}`, ttlSeconds);
  }
};

/**
 * Graceful shutdown
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isConnected = false;
  }
}

export default {
  getRedisClient,
  isRedisAvailable,
  rateLimitStore,
  tokenBlacklist,
  sessionStore,
  closeRedis
};
