import { parseDTO, serializeDTO } from '../../traversers';
import { UnknownProp } from '../UnknownProp';

test.each<[unknown, unknown]>([
  [true, true],
  [false, false],
  [1, 1],
  ['1', '1'],

  [0, 0],
  ['', ''],
  [NaN, NaN],
  [null, null],
  [undefined, null],
])('UnknownProp() %p => %p', (input, result) => {
  class Foo {
    @UnknownProp() value: string;
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
