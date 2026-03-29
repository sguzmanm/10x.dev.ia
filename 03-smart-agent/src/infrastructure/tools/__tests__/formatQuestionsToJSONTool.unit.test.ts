import { formatQuestionsToJSONTool } from '../formatQuestionsToJSON';

describe('formatQuestionsToJSONTool (LangChain tool wrapper)', () => {
  it('should invoke the tool and return a valid JSON string', async () => {
    const input = {
      questions: [
        {
          question: 'Should we start the retrospective now?',
          options: ['Yes', 'No'],
          reasoning: 'The team needs to reflect on the sprint',
        },
      ],
    };

    const result = await formatQuestionsToJSONTool.invoke(input);
    const parsed = JSON.parse(result as string);

    expect(parsed.totalQuestions).toBe(1);
    expect(parsed.questions[0].questionId).toBe('q_001');
  });
});
