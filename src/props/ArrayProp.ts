import { getPropMeta, registerPropMeta } from '../internal/DTOMetadata';
import { DTOSchema } from '../internal/DTOSchema';
import { castArray, isFunction } from '../internal/utils';

export interface ArrayPropOptions {
  defaultValue?: null | (() => unknown[]);
}

export function ArrayProp({
  defaultValue,
}: ArrayPropOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    registerPropMeta(target, propertyKey, {
      arraySchema: new DTOSchema<unknown[]>({
        type: 'array',
        nullable: defaultValue === null,

        testType(raw: unknown) {
          return Array.isArray(raw);
        },

        serialize(value) {
          const { schema } = getPropMeta(target, propertyKey as string);

          if (!schema?.serialize) {
            return value;
          }

          return value.map((x) => schema.serialize(x));
        },

        normalize(raw: unknown) {
          const { schema } = getPropMeta(target, propertyKey as string);

          if (raw == null && isFunction(defaultValue)) {
            raw = defaultValue();
          }

          const value = raw == null ? [] : castArray(raw);

          return !schema ? value : value.map((x) => schema.parse(x));
        },
      }),
    });
  };
}
