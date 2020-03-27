import { DTOConstructor } from '../internal/DTOMetadata';
import { isObject } from '../internal/utils';
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
  return Prop<object | null>({
    nullable,
    type: 'object',
    testType(value) {
      return value instanceof constructorFactory();
    },
    serialize(value) {
      return serializeDTO(constructorFactory(), value || {});
    },
    normalize(value) {
      return parseDTO(constructorFactory(), isObject(value) ? value : {});
    },
  });
}
