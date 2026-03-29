import { AgendaTask } from './entities/AgendaTask';
import { GeneratedQuestion } from './entities/GeneratedQuestion';

export interface AgentInput {
  tasks: AgendaTask[];
}

export interface AgentOutput {
  questions: GeneratedQuestion[];
  totalQuestions: number;
  generatedAt: string;
}

export interface RawQuestion {
  question: string;
  options: string[];
  reasoning: string;
}
