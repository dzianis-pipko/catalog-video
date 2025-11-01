import { mapDurationFilter } from './mapDurationFilter';

describe('mapDurationFilter', () => {
  test('should return "short" for "<5"', () => {
    expect(mapDurationFilter('<5')).toBe('short');
  });

  test('should return "medium" for "5-20"', () => {
    expect(mapDurationFilter('5-20')).toBe('medium');
  });

  test('should return "long" for ">20"', () => {
    expect(mapDurationFilter('>20')).toBe('long');
  });

  test('should return undefined for invalid values', () => {
    expect(mapDurationFilter('invalid')).toBeUndefined();
    expect(mapDurationFilter('')).toBeUndefined();
    expect(mapDurationFilter('10')).toBeUndefined();
  });
});