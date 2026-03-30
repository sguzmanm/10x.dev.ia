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

const toolMessage = {
  type: 'tool',
  name: 'format_questions_to_json',
  content: mockAgentOutput,
};

const mockInvoke = jest.fn().mockResolvedValue({
  messages: [toolMessage],
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

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call the agent with a user message containing the task list', async () => {
    await generateQuestions(input);

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    const callArg = mockInvoke.mock.calls[0][0];
    expect(callArg.messages[0].role).toBe('user');
    expect(callArg.messages[0].content).toContain('Sprint planning');
    expect(callArg.messages[0].content).toContain('Retrospective');
  });

  it('should pass recursionLimit to agent.invoke', async () => {
    await generateQuestions(input);

    const callConfig = mockInvoke.mock.calls[0][1];
    expect(callConfig).toMatchObject({ recursionLimit: expect.any(Number) });
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
        toolMessage,
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
      messages: [toolMessage, { content: nonAgentOutputJson }],
    });

    const result = await generateQuestions(input);

    expect(result.totalQuestions).toBe(1);
  });

  it('should throw when tasks array is empty', async () => {
    await expect(generateQuestions({ tasks: [] })).rejects.toThrow(
      'Tasks array must not be empty',
    );
  });

  it('should throw when no message contains valid AgentOutput JSON', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [
        { type: 'tool', name: 'format_questions_to_json', content: 'not valid json' },
        { content: 'also not json' },
      ],
    });

    await expect(generateQuestions(input)).rejects.toThrow('Agent returned invalid JSON output');
  });

  it('should skip messages with non-string content', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [
        toolMessage,
        { content: [{ type: 'text', text: 'non-string content' }] },
      ],
    });

    const result = await generateQuestions(input);

    expect(result.totalQuestions).toBe(1);
  });

  it('should throw when all messages have non-string content and no valid JSON', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [
        {
          type: 'tool',
          name: 'format_questions_to_json',
          content: [{ type: 'text', text: 'non-string content' }],
        },
      ],
    });

    await expect(generateQuestions(input)).rejects.toThrow('Agent returned invalid JSON output');
  });

  it('should throw when the agent does not call the format_questions_to_json tool', async () => {
    mockInvoke.mockResolvedValueOnce({
      messages: [{ content: mockAgentOutput }],
    });

    await expect(generateQuestions(input)).rejects.toThrow(
      'Agent did not call the required tool: format_questions_to_json',
    );
  });

  it('should throw when agent exceeds the maximum questions per task', async () => {
    const tooManyQuestions = JSON.stringify({
      questions: Array.from({ length: 7 }, (_, i) => ({
        questionId: `q_${String(i + 1).padStart(3, '0')}`,
        question: `Question ${i + 1}?`,
        options: [
          { id: 'opt_0', label: 'Yes' },
          { id: 'opt_1', label: 'No' },
        ],
        reasoning: `Reasoning for question ${i + 1}`,
      })),
      totalQuestions: 7,
      generatedAt: '2026-03-29T14:00:00.000Z',
    });

    mockInvoke.mockResolvedValueOnce({
      messages: [{ type: 'tool', name: 'format_questions_to_json', content: tooManyQuestions }],
    });

    // input has 2 tasks → maxAllowed = 6
    await expect(generateQuestions(input)).rejects.toThrow(
      'Agent returned 7 questions but maximum allowed is 6',
    );
  });

  it('should throw when the agent call times out', async () => {
    jest.useFakeTimers();
    mockInvoke.mockReturnValueOnce(new Promise(() => {}));

    const resultPromise = generateQuestions(input);
    jest.runAllTimers();

    await expect(resultPromise).rejects.toThrow('Agent timed out after 30000ms');
  });
});
