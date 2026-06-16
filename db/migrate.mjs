import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env manually (no external dotenv needed) ──────────────────────────
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const raw = readFileSync(envPath, 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // Remove surrounding quotes if they exist
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.error('⚠️  Could not read .env file. Make sure it exists.');
    process.exit(1);
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in your .env file.');
  process.exit(1);
}

// ── Run migration ────────────────────────────────────────────────────────────
async function migrate() {
  let neon;
  try {
    const mod = await import('@neondatabase/serverless');
    neon = mod.neon;
  } catch {
    console.error('❌  Package @neondatabase/serverless is not installed.');
    console.error('    Run: pnpm install @neondatabase/serverless');
    process.exit(1);
  }

  const sql = neon(DATABASE_URL);
  const schemaPath = join(__dirname, 'schema.sql');
  const schemaSql = readFileSync(schemaPath, 'utf-8');

  console.log('🚀  Connecting to Neon database...');

  let statements = [];
  let count = 0;
  try {
    // Split into individual statements and execute each one
    statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      console.log(`Executing [${count}]: ${stmt.slice(0, 100)}...`);
      await sql.query(stmt);
      count++;
    }

    console.log(`✅  Migration complete! Ran ${count} SQL statements.`);
    console.log('📋  Tables created/verified:');
    console.log('    • users');
    console.log('    • sessions');
    console.log('    • habits');
    console.log('    • journal_entries');
    console.log('    • notification_settings');
  } catch (err) {
    console.error('❌  Migration failed at statement:', statements[count]);
    console.error('❌  Error message:', err.message);
    process.exit(1);
  }
}

migrate();
