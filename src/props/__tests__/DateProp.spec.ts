import { parseDTO } from '../../parseDTO';
import { serializeDTO } from '../../serializeDTO';
import { DateProp, DatePropOptions } from '../DateProp';

test.each<[DatePropOptions, unknown, null | Date, null | string]>([
  [{}, '', new Date(NaN), null],
  [{}, null, new Date(NaN), null],
  [{}, undefined, new Date(NaN), null],
  [{}, NaN, new Date(NaN), null],
  [{}, new Date(NaN), new Date(NaN), null],
  [{}, true, new Date(1), '1970-01-01T00:00:00.001Z'],
  [{}, false, new Date(0), '1970-01-01T00:00:00.000Z'],
  [{}, 0, new Date(0), '1970-01-01T00:00:00.000Z'],
  [{}, new Date(0), new Date(0), '1970-01-01T00:00:00.000Z'],
  [{}, '1970-01-01T00:00:00.000Z', new Date(0), '1970-01-01T00:00:00.000Z'],

  [{ defaultValue: null }, '', new Date(NaN), null],
  [{ defaultValue: null }, NaN, new Date(NaN), null],
  [{ defaultValue: null }, null, null, null],
  [{ defaultValue: null }, undefined, null, null],

  [{ defaultValue: () => 0 }, null, new Date(0), '1970-01-01T00:00:00.000Z'],
  [
    { defaultValue: () => '1970-01-01T00:00:00.000Z' },
    null,
    new Date(0),
    '1970-01-01T00:00:00.000Z',
  ],
  [
    { defaultValue: () => new Date(0) },
    null,
    new Date(0),
    '1970-01-01T00:00:00.000Z',
  ],
  [
    { defaultValue: () => new Date(0) },
    null,
    new Date(0),
    '1970-01-01T00:00:00.000Z',
  ],
])(
  'DateProp(%p, { value: %p }) => %p | %p',
  (options, input, expectedParsed, expectedSerialized) => {
    class Foo {
      @DateProp(options) value: null | Date;
    }

    const parsed: any = parseDTO(Foo, { value: input });
    expect(parsed).toBeInstanceOf(Foo);
    expect(parsed.value?.valueOf()).toBe(expectedParsed?.valueOf());

    const serialized = serializeDTO(Foo, { value: input });
    expect(serialized).not.toBeInstanceOf(Foo);
    expect(serialized).toEqual({ value: expectedSerialized });

    const serializedFromParsed = serializeDTO(
      Foo,
      parseDTO(Foo, { value: input }),
    );
    expect(serializedFromParsed).not.toBeInstanceOf(Foo);
    expect(serializedFromParsed).toEqual({ value: expectedSerialized });
  },
);
