import { parseDTO, serializeDTO } from '../../traversers';
import { DateProp, DatePropOptions } from '../DateProp';

test.each<[undefined | DatePropOptions, unknown, null | Date, null | string]>([
  [undefined, '', new Date(NaN), null],
  [undefined, null, new Date(NaN), null],
  [undefined, undefined, new Date(NaN), null],
  [undefined, NaN, new Date(NaN), null],
  [undefined, new Date(NaN), new Date(NaN), null],
  [undefined, true, new Date(1), '1970-01-01T00:00:00.001Z'],
  [undefined, false, new Date(0), '1970-01-01T00:00:00.000Z'],
  [undefined, 0, new Date(0), '1970-01-01T00:00:00.000Z'],
  [undefined, new Date(0), new Date(0), '1970-01-01T00:00:00.000Z'],
  [
    undefined,
    '1970-01-01T00:00:00.000Z',
    new Date(0),
    '1970-01-01T00:00:00.000Z',
  ],

  [{ defaultValue: () => null }, '', new Date(NaN), null],
  [{ defaultValue: () => null }, NaN, new Date(NaN), null],
  [{ defaultValue: () => null }, null, null, null],
  [{ defaultValue: () => null }, undefined, null, null],

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
