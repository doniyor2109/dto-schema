import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { NumberProp, NumberPropOptions } from '../NumberProp';

test.each<[NumberPropOptions, unknown, number | null]>([
  [{}, 1, 1],
  [{}, '1', 1],
  [{}, true, 1],
  [{}, false, 0],
  [{}, new Date(0), 0],

  [{}, '', NaN],
  [{}, NaN, NaN],
  [{}, null, NaN],
  [{}, undefined, NaN],
  [{ defaultValue: null }, '', NaN],
  [{ defaultValue: null }, NaN, NaN],
  [{ defaultValue: null }, null, null],
  [{ defaultValue: null }, undefined, null],

  [{ defaultValue: 42 }, NaN, 42],
  [{ defaultValue: 42 }, null, 42],
  [{ defaultValue: 42 }, undefined, 42],

  [{ round: true }, 0.9, 1],
  [{ round: true }, 5.95, 6],
  [{ round: true }, 5.5, 6],
  [{ round: true }, 5.05, 5],
  [{ round: true }, -5.05, -5],
  [{ round: true }, -5.5, -5],
  [{ round: true }, -5.95, -6],

  [{ round: 'ceil' }, 0.95, 1],
  [{ round: 'ceil' }, 4, 4],
  [{ round: 'ceil' }, 7.004, 8],
  [{ round: 'ceil' }, -7.004, -7],

  [{ round: 'floor' }, 5.95, 5],
  [{ round: 'floor' }, 5.05, 5],
  [{ round: 'floor' }, 5, 5],
  [{ round: 'floor' }, -5.05, -6],

  [{ round: 'trunc' }, 13.37, 13],
  [{ round: 'trunc' }, 42.84, 42],
  [{ round: 'trunc' }, 0.123, 0],
  [{ round: 'trunc' }, -0.123, -0],

  [{ clampMax: 5 }, 10, 5],
  [{ clampMin: -5 }, -10, -5],
  [{ clampMax: 5, clampMin: -5 }, 10, 5],
  [{ clampMax: 5, clampMin: -5 }, -10, -5],
])('NumberProp(%p, { value: %p }) => %p', (options, input, result) => {
  class Foo {
    @NumberProp(options) value: string;
  }

  const parsed = parseDTO(Foo, { value: input });
  expect(parsed).toBeInstanceOf(Foo);
  expect(parsed).toEqual({ value: result });

  const serialized = serializeDTO(Foo, { value: input });
  expect(serialized).not.toBeInstanceOf(Foo);
  expect(serialized).toEqual({ value: result });

  const serializedFromParsed = serializeDTO(
    Foo,
    parseDTO(Foo, { value: input }),
  );
  expect(serializedFromParsed).not.toBeInstanceOf(Foo);
  expect(serializedFromParsed).toEqual({ value: result });
});
