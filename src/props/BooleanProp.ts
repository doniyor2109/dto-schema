import { isBoolean } from '../internal/utils';
import { Prop } from './Prop';

export interface BooleanPropOptions {
  defaultValue?: null | boolean;
}

export function BooleanProp({
  defaultValue,
}: BooleanPropOptions = {}): PropertyDecorator {
  return Prop({
    type: 'boolean',
    nullable: defaultValue === null,
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
