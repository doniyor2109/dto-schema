import { DTOSchema } from './DTOSchema';

export type DTOConstructor<T extends object = object> = new () => T;

const metadata: WeakMap<
  DTOConstructor,
  Map<string | number | symbol, DTOSchema>
> = new WeakMap();

export function getDTOMeta<T extends object = object>(
  target: DTOConstructor<T>,
): Map<keyof T, DTOSchema> {
  let meta = metadata.get(target) as Map<keyof T, DTOSchema>;

  if (!meta) {
    meta = new Map<keyof T, DTOSchema>();
    metadata.set(target, meta);
  }

  return meta;
}

export function registerProp<T>(
  target: object,
  propertyKey: string | symbol,
  schema: DTOSchema<T>,
) {
  if (typeof propertyKey !== 'string') {
    throw new TypeError(
      `Unsupported property key of type ${typeof propertyKey}, expected "string"`,
    );
  }

  const meta = getDTOMeta(target.constructor as DTOConstructor);

  if (meta.has(propertyKey as never)) {
    throw new Error(
      `Property '${propertyKey}' for class ${target.constructor.name} was already registered.`,
    );
  }

  meta.set(propertyKey as never, schema as DTOSchema);
}
