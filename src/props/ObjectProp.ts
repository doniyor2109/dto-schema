import { DTOConstructor } from '../internal/DTOMetadata';
import { parseDTO } from '../parseDTO';
import { serializeDTO } from '../serializeDTO';
import { Prop } from './Prop';

export interface ObjectPropOptions {
  nullable?: boolean;
}

export function ObjectProp(
  constructorFactory: () => DTOConstructor,
  { nullable }: ObjectPropOptions = {},
): PropertyDecorator {
  return Prop({
    nullable,
    type: 'object',
    testType(value) {
      return value instanceof constructorFactory();
    },
    serialize(value) {
      return serializeDTO(constructorFactory(), (value || {}) as object);
    },
    normalize(value) {
      return parseDTO(constructorFactory(), (value || {}) as object);
    },
  });
}
