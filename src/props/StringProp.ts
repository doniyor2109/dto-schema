import { isString, toString } from '../internal/utils';
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
    normalize(raw) {
      let value = toString(raw);

      if (trim) {
        value =
          trim === 'left'
            ? value.trimLeft()
            : trim === 'right'
            ? value.trimRight()
            : value.trim();
      }

      return value;
    },
  });
}
