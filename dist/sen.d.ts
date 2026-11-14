import type { Squares } from './types';
/**
 * SEN is like FEN string of chess.
 * # stand for empty square. The number immedemiatly after # show number of space.
 * / stand for the row.
 * Example: 3#8/176#429
 * The above string represents 2 rows. the first item in first row is 3 and the rest are empty
 * space. The 2nd row has 1 7 6 and four empty space and then the 2 and the 9
 *
 * */
/**
export const convertSenToSquares = (sen: string): Squares => {
  console.log('sen', sen);
  const value: string[] = sen
    .replaceAll(/#(\d)(\d*)/g, (_: string, n: string, r: string) => '0'.repeat(Number(n)) + r)
    .split('/');
  let v = value as string[];
  if (hasValidLength(v)) {
    throw new Error('Invalid');
  }
  return new Map();
};
*/
export declare const hasValidLength: (str: string[]) => boolean;
export declare const read: (sen: string) => Squares;
