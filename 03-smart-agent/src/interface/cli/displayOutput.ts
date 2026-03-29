import { AgentOutput } from '../../domain/types';

export function displayOutput(output: AgentOutput): void {
  console.log(JSON.stringify(output, null, 2));
}
