import { getPropMeta, registerPropMeta } from '../internal/DTOMetadata';
import { DTOSchema } from '../internal/DTOSchema';
import { castArray } from '../internal/utils';

export interface ArrayPropOptions<T = unknown> {
  defaultValue?: () => null | T[];
}

export function ArrayProp<T>({
  defaultValue,
}: ArrayPropOptions<T> = {}): PropertyDecorator {
  return (target, propertyKey) => {
    registerPropMeta(target, propertyKey, {
      arraySchema: new DTOSchema<unknown[]>({
        type: 'array',
        testType(raw: unknown) {
          return Array.isArray(raw);
        },

        normalize(raw: unknown) {
          const { schema } = getPropMeta(target, propertyKey as string);

          if (raw == null && defaultValue) {
            raw = defaultValue();

            if (raw == null) {
              return null;
            }
          }

          const value = raw == null ? [] : castArray(raw);

          return !schema ? value : value.map((x) => schema.parse(x));
        },

        serialize(value) {
          const { schema } = getPropMeta(target, propertyKey as string);

          if (!schema?.serialize) {
            return value;
          }

          return value.map((x) => schema.serialize(x));
        },
      }),
    });
  };
}
