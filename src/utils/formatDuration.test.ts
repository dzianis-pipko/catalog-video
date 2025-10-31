import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  test('should format seconds to MM:SS format', () => {
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(120)).toBe('2:00');
    expect(formatDuration(30)).toBe('0:30');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(3600)).toBe('60:00');
    expect(formatDuration(3661)).toBe('61:01');
  });

  test('should handle edge cases', () => {
    expect(formatDuration(59)).toBe('0:59');
    expect(formatDuration(61)).toBe('1:01');
    expect(formatDuration(3599)).toBe('59:59');
  });
});