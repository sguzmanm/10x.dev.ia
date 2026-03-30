import { z } from 'zod';

const votingOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const generatedQuestionSchema = z.object({
  questionId: z.string().regex(/^q_\d{3}$/),
  question: z.string().min(1),
  options: z.array(votingOptionSchema).min(2),
  reasoning: z.string().min(1),
});

export const agentOutputSchema = z
  .object({
    questions: z.array(generatedQuestionSchema).min(1),
    totalQuestions: z.number().int().nonnegative(),
    generatedAt: z.string().datetime(),
  })
  .refine((data) => data.totalQuestions === data.questions.length, {
    message: 'totalQuestions must match questions.length',
    path: ['totalQuestions'],
  });
