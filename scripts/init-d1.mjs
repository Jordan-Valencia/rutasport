import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Determine the database hash (derived from database UUID from wrangler.toml)
// Pages dev creates: e1c61e164c7c263af0821145dc510d0ff5a19d08ce7b4e63fe8010f14a6c6bf8
// This hash happens to match sha256 of "DB" (binding name) + something...
// We create the DB at the known path pages dev uses
const d1Dir = path.join(root, '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
const dbPath = path.join(d1Dir, 'e1c61e164c7c263af0821145dc510d0ff5a19d08ce7b4e63fe8010f14a6c6bf8.sqlite');

fs.mkdirSync(d1Dir, { recursive: true });

const initSql = fs.readFileSync(path.join(root, 'DB/full-init.sql'), 'utf-8');

console.log(`Creating database at: ${dbPath}`);

const db = new Database(dbPath);

const statements = initSql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

for (const stmt of statements) {
  try {
    db.exec(stmt + ';');
  } catch (err) {
    console.error(`Error executing: ${stmt.substring(0, 60)}...`);
    console.error(err.message);
  }
}

db.close();
console.log('Database initialized successfully!');
