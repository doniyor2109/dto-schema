import { getObjectTag, isObject, isString } from '../internal/utils';
import { Prop } from './Prop';

export interface StringPropOptions {
  nullable?: boolean;
  trim?: boolean | 'left' | 'right';
}

export function StringProp({
  nullable,
  trim = false,
}: StringPropOptions = {}): PropertyDecorator {
  return Prop({
    type: 'string',
    nullable,
    testType(raw) {
      return isString(raw);
    },
    normalize(value) {
      if (value == null) {
        value = '';
      }

      if (isObject(value)) {
        const tag = Object.prototype.toString.call(value);

        if (tag === '[object Object]') {
          return getObjectTag(value);
        }
      }

      if (!isString(value)) {
        value = String(value);
      }

      if (trim) {
        value =
          trim === 'left'
            ? (value as string).trimLeft()
            : trim === 'right'
            ? (value as string).trimRight()
            : (value as string).trim();
      }

      return value;
    },
  });
}
