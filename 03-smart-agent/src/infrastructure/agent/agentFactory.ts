import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { formatQuestionsToJSONTool } from '../tools/formatQuestionsToJSON';

const SYSTEM_PROMPT = `You are an expert facilitator who helps teams make decisions collaboratively.

You will receive a list of agenda tasks for a session. Your job is to generate relevant voting questions that participants can vote on.

Rules:
- Generate at most 3 questions per agenda task
- Each question must be answerable with simple options like "Yes" / "No"
- Questions should be specific, actionable, and directly relevant to the task
- Include clear reasoning for why each question helps the group make a decision
- Once you have all questions ready, you MUST call the format_questions_to_json tool with all questions at once

Do not make up information. Base all questions strictly on the provided agenda tasks.`;

function buildModel(): ChatOpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  const baseURL = process.env.OPENROUTER_BASE_URL;
  const temperature = Number(process.env.OPENROUTER_TEMPERATURE ?? 0);

  if (!apiKey) throw new Error('OPENROUTER_API_KEY environment variable is required');
  if (!model) throw new Error('OPENROUTER_MODEL environment variable is required');
  if (!baseURL) throw new Error('OPENROUTER_BASE_URL environment variable is required');

  return new ChatOpenAI({
    model,
    apiKey,
    temperature,
    configuration: {
      baseURL,
      defaultHeaders: {
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER ?? '',
        'X-Title': process.env.OPENROUTER_APP_TITLE ?? '',
      },
    },
  });
}

export function buildAgent(): ReturnType<typeof createAgent> {
  const model = buildModel();

  return createAgent({
    model,
    systemPrompt: SYSTEM_PROMPT,
    tools: [formatQuestionsToJSONTool],
  });
}
