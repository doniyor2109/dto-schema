import { assertDTOConstructor, assertDTORawValue } from './internal/assert';
import {
  DTOConstructor,
  DTOPropMeta,
  getDTOMeta,
} from './internal/DTOMetadata';
import { getProp, setProp } from './internal/utils';

function traverseDTO<
  TValue extends object,
  TResult extends object | TValue = object
>(
  Cls: DTOConstructor<TValue>,
  raw: object | TValue,
  createObject: () => TResult,
  mapProp: (meta: DTOPropMeta, value: unknown) => unknown,
): TResult {
  assertDTOConstructor(Cls);
  assertDTORawValue(Cls, raw);

  const meta = getDTOMeta(Cls);
  const instance = createObject();

  meta.forEach((propMeta, key) => {
    setProp(instance, key, mapProp(propMeta, getProp(raw, key)));
  });

  return instance;
}

export function parseDTO<T extends object>(
  Cls: DTOConstructor<T>,
  raw: object | T,
): T {
  return traverseDTO(
    Cls,
    raw,
    () => new Cls(),
    ({ schema, arraySchema }, value) =>
      arraySchema
        ? arraySchema.parse(value)
        : schema
        ? schema.parse(value)
        : value,
  );
}

export function serializeDTO<T extends object>(
  Cls: DTOConstructor<T>,
  raw: object | T,
): object {
  return traverseDTO(
    Cls,
    raw,
    () => ({}),
    ({ schema, arraySchema }, value) =>
      arraySchema
        ? arraySchema.serialize(value)
        : schema
        ? schema.serialize(value)
        : value,
  );
}
