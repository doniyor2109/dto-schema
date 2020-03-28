import { isDate, isFunction, isStringLike, toNumber } from '../internal/utils';
import { Prop } from './Prop';

export interface DatePropOptions {
  defaultValue?: () => null | number | string | Date;
}

export function DateProp({
  defaultValue,
}: DatePropOptions = {}): PropertyDecorator {
  return Prop<Date>({
    type: 'boolean',
    testType(raw) {
      return isDate(raw);
    },
    normalize(raw) {
      if (raw == null && isFunction(defaultValue)) {
        const value = defaultValue();

        if (value == null) {
          return null;
        }

        return new Date(value);
      }

      if (isDate(raw)) {
        return raw;
      }

      if (isStringLike(raw)) {
        return new Date(raw.toString());
      }

      return new Date(toNumber(raw));
    },
    serialize(raw) {
      return raw == null ? null : raw.toJSON();
    },
  });
}
