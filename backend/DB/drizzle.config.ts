import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  migrations: {
    table: 'migrations',
    schema: 'public',
    prefix: 'timestamp',
  },
  dbCredentials: {
    url: './sqlite.db',
  },
});