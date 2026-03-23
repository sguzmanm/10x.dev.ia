---
name: inspecting-database
description: Inspects the Supabase database via MCP in read-only mode for debugging, data exploration, and schema understanding. Use when it is required to run SQL queries, inspect tables, validate data, or analyze schema without modifying data or structure.
---

# Inspecting Database

## Objective

Use Supabase MCP only for read-only inspection.

This skill is for:
- debugging
- extracting information
- understanding schema and relationships

This skill is never for writes, schema changes, or data mutations.

## Required policy

- MCP usage must be read-only.
- Never run SQL that modifies data or schema through MCP.
- Any DB change must go through migrations (see `modifying-database` skill).

## Allowed SQL patterns

Use only read-only statements such as:
- `SELECT ...`
- `WITH ... SELECT ...`
- `EXPLAIN` / `EXPLAIN ANALYZE` on read-only queries
- Queries against metadata tables like `information_schema` and `pg_catalog`

## Forbidden SQL patterns

Never run these through MCP:
- `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`
- `CREATE`, `ALTER`, `DROP`
- `GRANT`, `REVOKE`
- `VACUUM`, `REINDEX`, `ANALYZE` (standalone)
- Any statement that changes data, schema, permissions, or server state

## Workflow

1. Understand the inspection goal (debug data, verify relationships, inspect schema).
2. Build a read-only SQL query.
3. Execute it with the Supabase MCP SQL/query tool.
4. Return findings clearly (rows, counts, anomalies, missing relations).
5. If a write is needed, stop and switch to migration workflow:
   - `supabase migration new migration_name`
   - edit migration SQL
   - `supabase migration up`

## Safety checks before executing SQL

- Confirm the SQL starts with a read-only pattern.
- Reject multi-statement SQL that includes any mutating command.
- Prefer `LIMIT` for exploratory queries on large tables.
- If uncertain whether a query mutates state, do not execute it.

## Quick examples

Read data:

```sql
SELECT id, email, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;
```

Inspect schema:

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

Count records:

```sql
SELECT COUNT(*) AS total_profiles
FROM profiles;
```
