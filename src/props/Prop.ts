import { registerPropMeta } from '../internal/DTOMetadata';
import { DTOSchema, DTOSchemaOptions } from '../internal/DTOSchema';

export function Prop(options: DTOSchemaOptions): PropertyDecorator {
  return (target, propertyKey) => {
    registerPropMeta(target, propertyKey, { schema: new DTOSchema(options) });
  };
}
