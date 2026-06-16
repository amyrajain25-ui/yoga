/**
 * src/lib/db.ts
 * Neon database client — supports loading DATABASE_URL from import.meta.env
 */

import { neon } from '@neondatabase/serverless';

let sqlClient: any = null;
let initPromise: Promise<void> | null = null;

async function getSqlClient() {
  if (sqlClient) return sqlClient;

  if (!initPromise) {
    initPromise = (async () => {
      const databaseUrl = import.meta.env.VITE_DATABASE_URL;

      if (!databaseUrl) {
        throw new Error(
          'DATABASE_URL is not set. Please define VITE_DATABASE_URL in your .env file.'
        );
      }

      sqlClient = neon(databaseUrl);
    })();
  }

  await initPromise;
  return sqlClient;
}

// Simple in-memory SELECT cache to avoid waterfall UI flicker
const queryCache = new Map<string, any>();

export const clearDbCache = () => {
  console.info('[db] Cache manually cleared');
  queryCache.clear();
};

/**
 * Tagged-template SQL client wrapper that initializes lazily and caches SELECT queries.
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const queryStr = strings.reduce((acc, str, idx) => acc + str + (values[idx] !== undefined ? `$${idx + 1}` : ''), '');
  
  // Clean SQL string to identify if it is a SELECT query (ignoring leading spaces, comments)
  const cleanQuery = queryStr
    .replace(/--.*$/gm, '') // Remove single line SQL comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block SQL comments
    .trim();

  // Normalize query string (replace all whitespaces with a single space) for robust template matching
  const normalizedQuery = cleanQuery.replace(/\s+/g, ' ');
  const isSelect = normalizedQuery.toUpperCase().startsWith('SELECT');

  if (isSelect) {
    const cacheKey = JSON.stringify({ query: normalizedQuery, values });
    if (queryCache.has(cacheKey)) {
      console.info('[db] Cache HIT:', normalizedQuery.slice(0, 60) + '...');
      return queryCache.get(cacheKey);
    }
    
    console.info('[db] Cache MISS:', normalizedQuery.slice(0, 60) + '...');
    const client = await getSqlClient();
    const result = await client(strings, ...values);
    queryCache.set(cacheKey, result);
    return result;
  } else {
    // Mutation query (INSERT, UPDATE, DELETE) -> Execute & Invalidate related cache keys
    console.info('[db] Cache INVALIDATING (write statement):', normalizedQuery.slice(0, 60) + '...');
    const client = await getSqlClient();
    const result = await client(strings, ...values);
    
    // Selectively invalidate cache keys based on target tables to avoid clearing unaffected cached pages
    const upperQuery = normalizedQuery.toUpperCase();
    let targetTable = '';
    if (upperQuery.includes('HABITS')) targetTable = 'habits';
    else if (upperQuery.includes('SESSIONS')) targetTable = 'sessions';
    else if (upperQuery.includes('JOURNAL_ENTRIES')) targetTable = 'journal_entries';
    else if (upperQuery.includes('NOTIFICATION_SETTINGS')) targetTable = 'notification_settings';
    else if (upperQuery.includes('USERS')) targetTable = 'users';

    if (targetTable) {
      console.info(`[db] Selectively clearing cache keys for table: ${targetTable}`);
      for (const key of queryCache.keys()) {
        if (key.toLowerCase().includes(targetTable)) {
          queryCache.delete(key);
        }
      }
    } else {
      console.info('[db] Unknown write target, clearing entire query cache');
      queryCache.clear();
    }

    return result;
  }
};

export default sql;
