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

  meta.forEach((schema, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (plain as any)[key] = schema.serialize((raw as any)[key]);
  });

  return plain;
}
