import { displayOutput } from '../displayOutput';
import { AgentOutput } from '../../../domain/types';

describe('displayOutput', () => {
  const output: AgentOutput = {
    questions: [
      {
        questionId: 'q_001',
        question: 'Should we prioritize task A?',
        options: [
          { id: 'opt_0', label: 'Yes' },
          { id: 'opt_1', label: 'No' },
        ],
        reasoning: 'High business impact',
      },
    ],
    totalQuestions: 1,
    generatedAt: '2026-03-29T14:00:00.000Z',
  };

  it('should print the output as formatted JSON to stdout', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    displayOutput(output);

    expect(spy).toHaveBeenCalledWith(JSON.stringify(output, null, 2));
    spy.mockRestore();
  });
});
