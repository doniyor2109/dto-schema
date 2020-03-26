import { assertDTOConstructor, assertDTORawValue } from './internal/assert';
import { DTOConstructor, getDTOMeta } from './internal/DTOMetadata';

export function parseDTO<TValue extends object>(
  Cls: DTOConstructor<TValue>,
  raw: object | TValue,
): TValue {
  assertDTOConstructor(Cls);
  assertDTORawValue(Cls, raw);

  const meta = getDTOMeta(Cls);
  const instance = new Cls();

  if (meta.size === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Unable to parse '${Cls.name}' without any registered props.`);
  } else {
    meta.forEach((schema, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any)[key] = schema.parse((raw as any)[key]);
    });
  }

  return instance;
}
