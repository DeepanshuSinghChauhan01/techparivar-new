import { Pool } from "pg";

/**
 * PostgreSQL connection pool.
 *
 * SETUP:
 * 1. Provision a Postgres instance (Vercel Postgres / Neon / Supabase / RDS).
 * 2. Add to `.env.local`:
 *      DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
 * 3. Run the schema below once against your database (psql, or a migration
 *    tool like Drizzle/Prisma if you prefer — this file uses plain `pg` to
 *    keep the dependency footprint minimal).
 *
 * Until DATABASE_URL is set, lead-capture forms in the UI still render and
 * validate correctly client-side; only the final persistence step (in the
 * API routes under src/app/api/) will no-op or log to console instead of
 * writing to a database. See src/app/api/leads/route.ts.
 */

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/**
 * Run once to provision the leads table:
 *
 * CREATE TABLE IF NOT EXISTS leads (
 *   id SERIAL PRIMARY KEY,
 *   source VARCHAR(64) NOT NULL,             -- 'contact_form' | 'shopify_audit' | 'exit_intent'
 *   name VARCHAR(255),
 *   email VARCHAR(255) NOT NULL,
 *   phone VARCHAR(64),
 *   company VARCHAR(255),
 *   project_type VARCHAR(128),
 *   budget VARCHAR(64),
 *   timeline VARCHAR(64),
 *   store_url VARCHAR(255),
 *   message TEXT,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
 * );
 *
 * CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
 */
export interface LeadRecord {
  source: "contact_form" | "shopify_audit" | "exit_intent";
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  storeUrl?: string;
  message?: string;
}

export async function insertLead(lead: LeadRecord): Promise<{ persisted: boolean }> {
  const db = getPool();
  if (!db) {
    // No DATABASE_URL configured — log so the lead isn't silently dropped
    // during local development before Postgres is wired up.
    console.warn("[leads] DATABASE_URL not set — lead not persisted:", lead);
    return { persisted: false };
  }

  await db.query(
    `INSERT INTO leads (source, name, email, phone, company, project_type, budget, timeline, store_url, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      lead.source,
      lead.name ?? null,
      lead.email,
      lead.phone ?? null,
      lead.company ?? null,
      lead.projectType ?? null,
      lead.budget ?? null,
      lead.timeline ?? null,
      lead.storeUrl ?? null,
      lead.message ?? null,
    ]
  );

  return { persisted: true };
}
