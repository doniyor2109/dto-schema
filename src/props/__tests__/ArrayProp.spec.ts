import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { ArrayProp } from '../ArrayProp';
import { StringProp } from '../StringProp';

test('foo', () => {
  class Foo {
    @ArrayProp() @StringProp() values: null | string[];
  }

  const parsed = parseDTO(Foo, { values: [1, true, 'text'] });
  expect(parsed).toBeInstanceOf(Foo);
  expect(parsed).toEqual({ values: ['1', 'true', 'text'] });

  const parsed2 = parseDTO(Foo, parsed);
  expect(parsed2).toBeInstanceOf(Foo);
  expect(parsed2).toEqual({ values: ['1', 'true', 'text'] });

  const serialized: any = serializeDTO(Foo, parsed);
  expect(serialized).not.toBeInstanceOf(Foo);
  expect(serialized).toEqual({ values: ['1', 'true', 'text'] });

  const serialized2: any = serializeDTO(Foo, serialized);
  expect(serialized2).not.toBeInstanceOf(Foo);
  expect(serialized2).toEqual({ values: ['1', 'true', 'text'] });
});
