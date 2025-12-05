/**
 * Server Entry Point
 * Starts the Express server with graceful shutdown
 * 
 * @module server
 */

import app from './app';
import { closePool } from './config/database';
import { closeRedis } from './config/redis';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏠 Houlnd Realty API Server                             ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║   Server:      http://${HOST}:${PORT}                          ║
║   Health:      http://${HOST}:${PORT}/health                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed.');

    try {
      // Close database connections
      await closePool();
      console.log('Database connections closed.');

      // Close Redis connections
      await closeRedis();
      console.log('Redis connections closed.');

      console.log('Graceful shutdown complete.');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default server;
