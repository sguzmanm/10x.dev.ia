---
name: executing-browser
description: Automates the browser with the agent-browser CLI (open, snapshot with refs, clicks/fills, waits, screenshots). Use when the user asks to drive a website, reproduce UI flows, E2E smoke checks, or extract page structure for debugging; full command reference lives in upstream docs.
---

# Executing Browser

Upstream project: [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) (Rust CLI + daemon, Chrome via Chrome for Testing).


## Core workflow (best for agents)

Refs from `snapshot` are stable handles; prefer them over fragile CSS when possible.

1. **Navigate:** `agent-browser open <url>` (aliases: `goto`, `navigate`).
2. **Wait if needed:** `agent-browser wait --load networkidle` (or `wait` for selector/text/url).
3. **Inspect structure:** `agent-browser snapshot -i` (interactive only: buttons, links, inputs).
4. **Act using refs:** `agent-browser click @e2`, `agent-browser fill @e3 "text"`.
5. **After navigation or DOM changes:** run `snapshot` again (refs change).

**Traditional selectors** still work: CSS, `text=`, `xpath=`, or `find role button click --name "Submit"`.

## High-signal commands

| Goal | Command |
|------|---------|
| Page tree for LLM | `snapshot` / `snapshot -i -c -d 5` / `snapshot -s "#main"` |
| Machine output | `snapshot --json` (and other commands with `--json`) |
| Screenshot | `screenshot [path]`, `screenshot --full`, `screenshot --annotate` |
| PDF | `pdf <path>` |
| Read state | `get text\|html\|value\|url\|title @eN` |
| Semantic find | `find role button click --name "Submit"` |
| JS | `eval "<js>"` |
| CDP attach | `connect <port>` or `--cdp 9222` / `--auto-connect` |
| Close | `close` |

## Chaining and speed

The daemon keeps the browser alive between invocations. Prefer one shell line with `&&` when intermediate output is not needed:

```bash
agent-browser open example.com && agent-browser wait --load networkidle && agent-browser snapshot -i
```

For many steps without process startup overhead, use **`batch`** with a JSON array of command arrays (see upstream README).

## Configuration

Priority (low → high): `~/.agent-browser/config.json` → `./agent-browser.json` → `AGENT_BROWSER_*` → CLI flags.

Useful flags/env: `--headed` / `AGENT_BROWSER_HEADED`, `--proxy`, `--ignore-https-errors`, `--profile`, `--session-name`, `--state`, `--json`, `--max-output`, `--allowed-domains`, `--action-policy`, `--confirm-actions`.

## Security (opt-in, recommended for agents)

- **`--allowed-domains`** — restrict navigation and subresource loads.
- **`--action-policy`** — static policy for destructive actions.
- **`--confirm-actions`** — require approval for categories (e.g. `eval`, `download`).
- **`--content-boundaries`** — delimit tool output from page content for LLM safety.
- **`--max-output`** — cap huge snapshots.

Treat auth **state files** as secrets; add to `.gitignore`. See upstream **Authentication** and **Security** sections.

## Auth patterns (summary)

- **`--profile <dir>`** — persistent full profile (cookies, IndexedDB, cache).
- **`--session-name <name>`** — auto save/restore cookies + `localStorage` under `~/.agent-browser/sessions/`.
- **`--state <file.json>`** — load saved storage state.
- **`--auto-connect`** + **`state save`** — import from an existing Chrome with remote debugging (see upstream; exposing debug port is sensitive on localhost).

## Timeouts

Default action timeout is **25s** (`AGENT_BROWSER_DEFAULT_TIMEOUT`). Very long values can interact badly with CLI IPC limits; prefer explicit `wait` and smaller `snapshot` scope (`-c`, `-d`, `-s`).

## When to open full docs

Run `agent-browser --help` for the complete command list, or read the [README](https://github.com/vercel-labs/agent-browser/blob/main/README.md) for batch format, network/HAR, tabs, iOS provider, and cloud providers (`-p browserless`, `browserbase`, etc.).
