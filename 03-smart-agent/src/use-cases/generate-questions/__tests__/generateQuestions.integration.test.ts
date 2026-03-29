import { generateQuestions } from '../generateQuestions';
import { AgentInput } from '../../../domain/types';
import * as agentFactory from '../../../infrastructure/agent/agentFactory';

const mockAgentOutput = JSON.stringify({
  questions: [
    {
      questionId: 'q_001',
      question: 'Should we prioritize Sprint planning?',
      options: [
        { id: 'opt_0', label: 'Yes' },
        { id: 'opt_1', label: 'No' },
      ],
      reasoning: 'Aligns team on priorities',
    },
  ],
  totalQuestions: 1,
  generatedAt: '2026-03-29T14:00:00.000Z',
});

const mockInvoke = jest.fn().mockResolvedValue({
  messages: [{ content: mockAgentOutput }],
});

jest.spyOn(agentFactory, 'buildAgent').mockReturnValue({
  invoke: mockInvoke,
} as unknown as ReturnType<typeof agentFactory.buildAgent>);

describe('generateQuestions', () => {
  const input: AgentInput = {
    tasks: [
      { id: 1, title: 'Sprint planning' },
      { id: 2, title: 'Retrospective' },
    ],
  };

  beforeEach(() => {
    mockInvoke.mockClear();
  });

  it('should call the agent with a user message containing the task list', async () => {
    await generateQuestions(input);

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    const callArg = mockInvoke.mock.calls[0][0];
    expect(callArg.messages[0].role).toBe('user');
    expect(callArg.messages[0].content).toContain('Sprint planning');
    expect(callArg.messages[0].content).toContain('Retrospective');
  });

  it('should return a valid AgentOutput with questions', async () => {
    const result = await generateQuestions(input);

    expect(result.totalQuestions).toBe(1);
    expect(result.questions).toHaveLength(1);
    expect(result.questions[0].questionId).toBe('q_001');
    expect(result.generatedAt).toBeDefined();
  });

  it('should extract the tool JSON even when the last message is prose', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [
        { content: mockAgentOutput },
        {
          content:
            'The voting questions have been successfully formatted. Here they are: ```json...```',
        },
      ],
    });

    const result = await generateQuestions(input);

    expect(result.totalQuestions).toBe(1);
    expect(result.questions[0].questionId).toBe('q_001');
  });

  it('should skip messages with valid JSON that is not an AgentOutput shape', async () => {
    const nonAgentOutputJson = JSON.stringify({ foo: 'bar' });
    mockInvoke.mockResolvedValueOnce({
      messages: [{ content: nonAgentOutputJson }, { content: mockAgentOutput }],
    });

    const result = await generateQuestions(input);

    expect(result.totalQuestions).toBe(1);
  });

  it('should throw when tasks array is empty', async () => {
    await expect(generateQuestions({ tasks: [] })).rejects.toThrow('Tasks array must not be empty');
  });

  it('should throw when no message contains valid AgentOutput JSON', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [{ content: 'not valid json' }, { content: 'also not json' }],
    });

    await expect(generateQuestions(input)).rejects.toThrow('Agent returned invalid JSON output');
  });

  it('should skip messages with non-string content', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [
        { content: [{ type: 'text', text: 'non-string content' }] },
        { content: mockAgentOutput },
      ],
    });

    const result = await generateQuestions(input);

    expect(result.totalQuestions).toBe(1);
  });

  it('should throw when all messages have non-string content and no valid JSON', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [{ content: [{ type: 'text', text: 'non-string content' }] }],
    });

    await expect(generateQuestions(input)).rejects.toThrow('Agent returned invalid JSON output');
  });
});
