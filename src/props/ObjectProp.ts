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
    type: 'object',
    testType(value) {
      return value instanceof constructorFactory();
    },
    normalize(value) {
      if (nullable && value == null) {
        return null;
      }

      return parseDTO(
        constructorFactory(),
        value == null ? {} : (value as object),
      );
    },
    serialize(value) {
      return serializeDTO(constructorFactory(), value);
    },
  });
}
