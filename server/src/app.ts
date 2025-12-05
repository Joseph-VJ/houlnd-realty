/**
 * Express Application Entry Point
 * Houlnd Realty API Server
 * 
 * @module app
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';

import authRoutes from './routes/auth.routes';
import { initializeRateLimiters, getApiLimiter, ipBlockMiddleware } from './middleware/rateLimiter';
import { supabaseHealthCheck } from './config/supabase';
import { isRedisAvailable } from './config/redis';

// Create Express app
const app: Application = express();

// Trust proxy (for rate limiting behind load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Fingerprint'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// IP blocking middleware
app.use(ipBlockMiddleware);

// Global rate limiting
app.use('/api', getApiLimiter());

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await supabaseHealthCheck();
  const redisHealthy = await isRedisAvailable();

  const status = dbHealthy ? 'healthy' : 'degraded';
  const statusCode = dbHealthy ? 200 : 503;

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      supabase: dbHealthy ? 'up' : 'down',
      redis: redisHealthy ? 'up' : 'down'
    },
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Ready check (for k8s)
app.get('/ready', async (req: Request, res: Response) => {
  const dbHealthy = await supabaseHealthCheck();
  if (dbHealthy) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false });
  }
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    errorCode: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  res.status(500).json({
    success: false,
    error: message,
    errorCode: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Initialize rate limiters
initializeRateLimiters().catch(console.error);

export default app;
