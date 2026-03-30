import { AgentInput, AgentOutput } from '../../domain/types';
import { buildAgent } from '../../infrastructure/agent/agentFactory';
import { agentOutputSchema } from '../../domain/schemas';

const MAX_QUESTIONS_PER_TASK = 3;
const MAX_AGENT_ITERATIONS = 5;
const AGENT_TIMEOUT_MS = Number(process.env.AGENT_TIMEOUT_MS ?? 30000);
const TOOL_NAME = 'format_questions_to_json';

interface AgentMessage {
  content: unknown;
  type?: string;
  name?: string;
}

function formatTasksPrompt(input: AgentInput): string {
  const taskLines = input.tasks.map((t) => `${t.id}. ${t.title}`).join('\n');
  return `Here is the agenda for the session. Generate relevant voting questions for each task:\n\n${taskLines}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Agent timed out after ${ms}ms`)), ms),
  );
  return Promise.race([promise, timeout]);
}

function assertToolWasCalled(messages: AgentMessage[]): void {
  const toolCallFound = messages.some(
    (msg) => msg.type === 'tool' && msg.name === TOOL_NAME,
  );
  if (!toolCallFound) {
    throw new Error(`Agent did not call the required tool: ${TOOL_NAME}`);
  }
}

function extractAgentOutput(messages: AgentMessage[]): AgentOutput {
  for (let i = messages.length - 1; i >= 0; i--) {
    const { content } = messages[i];
    if (typeof content !== 'string') continue;

    try {
      const parsed: unknown = JSON.parse(content);
      const result = agentOutputSchema.safeParse(parsed);
      if (result.success) return result.data;
    } catch {
      continue;
    }
  }

  throw new Error('Agent returned invalid JSON output');
}

export async function generateQuestions(input: AgentInput): Promise<AgentOutput> {
  if (input.tasks.length === 0) {
    throw new Error('Tasks array must not be empty');
  }

  const maxAllowed = input.tasks.length * MAX_QUESTIONS_PER_TASK;
  const agent = buildAgent();
  const userMessage = formatTasksPrompt(input);

  const response = await withTimeout(
    agent.invoke(
      { messages: [{ role: 'user', content: userMessage }] },
      { recursionLimit: MAX_AGENT_ITERATIONS },
    ),
    AGENT_TIMEOUT_MS,
  );

  assertToolWasCalled(response.messages as AgentMessage[]);

  const output = extractAgentOutput(response.messages as AgentMessage[]);

  if (output.questions.length > maxAllowed) {
    throw new Error(
      `Agent returned ${output.questions.length} questions but maximum allowed is ${maxAllowed} (${input.tasks.length} tasks × ${MAX_QUESTIONS_PER_TASK})`,
    );
  }

  return output;
}
