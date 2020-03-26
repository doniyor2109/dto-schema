import { assertDTOConstructor, assertDTORawValue } from './internal/assert';
import { DTOConstructor, getDTOMeta } from './internal/DTOMetadata';

export function serializeDTO<TValue extends object>(
  Cls: DTOConstructor<TValue>,
  raw: object | TValue,
): object {
  assertDTOConstructor(Cls);
  assertDTORawValue(Cls, raw);

  const meta = getDTOMeta(Cls);

  const plain = {};

  meta.forEach(({ schema, arraySchema }, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value = (raw as any)[key];

    if (arraySchema) {
      value = arraySchema.serialize(value);
    } else if (schema) {
      value = schema.serialize(value);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (plain as any)[key] = value;
  });

  return plain;
}
