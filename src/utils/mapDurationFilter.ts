/**
 * Maps duration filter string to internal representation
 * @param filter - Duration filter string ('<5', '5-20', '>20')
 * @returns 'short' | 'medium' | 'long' | undefined
 */
import type { DurationValue } from '@/types/filter';

export function mapDurationFilter(filter: string): DurationValue | undefined {
  switch (filter) {
    case '<5':
      return 'short';
    case '5-20':
      return 'medium';
    case '>20':
      return 'long';
    default:
      return undefined;
  }
}