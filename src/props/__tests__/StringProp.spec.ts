import { parseDTO, serializeDTO } from '../../traversers';
import { StringProp, StringPropOptions } from '../StringProp';

test.each<[undefined | StringPropOptions, unknown, string | null]>([
  [undefined, 1, '1'],
  [undefined, 'text', 'text'],
  [undefined, 'true', 'true'],
  [undefined, 'false', 'false'],

  [undefined, '', ''],
  [undefined, null, ''],
  [undefined, undefined, ''],
  [{ defaultValue: null }, '', ''],
  [{ defaultValue: null }, null, null],
  [{ defaultValue: null }, undefined, null],

  [{ defaultValue: 'text' }, '', ''],
  [{ defaultValue: 'text' }, null, 'text'],
  [{ defaultValue: 'text' }, undefined, 'text'],

  [undefined, ' text ', ' text '],
  [{ trim: true }, '', ''],
  [{ trim: true }, null, ''],
  [{ trim: true }, undefined, ''],
  [{ trim: true }, ' text ', 'text'],
  [{ trim: 'start' }, ' text ', 'text '],
  [{ trim: 'end' }, ' text ', ' text'],
])('StringProp(%p, { value: %p }) => %p', (options, input, result) => {
  class Foo {
    @StringProp(options) value: string;
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
