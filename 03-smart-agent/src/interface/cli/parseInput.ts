import { AgendaTask } from '../../domain/entities/AgendaTask';

const NUMBERED_LINE_REGEX = /^(\d+)\.\s+(.+)$/;

export function parseInput(raw: string): AgendaTask[] {
  if (!raw.trim()) {
    throw new Error('Input must not be empty');
  }

  const tasks = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .reduce<AgendaTask[]>((acc, line) => {
      const match = NUMBERED_LINE_REGEX.exec(line);
      if (!match) return acc;

      acc.push({ id: Number(match[1]), title: match[2].trim() });
      return acc;
    }, []);

  if (tasks.length === 0) {
    throw new Error('No valid tasks found in input');
  }

  return tasks;
}
