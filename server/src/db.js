import pg from 'pg';
import { getMigrations } from 'better-auth/db/migration';
import { cfg } from './config.js';

export const pool = new pg.Pool({ connectionString: cfg.databaseUrl, max: 10, ssl: process.env.DATABASE_SSL === '1' ? { rejectUnauthorized: false } : undefined });
export const q = (text, params) => pool.query(text, params);

const APP_SCHEMA = `
create table if not exists app_profile(
  user_id text primary key references "user"(id) on delete cascade,
  role text not null default 'eleve' check (role in ('eleve','enseignant','etablissement')),
  classe text check (classe in ('6e','5e','4e','3e')),
  display_name text,
  created_at timestamptz not null default now()
);
create table if not exists payment(
  tx_id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  plan text not null, period text not null,
  amount integer not null, currency text not null default 'XOF',
  status text not null default 'pending' check (status in ('pending','accepted','refused')),
  provider text not null, raw jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists pass(
  id serial primary key,
  user_id text not null references "user"(id) on delete cascade,
  plan text not null,
  starts_at timestamptz not null, ends_at timestamptz not null,
  tx_id text unique references payment(tx_id)
);
create index if not exists pass_user on pass(user_id, ends_at);
create table if not exists classe(
  id serial primary key,
  owner_id text not null references "user"(id) on delete cascade,
  name text not null, level text not null check (level in ('6e','5e','4e','3e')),
  code text not null unique, created_at timestamptz not null default now()
);
create table if not exists class_member(
  class_id integer not null references classe(id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key(class_id, user_id)
);
create table if not exists progress(
  user_id text not null references "user"(id) on delete cascade,
  lesson_id text not null,
  steps jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key(user_id, lesson_id)
);
`;

// Crée les tables de Better Auth puis celles de l'application (idempotent).
export async function migrate(authOptions) {
  const { runMigrations } = await getMigrations(authOptions);
  await runMigrations();
  await q(APP_SCHEMA);
}
