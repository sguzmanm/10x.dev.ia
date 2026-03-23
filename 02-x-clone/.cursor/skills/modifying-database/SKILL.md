---
name: modifying-database
description: Creates and applies Supabase database migrations for this project. Use when adding, changing, or removing database tables, columns, constraints, indexes, policies, or seed data through SQL migrations.
---

# Modifying Database

## Objective

Use versioned Supabase migrations for every DB change.

## Required workflow

1. Create a new migration file:

```bash
supabase migration new migration_name
```

2. Edit the generated SQL file and add your DB changes.
   - Put schema changes in the migration file (tables, columns, constraints, indexes, RLS policies, etc.).
   - Keep migrations deterministic and idempotent when possible.

3. Apply pending migrations:

```bash
supabase migration up
```

## [Optional] Recovery workflow

If migrations become corrupted in the local database, reset the local DB and re-apply all migrations:

```bash
supabase db reset
```

## Guardrails

- Never change the DB manually without a migration file.
- Prefer additive changes first (add new columns/tables, then backfill, then remove old structures in a later migration).
- Name migrations clearly by intent (example: `add_user_profile_table`).
- Validate the app after `supabase migration up` or `supabase db reset`.
