import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-12-01')).toBe('01.12.2024');
    expect(formatDate('2023-01-05')).toBe('05.1.2023');
    expect(formatDate('2025-11-30')).toBe('30.11.2025');
  });

  it('should handle dates with single digit day and month', () => {
    expect(formatDate('2024-02-03')).toBe('03.2.2024');
  });

  it('should handle dates with single digit day', () => {
    expect(formatDate('2024-12-05')).toBe('05.12.2024');
  });

  it('should handle dates with single digit month', () => {
    expect(formatDate('2024-05-15')).toBe('15.5.2024');
  });
});