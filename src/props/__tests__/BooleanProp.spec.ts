import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { BooleanProp, BooleanPropOptions } from '../BooleanProp';

test.each<[BooleanPropOptions, unknown, boolean | null]>([
  [{}, true, true],
  [{}, false, false],
  [{}, 1, true],
  [{}, '1', true],

  [{}, 0, false],
  [{}, '', false],
  [{}, NaN, false],
  [{}, null, false],
  [{}, undefined, false],
  [{ defaultValue: null }, 0, false],
  [{ defaultValue: null }, '', false],
  [{ defaultValue: null }, NaN, false],
  [{ defaultValue: null }, null, null],
  [{ defaultValue: null }, undefined, null],

  [{ defaultValue: true }, NaN, false],
  [{ defaultValue: true }, null, true],
  [{ defaultValue: true }, undefined, true],
])('BooleanProp(%p, { value: %p }) => %p', (options, input, result) => {
  class Foo {
    @BooleanProp(options)
    value: string;
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
