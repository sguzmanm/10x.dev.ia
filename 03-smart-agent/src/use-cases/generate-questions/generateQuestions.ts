import { AgentInput, AgentOutput } from '../../domain/types';
import { buildAgent } from '../../infrastructure/agent/agentFactory';

function formatTasksPrompt(input: AgentInput): string {
  const taskLines = input.tasks.map((t) => `${t.id}. ${t.title}`).join('\n');
  return `Here is the agenda for the session. Generate relevant voting questions for each task:\n\n${taskLines}`;
}

function isAgentOutput(value: unknown): value is AgentOutput {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as AgentOutput).questions) &&
    typeof (value as AgentOutput).totalQuestions === 'number'
  );
}

function extractAgentOutput(messages: Array<{ content: unknown }>): AgentOutput {
  for (let i = messages.length - 1; i >= 0; i--) {
    const { content } = messages[i];
    if (typeof content !== 'string') continue;

    try {
      const parsed: unknown = JSON.parse(content);
      if (isAgentOutput(parsed)) return parsed;
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

  const agent = buildAgent();
  const userMessage = formatTasksPrompt(input);

  const response = await agent.invoke({
    messages: [{ role: 'user', content: userMessage }],
  });

  return extractAgentOutput(response.messages);
}
