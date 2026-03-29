import { buildAgent } from '../agentFactory';

jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({ id: 'mock-model' })),
}));

jest.mock('langchain', () => ({
  ...jest.requireActual('langchain'),
  createAgent: jest.fn().mockReturnValue({ invoke: jest.fn() }),
}));

const originalEnv = process.env;

describe('agentFactory', () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      OPENROUTER_API_KEY: 'test-key',
      OPENROUTER_MODEL: 'openai/gpt-4o-mini',
      OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
      OPENROUTER_TEMPERATURE: '0',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should build an agent when all env vars are set', () => {
    const agent = buildAgent();

    expect(agent).toBeDefined();
    expect(agent.invoke).toBeDefined();
  });

  it('should throw when OPENROUTER_API_KEY is missing', () => {
    delete process.env.OPENROUTER_API_KEY;

    expect(() => buildAgent()).toThrow('OPENROUTER_API_KEY environment variable is required');
  });

  it('should throw when OPENROUTER_MODEL is missing', () => {
    delete process.env.OPENROUTER_MODEL;

    expect(() => buildAgent()).toThrow('OPENROUTER_MODEL environment variable is required');
  });

  it('should throw when OPENROUTER_BASE_URL is missing', () => {
    delete process.env.OPENROUTER_BASE_URL;

    expect(() => buildAgent()).toThrow('OPENROUTER_BASE_URL environment variable is required');
  });
});
