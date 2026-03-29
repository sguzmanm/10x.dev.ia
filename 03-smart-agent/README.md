# Smart Agent — Voting Question Generator

A LangChain-based CLI agent that takes an agenda task list and generates structured voting questions for collaborative decision-making.

## Requirements

- Node.js 20+
- An [OpenRouter](https://openrouter.ai/) API key (or any OpenAI-compatible endpoint)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables by creating a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_TEMPERATURE=0
OPENROUTER_HTTP_REFERER=https://your-app.com
OPENROUTER_APP_TITLE=My Agent
```

## Usage

Pass a numbered agenda list via stdin:

```bash
echo "1. Sprint planning\n2. Retrospective\n3. Demo" | npm start
```

Or pipe from a file:

```bash
cat agenda.txt | npm start
```

### Input format

```
1. Sprint planning
2. Retrospective
3. Demo day preparation
```

### Output format

The agent prints a JSON object to stdout:

```json
{
  "questions": [
    {
      "questionId": "q_001",
      "question": "Should the sprint planning session include story point estimation?",
      "options": [
        { "id": "opt_0", "label": "Yes" },
        { "id": "opt_1", "label": "No" }
      ],
      "reasoning": "Determines if the team wants to invest time in estimation during planning"
    }
  ],
  "totalQuestions": 1,
  "generatedAt": "2026-03-29T14:00:00.000Z"
}
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run the agent (reads from stdin) |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix code style issues |
| `npm run build` | Compile TypeScript to `dist/` |

## Architecture

This project follows Clean Architecture principles:

```
src/
  domain/           # Entities and shared types (no external dependencies)
  use-cases/        # Application logic (generateQuestions)
  infrastructure/   # LangChain agent, tools, external integrations
  interface/cli/    # CLI input parsing and output display
  index.ts          # Entrypoint
```

## Testing

- **Unit tests**: Pure logic with no network calls
- **Integration tests**: Use case tests with mocked LangChain agent

```bash
npm run test:coverage
```

Coverage target: ≥90% across all files.
