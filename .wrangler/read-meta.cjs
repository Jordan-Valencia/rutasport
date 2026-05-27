const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const d1Dir = path.join(__dirname, 'state/v3/d1/miniflare-D1DatabaseObject');
const metaPath = path.join(d1Dir, 'metadata.sqlite');

if (!fs.existsSync(metaPath)) {
  console.log('metadata.sqlite not found at:', metaPath);
  process.exit(0);
}

const meta = new Database(metaPath);
try {
  const tables = meta.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));

  for (const t of tables) {
    const rows = meta.prepare('SELECT * FROM ' + t.name).all();
    console.log(t.name + ':', JSON.stringify(rows, null, 2));
  }
} finally {
  meta.close();
}
