import { DTOConstructor } from '../internal/DTOMetadata';
import { parseDTO, serializeDTO } from '../traversers';
import { Prop } from './Prop';

export interface ObjectPropOptions {
  nullable?: boolean;
}

export function ObjectProp(
  constructorFactory: () => DTOConstructor,
  { nullable }: ObjectPropOptions = {},
): PropertyDecorator {
  return Prop<object>({
    nullable,
    type: 'object',
    testType(value) {
      return value instanceof constructorFactory();
    },
    serialize(value) {
      return serializeDTO(constructorFactory(), value);
    },
    normalize(value) {
      return parseDTO(constructorFactory(), value as object);
    },
  });
}
