import { isBoolean } from '../internal/utils';
import { Prop } from './Prop';

export interface BooleanPropOptions {
  nullable?: boolean;
  defaultValue?: boolean;
}

export function BooleanProp({
  nullable,
  defaultValue,
}: BooleanPropOptions = {}): PropertyDecorator {
  const shouldBeNullable = defaultValue != null ? false : nullable;

  return Prop({
    type: 'boolean',
    nullable: shouldBeNullable,
    testType(raw) {
      return isBoolean(raw);
    },
    normalize(raw) {
      if (raw == null && defaultValue != null) {
        return defaultValue;
      }

      return !!raw;
    },
  });
}
