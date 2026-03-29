import { parseInput } from '../parseInput';

describe('parseInput', () => {
  it('should parse a numbered list into AgendaTask[]', () => {
    const input = '1. Sprint planning\n2. Retrospective\n3. Demo';

    const result = parseInput(input);

    expect(result).toEqual([
      { id: 1, title: 'Sprint planning' },
      { id: 2, title: 'Retrospective' },
      { id: 3, title: 'Demo' },
    ]);
  });

  it('should parse a single-item list', () => {
    const input = '1. Sprint planning';

    const result = parseInput(input);

    expect(result).toEqual([{ id: 1, title: 'Sprint planning' }]);
  });

  it('should trim whitespace around titles', () => {
    const input = '1.   Sprint planning   \n2.   Retrospective   ';

    const result = parseInput(input);

    expect(result).toEqual([
      { id: 1, title: 'Sprint planning' },
      { id: 2, title: 'Retrospective' },
    ]);
  });

  it('should ignore blank lines between tasks', () => {
    const input = '1. Sprint planning\n\n2. Retrospective';

    const result = parseInput(input);

    expect(result).toEqual([
      { id: 1, title: 'Sprint planning' },
      { id: 2, title: 'Retrospective' },
    ]);
  });

  it('should throw when input is an empty string', () => {
    expect(() => parseInput('')).toThrow('Input must not be empty');
  });

  it('should throw when input contains no valid numbered lines', () => {
    expect(() => parseInput('not a list\njust text')).toThrow('No valid tasks found in input');
  });
});
