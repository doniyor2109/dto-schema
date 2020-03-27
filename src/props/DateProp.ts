import { isDate, isStringLike, toNumber } from '../internal/utils';
import { Prop } from './Prop';

export interface DatePropOptions {
  defaultValue?: null | (() => number | string | Date);
}

export function DateProp({
  defaultValue,
}: DatePropOptions = {}): PropertyDecorator {
  return Prop<Date>({
    type: 'boolean',
    nullable: defaultValue === null,
    testType(raw) {
      return isDate(raw);
    },
    serialize(raw) {
      return raw.toJSON();
    },
    normalize(raw) {
      if (raw == null && defaultValue != null) {
        return new Date(defaultValue());
      }

      if (isDate(raw)) {
        return raw;
      }

      if (isStringLike(raw)) {
        return new Date(raw.toString());
      }

      return new Date(toNumber(raw));
    },
  });
}
