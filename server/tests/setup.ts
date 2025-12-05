/**
 * Test Setup
 * Runs before all tests
 */

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise during tests
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

// Increase timeout for integration tests
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
  // Allow time for connections to close
  await new Promise(resolve => setTimeout(resolve, 500));
});
