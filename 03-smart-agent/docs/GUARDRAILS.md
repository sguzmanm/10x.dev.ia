# Guardrails — Smart Agent

This document records the guardrail analysis performed on the `03-smart-agent` project and tracks which guardrails have been implemented, which are planned, and which remain open.

---

## Observed Failures (from `SAMPLES.md`)

The following issues were captured before guardrails were added:

| Sample | Tasks | Questions | Max Allowed | Issue |
|---|---|---|---|---|
| Colombia vs France | 2 | 6 | 6 | Off-topic input — sports match, not an org agenda |
| Sprint Planning | 3 | 9 | 9 | Language mismatch — Spanish questions with English "Yes"/"No" options |
| Jedi Council | 4 | 12 | 12 | Language mismatch — Spanish questions with English "Yes"/"No" options |

---

## 1. Input Guardrails

### Implemented

| Guardrail | Location |
|---|---|
| Reject empty string | `parseInput.ts` |
| Reject input with no valid numbered lines | `parseInput.ts` |

### Planned / Not Yet Implemented

| Guardrail | Risk | Suggested Location |
|---|---|---|
| **Max task count** | Unbounded inputs cause expensive LLM calls | `parseInput.ts` — throw if `tasks.length > N` (e.g. 20) |
| **Max task title length** | Very long titles inflate token cost and can overflow context window | `parseInput.ts` — throw or truncate if `title.length > 200` |
| **Duplicate ID detection** | `1. A` and `1. B` silently coexist, confusing question attribution | `parseInput.ts` — detect non-unique IDs |
| **Non-sequential ID warning** | Gaps like `1, 3, 5` suggest missing lines passed silently | `parseInput.ts` — warn or reject non-sequential numbering |
| **Prompt injection detection** | Task titles flow directly into the LLM prompt; a malicious title can override agent behavior | `parseInput.ts` or a dedicated `sanitizeInput` step — strip or reject known injection patterns |
| **Topic/relevance filter** | Off-topic inputs like "Colombia vs France" are accepted and processed | LLM-based pre-check or keyword classifier before `generateQuestions` |
| **Encoding validation** | Null bytes and control characters in stdin can produce malformed prompts | `parseInput.ts` — filter out non-printable characters |

---

## 2. Output Guardrails

### Implemented

| Guardrail | Location |
|---|---|
| `questions` is an array and `totalQuestions` is a number | `generateQuestions.ts` → `isAgentOutput` (replaced by Zod) |
| Full nested shape validation via Zod schema | `domain/schemas.ts` → `agentOutputSchema` |
| `totalQuestions` must equal `questions.length` | `agentOutputSchema` refinement |
| `generatedAt` must be a valid ISO datetime | `agentOutputSchema` |
| `questionId` must match format `q_NNN` | `agentOutputSchema` |
| Each question must have at least 2 options | `formatQuestionsToJSON.ts` + `agentOutputSchema` |
| Questions array must be non-empty | `agentOutputSchema` (`min(1)`) |
| **Per-task cap enforced in code** (max 3 per task) | `generateQuestions.ts` — throws if `questions.length > tasks.length * 3` |

### Planned / Not Yet Implemented

| Guardrail | Risk | Suggested Location |
|---|---|---|
| **Language consistency in options** | Spanish questions receive English "Yes"/"No" options (seen in all samples) | Post-extraction step or system prompt — detect question language and assert options match |
| **Duplicate question deduplication** | Model can generate semantically identical questions for the same task | `formatQuestionsToJSON.ts` — normalize and deduplicate by question text |
| **Option ID format validation** | `opt_yes` / `opt_no` (from BRIEF) vs `opt_0` / `opt_1` (current impl) inconsistency | `agentOutputSchema` or `formatQuestionsToJSON.ts` |
| **Minimum reasoning length** | One-word reasoning like "test" passes through | `agentOutputSchema` — `z.string().min(10)` on `reasoning` |

---

## 3. Execution Guardrails

### Implemented

| Guardrail | Location |
|---|---|
| Reject empty `tasks` array | `generateQuestions.ts` |
| Require all env vars (`API_KEY`, `MODEL`, `BASE_URL`) | `agentFactory.ts` → `buildModel` |
| **Timeout on `agent.invoke`** (default 30 s, env-configurable via `AGENT_TIMEOUT_MS`) | `generateQuestions.ts` → `withTimeout` |
| **Max agent iterations** via `recursionLimit` passed at invoke time | `generateQuestions.ts` → `agent.invoke` config |
| **Tool call enforcement** — throws if `format_questions_to_json` was not called | `generateQuestions.ts` → `assertToolWasCalled` |
| Typed error messages distinguish validation vs runtime failures | `generateQuestions.ts` |

### Planned / Not Yet Implemented

| Guardrail | Risk | Suggested Location |
|---|---|---|
| **Retry with backoff** | Rate-limit (429) and transient network errors produce hard crashes | Wrap `agent.invoke` in a retry loop (3 attempts, exponential backoff) |
| **Token/cost estimation before call** | Large inputs sent without warning or soft cap | Estimate token count from prompt length; warn or reject above threshold |
| **Tool call audit/logging** | No record of what tools the agent actually called or how many times | LangChain callbacks in development/debug mode |
| **Structured error classification** | All errors look identical in `main().catch` | Introduce `InputValidationError`, `LLMCallError`, `OutputParsingError` classes |

---

## 4. Tools & Permission Guardrails

### Implemented

| Guardrail | Location |
|---|---|
| Zod schema on tool input (`questions` array shape) | `formatQuestionsToJSON.ts` — `rawQuestionSchema` |
| Non-empty question text per question | `formatQuestionsToJSON.ts` |
| Minimum 2 options per question | `formatQuestionsToJSON.ts` |

### Planned / Not Yet Implemented

| Guardrail | Risk | Suggested Location |
|---|---|---|
| **Tool call frequency cap** | Nothing prevents the agent from calling `format_questions_to_json` multiple times | Track call count via closure or LangChain callback; throw after first successful call |
| **Tool output size limit** | Agent could pass thousands of questions; no max size check | Check `questions.length` inside tool or immediately after return |
| **Prompt injection in tool input** | Model-provided `question` and `reasoning` flow into output JSON without sanitization | `formatQuestionsToJSON.ts` — strip control characters, limit field length |
| **Tool allowlist / permission model** | Future tools (web search, file I/O) have no permission enforcement | `ToolPermission` abstraction in domain; each tool declares required permissions |
| **Tool schema versioning** | Tool description and Zod schema can drift silently | Pin schema version in tool name or description; unit test asserting schema shape |

---

## Priority Order for Implementation

The following were chosen as highest-impact immediate improvements and are now implemented:

1. **Zod schema** replacing hand-rolled `isAgentOutput` — fixes multiple output guardrails in one change
2. **Per-task cap in code** (max 3 questions per task) — enforces the documented constraint that previously only lived in the system prompt
3. **Timeout** on `agent.invoke` — prevents silent hangs in production
4. **`recursionLimit`** at invoke time — prevents runaway agent loops
5. **Tool call verification** after `agent.invoke` — ensures the structured formatting path was actually taken
6. **Min 2 options** per question in `formatQuestionsToJSON` — a single voting option is not a valid vote
