import { tool } from 'langchain';
import * as z from 'zod';
import { AgentOutput, RawQuestion } from '../../domain/types';
import { GeneratedQuestion } from '../../domain/entities/GeneratedQuestion';
import { VotingOption } from '../../domain/entities/VotingOption';

function padIndex(index: number): string {
  return String(index + 1).padStart(3, '0');
}

function mapOptions(options: string[]): VotingOption[] {
  return options.map((label, i) => ({ id: `opt_${i}`, label }));
}

export function formatQuestionsToJSON(questions: RawQuestion[]): string {
  if (questions.length === 0) {
    throw new Error('Questions array must not be empty');
  }

  const generated: GeneratedQuestion[] = questions.map((raw, index) => {
    if (!raw.question.trim()) {
      throw new Error('Question text must not be empty');
    }
    if (raw.options.length < 2) {
      throw new Error('Question must have at least two options');
    }

    return {
      questionId: `q_${padIndex(index)}`,
      question: raw.question,
      options: mapOptions(raw.options),
      reasoning: raw.reasoning,
    };
  });

  const output: AgentOutput = {
    questions: generated,
    totalQuestions: generated.length,
    generatedAt: new Date().toISOString(),
  };

  return JSON.stringify(output);
}

const rawQuestionSchema = z.object({
  question: z.string().describe('The voting question text'),
  options: z.array(z.string()).describe('List of voting options (e.g. ["Yes", "No"])'),
  reasoning: z.string().describe('Why this question is relevant to the agenda'),
});

export const formatQuestionsToJSONTool = tool(
  (input: { questions: Array<{ question: string; options: string[]; reasoning: string }> }) =>
    formatQuestionsToJSON(input.questions),
  {
    name: 'format_questions_to_json',
    description:
      'Formats raw voting questions into a structured JSON output. Call this tool once with ALL questions generated from the agenda tasks.',
    schema: z.object({
      questions: z.array(rawQuestionSchema).describe('Array of raw questions to format'),
    }),
  },
);
