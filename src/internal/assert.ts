import { DTOConstructor } from './DTOMetadata';

export function assertDTOConstructor<TValue extends object>(
  Cls: unknown | DTOConstructor<TValue>,
): asserts Cls is DTOConstructor<TValue> {
  if (typeof Cls !== 'function') {
    throw new TypeError(`Unexpected DTO class type: '${typeof Cls}'`);
  }
}

export function assertDTORawValue<TValue extends object>(
  Cls: DTOConstructor<TValue>,
  raw: object | TValue,
): asserts raw is object | TValue {
  if (raw == null || typeof raw !== 'object') {
    throw new TypeError(
      `Unexpected '${Cls.name}' type: '${
        typeof raw !== 'object' ? typeof raw : 'null'
      }'`,
    );
  }
}
