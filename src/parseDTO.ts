import { assertDTOConstructor, assertDTORawValue } from './internal/assert';
import { DTOConstructor, getDTOMeta } from './internal/DTOMetadata';

export function parseDTO<TValue extends object>(
  Cls: DTOConstructor<TValue>,
  raw: object | TValue,
): TValue {
  assertDTOConstructor(Cls);
  assertDTORawValue(Cls, raw);

  const schemes = getDTOMeta(Cls);
  const instance = new Cls();

  if (schemes.size === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Unable to parse '${Cls.name}' without any registered props.`);
  } else {
    schemes.forEach(({ schema, arraySchema }, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value = (raw as any)[key];

      if (arraySchema) {
        value = arraySchema.parse(value);
      } else if (schema) {
        value = schema.parse(value);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any)[key] = value;
    });
  }

  return instance;
}
