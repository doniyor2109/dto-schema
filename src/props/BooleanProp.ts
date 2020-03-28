import { isBoolean } from '../internal/utils';
import { Prop } from './Prop';

export interface BooleanPropOptions {
  defaultValue?: null | boolean;
}

export function BooleanProp({
  defaultValue,
}: BooleanPropOptions = {}): PropertyDecorator {
  return Prop<boolean>({
    type: 'boolean',
    testType(raw) {
      return isBoolean(raw);
    },
    normalize(raw) {
      if (raw == null && defaultValue !== undefined) {
        return defaultValue;
      }

      return !!raw;
    },
  });
}
