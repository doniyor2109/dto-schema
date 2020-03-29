import { parseDTO, serializeDTO } from '../../traversers';
import { Prop } from '../Prop';

test.each<[unknown, null | Set<unknown>, null | unknown[]]>([
  [NaN, new Set(), []],
  [null, null, null],
  [undefined, null, null],

  [[1, 2], new Set([1, 2]), [1, 2]],
  [['a', 'b'], new Set(['a', 'b']), ['a', 'b']],

  [[1, 2, 1], new Set([1, 2]), [1, 2]],
])('Prop() %p => %p', (input, parseResult, serializeResult) => {
  class Foo {
    @Prop<Set<string>>({
      type: 'set',
      testType(value) {
        return value instanceof Set;
      },
      normalize(value) {
        return value == null
          ? null
          : value instanceof Set
          ? value
          : Array.isArray(value)
          ? new Set(value)
          : new Set();
      },
      serialize(value) {
        return value == null ? null : Array.from(value);
      },
    })
    value: Set<string>;
  }

  const parsed1 = parseDTO(Foo, { value: input });
  expect(parsed1).toBeInstanceOf(Foo);
  expect(parsed1).toEqual({ value: parseResult });

  const parsed2 = parseDTO(Foo, parseDTO(Foo, { value: input }));
  expect(parsed2).toBeInstanceOf(Foo);
  expect(parsed2).toEqual({ value: parseResult });

  const serialized1 = serializeDTO(Foo, { value: input });
  expect(serialized1).not.toBeInstanceOf(Foo);
  expect(serialized1).toEqual({ value: serializeResult });

  const serialized2 = serializeDTO(Foo, parseDTO(Foo, { value: input }));
  expect(serialized2).not.toBeInstanceOf(Foo);
  expect(serialized2).toEqual({ value: serializeResult });
});
