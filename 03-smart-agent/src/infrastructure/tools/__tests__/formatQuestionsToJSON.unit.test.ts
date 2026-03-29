import { formatQuestionsToJSON } from '../formatQuestionsToJSON';
import { RawQuestion } from '../../../domain/types';

describe('formatQuestionsToJSON', () => {
  const validQuestions: RawQuestion[] = [
    {
      question: 'Should we prioritize task A?',
      options: ['Yes', 'No'],
      reasoning: 'Task A has high business impact',
    },
    {
      question: 'Is task B ready for demo?',
      options: ['Yes', 'No'],
      reasoning: 'Task B was scheduled for this sprint',
    },
  ];

  it('should return an AgentOutput JSON string with all questions', () => {
    const result = formatQuestionsToJSON(validQuestions);
    const parsed = JSON.parse(result);

    expect(parsed.totalQuestions).toBe(2);
    expect(parsed.questions).toHaveLength(2);
    expect(parsed.generatedAt).toBeDefined();
  });

  it('should generate sequential questionIds in format q_001, q_002', () => {
    const result = formatQuestionsToJSON(validQuestions);
    const parsed = JSON.parse(result);

    expect(parsed.questions[0].questionId).toBe('q_001');
    expect(parsed.questions[1].questionId).toBe('q_002');
  });

  it('should map each option string to a VotingOption with id and label', () => {
    const result = formatQuestionsToJSON(validQuestions);
    const parsed = JSON.parse(result);

    expect(parsed.questions[0].options).toEqual([
      { id: 'opt_0', label: 'Yes' },
      { id: 'opt_1', label: 'No' },
    ]);
  });

  it('should preserve question text and reasoning', () => {
    const result = formatQuestionsToJSON(validQuestions);
    const parsed = JSON.parse(result);

    expect(parsed.questions[0].question).toBe('Should we prioritize task A?');
    expect(parsed.questions[0].reasoning).toBe('Task A has high business impact');
  });

  it('should return a valid ISO timestamp in generatedAt', () => {
    const before = new Date().toISOString();
    const result = formatQuestionsToJSON(validQuestions);
    const after = new Date().toISOString();
    const parsed = JSON.parse(result);

    expect(parsed.generatedAt >= before).toBe(true);
    expect(parsed.generatedAt <= after).toBe(true);
  });

  it('should throw when questions array is empty', () => {
    expect(() => formatQuestionsToJSON([])).toThrow('Questions array must not be empty');
  });

  it('should throw when a question has an empty question string', () => {
    const invalid: RawQuestion[] = [{ question: '', options: ['Yes', 'No'], reasoning: 'test' }];

    expect(() => formatQuestionsToJSON(invalid)).toThrow('Question text must not be empty');
  });

  it('should throw when a question has no options', () => {
    const invalid: RawQuestion[] = [{ question: 'Is this valid?', options: [], reasoning: 'test' }];

    expect(() => formatQuestionsToJSON(invalid)).toThrow('Question must have at least one option');
  });
});
