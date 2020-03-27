import { registerPropMeta } from '../internal/DTOMetadata';
import { DTOSchema, DTOSchemaOptions } from '../internal/DTOSchema';

export function Prop<T>(options: DTOSchemaOptions<T>): PropertyDecorator {
  return (target, propertyKey) => {
    registerPropMeta(target, propertyKey, {
      schema: new DTOSchema(options as DTOSchemaOptions),
    });
  };
}
