import { DTOConstructor } from '../internal/DTOMetadata';
import { parseDTO } from '../parseDTO';
import { serializeDTO } from '../serializeDTO';
import { Prop } from './Prop';

export interface ObjectPropOptions {
  nullable?: boolean;
}

export function ObjectProp(
  Cls: DTOConstructor,
  { nullable = false }: ObjectPropOptions = {},
): PropertyDecorator {
  return Prop({
    nullable,
    type: Cls.name,
    testType(value) {
      return value instanceof Cls;
    },
    serialize(value) {
      return serializeDTO(Cls, value as object);
    },
    normalize(value) {
      return parseDTO(Cls, value as object);
    },
  });
}
