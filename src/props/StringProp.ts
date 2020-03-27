import { isString, toString } from '../internal/utils';
import { Prop } from './Prop';

export interface StringPropOptions {
  nullable?: boolean;
  trim?: boolean | 'left' | 'right';
}

export function StringProp({
  trim,
  nullable,
}: StringPropOptions = {}): PropertyDecorator {
  return Prop<string>({
    type: 'string',
    nullable,
    testType(raw) {
      return isString(raw);
    },
    normalize(raw) {
      let value = toString(raw);

      switch (trim) {
        case true:
          value = value.trim();
          break;
        case 'left':
          value = value.trimLeft();
          break;
        case 'right':
          value = value.trimRight();
          break;
      }

      return value;
    },
  });
}
