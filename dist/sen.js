import { Box, id } from './lib';
import { getKeys } from './utils';
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
export const hasValidLength = (str) => str.every(s => s.length === 9);
export const read = (sen) => {
    let squares = new Map();
    squares = Box(sen)
        .map(sen => {
        return sen.split('/');
    })
        .map(sens => {
        console.log(sens);
        const r = sens.map(sen => {
            return sen.replaceAll(/[#0.](\d)(\d*)/g, (_, n, rest) => '0'.repeat(Number(n)) + rest);
        });
        return r;
    })
        .map(sens => {
        const res = sens.map(s => {
            if (s.length >= 9)
                return s;
            const restLength = 9 - s.length;
            s = s + '0'.repeat(restLength);
            return s;
        });
        return res;
    })
        .map(input => {
        input = input.map(s => {
            if (s.length > 9) {
                s = s.slice(0, -1);
            }
            return s;
        });
        return input;
    })
        .map(sens => {
        return sens;
    })
        .map(r => {
        if (r.length < 9) {
            const restLength = 9 - r.length;
            const rest = Array.from(Array(restLength).keys()).map(() => '0'.repeat(9));
            r = r.concat(rest);
            return r;
        }
        return r;
    })
        .map(input => {
        const keys = getKeys();
        const jnput = input.map(r => r.split(''));
        const jalues = jnput[0].map((_, colIndex) => input.map(row => row[colIndex]));
        const values = jalues.flat();
        keys.forEach((key, i) => {
            const value = values[i];
            squares.set(key, value);
        });
        return squares;
    })
        .fold(id);
    return squares;
};
//# sourceMappingURL=sen.js.map