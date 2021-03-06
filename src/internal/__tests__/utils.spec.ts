import { castArray, toNumber, toString } from '../utils';

test.each([
  ['', ''],
  [null, ''],
  [undefined, ''],
  [NaN, 'NaN'],
  [true, 'true'],
  [false, 'false'],
  [0, '0'],
  [Object(0), '0'],
  [-0, '-0'],
  [Object(-0), '-0'],
  [Symbol('text'), 'Symbol(text)'],
  [[Symbol('text')], 'Symbol(text)'],
  [[], ''],
  [['a'], 'a'],
  [['a', 'b'], 'a,b'],
  [{}, '[object Object]'],
  [Object(1), '1'],
  [Object('text'), 'text'],
  [new Date(''), 'Invalid Date'],
  [new Date(0), '1970-01-01T00:00:00.000Z'],
  [Object.create(null), '[object Object]'],
])('toString(%p) => %p', (input, result) => {
  expect(toString(input)).toBe(result);
});

test.each([
  ['', NaN],
  [null, NaN],
  [undefined, NaN],
  [1, 1],
  [Object(1), 1],
  [1.2, 1.2],
  [Object(1.2), 1.2],
  [NaN, NaN],
  [Infinity, Infinity],
  [-Infinity, -Infinity],
  [true, 1],
  [false, 0],
  [Symbol('text'), NaN],
  [[], 0],
  [[1], 1],
  [[1, 2], NaN],
  [{}, NaN],
  [Object.create(null), NaN],
  [new Date(0), 0],
  [0, 0],
  [Object(0), 0],
  [-0, -0],
  [Object(-0), -0],
  ['0', 0],
  [Object('0'), 0],
  ['-0', -0],
  [Object('-0'), -0],
  [' 1 ', 1],
  [new Date(0), 0],
  [Number.MAX_VALUE, Number.MAX_VALUE],
  [Number.MIN_VALUE, Number.MIN_VALUE],
  [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
  [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
])('toNumber(%p) => %p', (input, result) => {
  expect(toNumber(input)).toBe(result);
});

test.each([
  [NaN, [NaN]],
  [null, [null]],
  [true, [true]],
  [false, [false]],
  [undefined, [undefined]],
  [0, [0]],
  [1, [1]],
  ['text', ['text']],
  [{}, [{}]],
  [Object.create(null), [Object.create(null)]],
  [
    [NaN, null, true, false, undefined, 0, 1, 'text', {}, Object.create(null)],
    [NaN, null, true, false, undefined, 0, 1, 'text', {}, Object.create(null)],
  ],
])('castArray(%p) => %p', (input, result) => {
  expect(castArray(input)).toEqual(result);
});
