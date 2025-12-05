/**
 * Database Client Configuration
 * PostgreSQL connection using pg library
 * 
 * @module config/database
 */

import { Pool, PoolConfig, QueryResult, QueryResultRow, PoolClient } from 'pg';

// Parse database URL or use individual settings
const getDatabaseConfig = (): PoolConfig => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10)
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'houlnd_realty',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10)
  };
};

// Create connection pool
const pool = new Pool(getDatabaseConfig());

// Log pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

/**
 * Query helper with typed results
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed', { text: text.substring(0, 100), duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Query error', { text: text.substring(0, 100), duration, error });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Transaction helper
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT 1');
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

/**
 * Graceful shutdown
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

export { pool };
export default { query, getClient, transaction, healthCheck, closePool, pool };
