import { VotingOption } from './VotingOption';

export interface GeneratedQuestion {
  questionId: string;
  question: string;
  options: VotingOption[];
  reasoning: string;
}
