import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { ObjectProp } from '../ObjectProp';
import { StringProp } from '../StringProp';

test('parse and serialize combinations', () => {
  class Child {
    @StringProp() foo: string;
  }

  class Parent {
    @ObjectProp(() => Child) child: Child;
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

test('recursive types', () => {
  class Item {
    @ObjectProp(() => Item, { nullable: true }) child: null | Item;
  }

  const parsed = parseDTO(Item, { child: { child: { child: {} } } });
  expect(parsed).toBeInstanceOf(Item);
  expect(parsed.child).toBeInstanceOf(Item);
  expect(parsed.child?.child).toBeInstanceOf(Item);
  expect(parsed.child?.child?.child).toBeInstanceOf(Item);
  expect(parsed).toEqual({
    child: { child: { child: { child: null } } },
  });

  const parsed2 = parseDTO(Item, parsed);
  expect(parsed2).toBeInstanceOf(Item);
  expect(parsed2.child).toBeInstanceOf(Item);
  expect(parsed2.child?.child).toBeInstanceOf(Item);
  expect(parsed2.child?.child?.child).toBeInstanceOf(Item);
  expect(parsed2).toEqual({
    child: { child: { child: { child: null } } },
  });

  const serialized: any = serializeDTO(Item, {
    child: { child: { child: {} } },
  });
  expect(serialized).not.toBeInstanceOf(Item);
  expect(serialized.child).not.toBeInstanceOf(Item);
  expect(serialized.child.child).not.toBeInstanceOf(Item);
  expect(serialized.child.child.child).not.toBeInstanceOf(Item);
  expect(serialized).toEqual({
    child: { child: { child: { child: null } } },
  });

  const serialized2: any = serializeDTO(Item, serialized);
  expect(serialized2).not.toBeInstanceOf(Item);
  expect(serialized2.child).not.toBeInstanceOf(Item);
  expect(serialized2.child.child).not.toBeInstanceOf(Item);
  expect(serialized2.child.child.child).not.toBeInstanceOf(Item);
  expect(serialized2).toEqual({
    child: { child: { child: { child: null } } },
  });
});
