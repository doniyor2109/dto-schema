import { getPropMeta, registerPropMeta } from '../internal/DTOMetadata';
import { DTOSchema } from '../internal/DTOSchema';

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

          return value.map(x => schema.serialize(x));
        },

        normalize(raw: unknown) {
          const { schema } = getPropMeta(target, propertyKey as string);

          if (raw == null) {
            raw = [];
          }

          if (!Array.isArray(raw)) {
            raw = [raw];
          }

          if (!schema) {
            return raw as unknown[];
          }

          return (raw as unknown[]).map(x => schema.parse(x));
        },
      }),
    });
  };
}
