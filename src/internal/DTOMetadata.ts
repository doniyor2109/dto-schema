import { DTOSchema } from './DTOSchema';

export type DTOConstructor<T extends object = object> = new () => T;

export type DTOCollectionType<
  TEntry,
  TCollection extends Iterable<TEntry> | ArrayLike<TEntry> = TEntry[]
> = (array: TEntry[]) => TCollection;

export interface DTOPropMeta<TValue = unknown> {
  schema?: DTOSchema<TValue>;
  arraySchema?: DTOSchema<TValue[]>;
}

const metadata = new WeakMap<Function, Map<string, DTOPropMeta>>();

export function getDTOMeta(target: Function): Map<string, DTOPropMeta> {
  let meta = metadata.get(target);

  if (!meta) {
    meta = new Map();
    metadata.set(target, meta as Map<string, DTOPropMeta>);
  }

  return meta;
}

export function getPropMeta(target: object, propertyKey: string): DTOPropMeta {
  const meta = getDTOMeta(target.constructor);
  let propMeta = meta.get(propertyKey);

  if (!propMeta) {
    propMeta = {};
    meta.set(propertyKey, propMeta);
  }

  return propMeta;
}

export function registerPropMeta(
  target: object,
  propertyKey: string | symbol,
  nextPropMeta: DTOPropMeta,
) {
  if (typeof propertyKey !== 'string') {
    throw new TypeError(
      `Unsupported property key of type ${typeof propertyKey}, expected "string"`,
    );
  }

  const propMeta = getPropMeta(target, propertyKey);

  if (propMeta.schema && nextPropMeta.schema) {
    throw new Error(
      `Property '${propertyKey}' for class ${target.constructor.name} was already registered.`,
    );
  }

  if (propMeta.arraySchema && nextPropMeta.arraySchema) {
    throw new Error(
      `Property '${propertyKey}' for class ${target.constructor.name} was already registered as array.`,
    );
  }

  if (nextPropMeta.schema) {
    propMeta.schema = nextPropMeta.schema;
  }

  if (nextPropMeta.arraySchema) {
    propMeta.arraySchema = nextPropMeta.arraySchema;
  }
}
