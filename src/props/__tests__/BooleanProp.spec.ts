import { parseDTO, serializeDTO } from '../../traversers';
import { BooleanProp, BooleanPropOptions } from '../BooleanProp';

test.each<[undefined | BooleanPropOptions, unknown, boolean | null]>([
  [undefined, true, true],
  [undefined, false, false],
  [undefined, 1, true],
  [undefined, '1', true],

  [undefined, 0, false],
  [undefined, '', false],
  [undefined, NaN, false],
  [undefined, null, false],
  [undefined, undefined, false],
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
    @BooleanProp(options) value: string;
  }

  const parsed1 = parseDTO(Foo, { value: input });
  expect(parsed1).toBeInstanceOf(Foo);
  expect(parsed1).toEqual({ value: result });

  const parsed2 = parseDTO(Foo, parseDTO(Foo, { value: input }));
  expect(parsed2).toBeInstanceOf(Foo);
  expect(parsed2).toEqual({ value: result });

  const serialized1 = serializeDTO(Foo, { value: input });
  expect(serialized1).not.toBeInstanceOf(Foo);
  expect(serialized1).toEqual({ value: result });

  const serialized2 = serializeDTO(Foo, parseDTO(Foo, { value: input }));
  expect(serialized2).not.toBeInstanceOf(Foo);
  expect(serialized2).toEqual({ value: result });
});
