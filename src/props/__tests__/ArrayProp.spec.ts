import { parseDTO, serializeDTO } from '../../traversers';
import { ArrayProp, ArrayPropOptions } from '../ArrayProp';
import { StringProp } from '../StringProp';

test.each<[undefined | ArrayPropOptions, unknown, null | unknown[]]>([
  [undefined, null, []],
  [undefined, NaN, [NaN]],
  [undefined, [1, 2, 3], [1, 2, 3]],
  [undefined, ['a', 'b', 'c'], ['a', 'b', 'c']],

  [{ defaultValue: null }, NaN, [NaN]],
  [{ defaultValue: null }, null, null],
  [{ defaultValue: () => [1, 2, 3] }, null, [1, 2, 3]],
  [{ defaultValue: () => ['a', 'b', 'c'] }, null, ['a', 'b', 'c']],

  [{ defaultValue: null }, [1, 2], [1, 2]],
  [{ defaultValue: () => [1, 2, 3] }, [1, 2], [1, 2]],
  [{ defaultValue: () => ['a', 'b', 'c'] }, ['a', 'b'], ['a', 'b']],
])('ArrayProp(%p) %p => %p', (options, input, result) => {
  class Foo {
    @ArrayProp(options) values: null | unknown[];
  }

  const parsed = parseDTO(Foo, { values: input });
  expect(parsed).toBeInstanceOf(Foo);
  expect(parsed).toEqual({ values: result });

  const parsed2 = parseDTO(Foo, parsed);
  expect(parsed2).toBeInstanceOf(Foo);
  expect(parsed2).toEqual({ values: result });

  const serialized: any = serializeDTO(Foo, { values: input });
  expect(serialized).not.toBeInstanceOf(Foo);
  expect(serialized).toEqual({ values: result });

  const serialized2: any = serializeDTO(Foo, serialized);
  expect(serialized2).not.toBeInstanceOf(Foo);
  expect(serialized2).toEqual({ values: result });

  const parsed3 = parseDTO(Foo, serialized);
  expect(parsed3).toBeInstanceOf(Foo);
  expect(parsed3).toEqual({ values: result });

  const serialized3 = parseDTO(Foo, parsed);
  expect(serialized3).toBeInstanceOf(Foo);
  expect(serialized3).toEqual({ values: result });
});

test.each<[ArrayPropOptions, unknown, null | string[]]>([
  [{}, null, []],
  [{}, NaN, ['NaN']],
  [{}, [1, 2, 3], ['1', '2', '3']],
  [{}, ['a', 'b', 'c'], ['a', 'b', 'c']],

  [{ defaultValue: null }, NaN, ['NaN']],
  [{ defaultValue: null }, null, null],
  [{ defaultValue: () => [1, 2, 3] }, null, ['1', '2', '3']],
  [{ defaultValue: () => ['a', 'b', 'c'] }, null, ['a', 'b', 'c']],

  [{ defaultValue: null }, [1, 2], ['1', '2']],
  [{ defaultValue: () => [1, 2, 3] }, [1, 2], ['1', '2']],
  [{ defaultValue: () => ['a', 'b', 'c'] }, ['a', 'b'], ['a', 'b']],
])('ArrayProp(%p) + StringProp() %p => %p', (options, input, result) => {
  class Foo {
    @ArrayProp(options) @StringProp() values: null | string[];
  }

  const parsed = parseDTO(Foo, { values: input });
  expect(parsed).toBeInstanceOf(Foo);
  expect(parsed).toEqual({ values: result });

  const parsed2 = parseDTO(Foo, parsed);
  expect(parsed2).toBeInstanceOf(Foo);
  expect(parsed2).toEqual({ values: result });

  const serialized: any = serializeDTO(Foo, { values: input });
  expect(serialized).not.toBeInstanceOf(Foo);
  expect(serialized).toEqual({ values: result });

  const serialized2: any = serializeDTO(Foo, serialized);
  expect(serialized2).not.toBeInstanceOf(Foo);
  expect(serialized2).toEqual({ values: result });

  const parsed3 = parseDTO(Foo, serialized);
  expect(parsed3).toBeInstanceOf(Foo);
  expect(parsed3).toEqual({ values: result });

  const serialized3 = parseDTO(Foo, parsed);
  expect(serialized3).toBeInstanceOf(Foo);
  expect(serialized3).toEqual({ values: result });
});
