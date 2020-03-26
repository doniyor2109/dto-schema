import { registerProp } from '../internal/DTOMetadata';
import { DTOSchema, DTOSchemaOptions } from '../internal/DTOSchema';

export function Prop<T>(options: DTOSchemaOptions<T>): PropertyDecorator {
  return (target, propertyKey) => {
    registerProp(target, propertyKey as keyof object, new DTOSchema(options));
  };
}
