import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { StringProp, StringPropOptions } from '../StringProp';

test.each<[StringPropOptions, unknown, string | null]>([
  [{}, '', ''],
  [{}, null, ''],
  [{}, undefined, ''],
  [{}, 0, '0'],
  [{}, -0, '0'],
  [{}, -1, '-1'],
  [{}, NaN, 'NaN'],
  [{}, true, 'true'],
  [{}, false, 'false'],
  [{}, [], ''],
  [{}, ['a', 'b', 'c'], 'a,b,c'],
  [{}, {}, '[object Object]'],
  [{}, new Number(1), '1'],
  [{}, new String('text'), 'text'],
  [{}, new Date(''), 'Invalid Date'],
  [{}, Object.create(null), '[object Object]'],

  [{ nullable: true }, '', ''],
  [{ nullable: true }, null, null],
  [{ nullable: true }, undefined, null],

  [{ trim: true }, '', ''],
  [{ trim: true }, null, ''],
  [{ trim: true }, undefined, ''],
  [{ trim: true }, ' text ', 'text'],
  [{ trim: 'left' }, ' text ', 'text '],
  [{ trim: 'right' }, ' text ', ' text'],
])('StringProp(%p, { value: %p }) => %p', (options, input, result) => {
  class Foo {
    @StringProp(options)
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
