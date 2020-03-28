import { isString, toString } from '../internal/utils';
import { Prop } from './Prop';

export interface StringPropOptions {
  defaultValue?: null | string;
  trim?: boolean | 'start' | 'end';
}

export function StringProp({
  trim,
  defaultValue,
}: StringPropOptions = {}): PropertyDecorator {
  return Prop<string>({
    type: 'string',
    testType(raw) {
      return isString(raw);
    },
    normalize(raw) {
      if (raw == null && defaultValue !== undefined) {
        return defaultValue;
      }

      let value = toString(raw);

      switch (trim) {
        case true:
          value = value.trim();
          break;
        case 'start':
          value = value.trimStart();
          break;
        case 'end':
          value = value.trimEnd();
          break;
      }

      return value;
    },
  });
}
