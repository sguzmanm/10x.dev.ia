---
name: defining-tdd
description: Define and guides the TDD process in the 03-smart-agent project. Establishes how to define use cases, write tests first (happy path + failure scenarios), run them in red, implement, then verify green. Use when implementing a new feature, agent tool, workflow step, or when asked to write tests.
---

# Defining TDD

## Core principle

**Tests are written BEFORE the implementation.** Never the other way around.

The cycle is: **Red → Green → Refactor**
1. **Red**: Write a failing test (the feature doesn't exist yet).
2. **Green**: Write the minimum code to make it pass.
3. **Refactor**: Clean up without breaking tests.

---

## Step 1: Define use cases

Before writing any test or code, document acceptance criteria in this format:

```
Use case: [feature name]

✅ MUST:
- Given [context], when [action], then [expected result]
- ...

❌ MUST NOT:
- [invalid behavior or expected error]
- ...
```

**Example:**

```
Use case: Web search tool

✅ MUST:
- Given a valid query string, when the tool is called, then it returns a non-empty list of results
- Given results, when the agent processes them, then it extracts relevant snippets

❌ MUST NOT:
- Accept an empty query
- Proceed if the API key is missing
- Return more than the configured max results
```

---

## Step 2: Set up Jest

This project uses Jest. Install and configure it if not present:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Add to `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
},
"jest": {
  "testEnvironment": "node"
}
```

---

## Step 3: File structure

```
src/
  tools/
    web-search.ts
    __tests__/
      web-search.unit.test.ts      # Pure logic, no network
      web-search.integration.test.ts  # With mocked LLM/API
  agent/
    __tests__/
      agent.unit.test.ts
```

Test files live next to the code they test, inside `__tests__/`.

---

## Step 4: Test templates

### Unit test (pure logic / tool function)

```typescript
import { myTool } from '../my-tool'

describe('MyTool', () => {
  it('should [expected behavior] given [context]', () => {
    // Arrange
    const input = '...'

    // Act
    const result = myTool(input)

    // Assert
    expect(result).toEqual(...)
  })

  it('should throw when [invalid condition]', () => {
    expect(() => myTool('')).toThrow('...')
  })
})
```

### Integration test (mocked LLM / external API)

```typescript
import { myAgentStep } from '../agent'

jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({ content: 'mocked response' }),
  })),
}))

describe('AgentStep integration', () => {
  it('should return a response given a valid prompt', async () => {
    const result = await myAgentStep('What is 2+2?')
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })
})
```

---

## Step 5: Mandatory order of work

```
[ ] 1. Document use cases (✅ MUST / ❌ MUST NOT)
[ ] 2. Write failing tests (Red) covering happy path + failure scenarios
[ ] 3. Run `npm test` and confirm tests fail
[ ] 4. Implement the minimum code to make tests pass (Green)
[ ] 5. Run `npm test` again and confirm all tests pass
[ ] 6. Refactor if needed — tests must stay green
```

> Do not write implementation code before step 3 is confirmed failing.

---

## Naming conventions

| Type | Suffix | Example |
|------|--------|---------|
| Pure logic / tool | `.unit.test.ts` | `search-tool.unit.test.ts` |
| With mocked LLM/API | `.integration.test.ts` | `agent-chain.integration.test.ts` |

---

## What NOT to test

- LangChain internals (SDK behavior).
- The LLM's actual response quality.
- TypeScript types (verified by the compiler).
