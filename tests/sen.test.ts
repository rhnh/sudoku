import { describe, expect, test } from 'vitest';

import { read } from '../src/sen.ts';

describe('sen.ts:read', () => {
  test('should', () => {
    const result = read('1123/123/123/34');
    expect(result).toBe([]);
  });
});
