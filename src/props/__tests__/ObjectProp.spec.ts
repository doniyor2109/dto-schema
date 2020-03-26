import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { ObjectProp } from '../ObjectProp';
import { StringProp } from '../StringProp';

test('foo', () => {
  class Child {
    @StringProp() foo: string;
  }

  class Parent {
    @ObjectProp(Child) child: Child;
  }

  const parsed = parseDTO(Parent, { child: { foo: 'hello' } });
  expect(parsed).toBeInstanceOf(Parent);
  expect(parsed.child).toBeInstanceOf(Child);
  expect(parsed).toEqual({ child: { foo: 'hello' } });

  const parsed2 = parseDTO(Parent, parsed);
  expect(parsed2).toBeInstanceOf(Parent);
  expect(parsed2.child).toBeInstanceOf(Child);
  expect(parsed2).toEqual({ child: { foo: 'hello' } });

  const serialized: any = serializeDTO(Parent, parsed);
  expect(serialized).not.toBeInstanceOf(Parent);
  expect(serialized.child).not.toBeInstanceOf(Child);
  expect(serialized).toEqual({ child: { foo: 'hello' } });

  const serialized2: any = serializeDTO(Parent, serialized);
  expect(serialized2).not.toBeInstanceOf(Parent);
  expect(serialized2.child).not.toBeInstanceOf(Child);
  expect(serialized2).toEqual({ child: { foo: 'hello' } });
});
