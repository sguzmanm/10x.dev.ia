# Testing Guide

## Unit tests first (TDD)

Before implementing a feature:

1. Define use cases with `DEBE` and `NO DEBE`.
2. Create failing unit tests (`Red`).
3. Implement the minimum code to pass (`Green`).
4. Refactor without breaking tests.

## Unit test conventions

- Keep tests near the code in `__tests__/`.
- Use suffix `.unit.test.ts` for pure business logic.
- Use suffix `.test.tsx` for React component behavior.

Example structure:

```
app/src/features/tweet/
  tweet-validator.ts
  __tests__/
    tweet-validator.unit.test.ts
```

## Commands

- `npm install`
- `npm run test`
- `npm run test:unit`
