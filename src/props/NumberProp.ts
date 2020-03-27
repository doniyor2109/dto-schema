import { isBoolean, isNumber, toNumber } from '../internal/utils';
import { Prop } from './Prop';

export interface NumberPropOptions {
  clampMin?: number;
  clampMax?: number;
  defaultValue?: null | number;
  round?: boolean | 'ceil' | 'floor' | 'trunc';
}

export function NumberProp({
  round,
  clampMax,
  clampMin,
  defaultValue,
}: NumberPropOptions = {}): PropertyDecorator {
  if (
    round !== undefined &&
    !isBoolean(round) &&
    round !== 'ceil' &&
    round !== 'floor' &&
    round !== 'trunc'
  ) {
    throw new TypeError(`Unexpected 'round' property ${round}`);
  }

  return Prop<number>({
    type: 'number',
    nullable: defaultValue === null,
    testType(raw) {
      return isNumber(raw);
    },
    normalize(raw) {
      let value = toNumber(raw);

      if (!Number.isFinite(value) && defaultValue != null) {
        value = defaultValue;
      }

      if (Number.isFinite(value)) {
        switch (round) {
          case true:
            value = Math.round(value);
            break;
          case 'ceil':
            value = Math.ceil(value);
            break;
          case 'floor':
            value = Math.floor(value);
            break;
          case 'trunc':
            value = Math.trunc(value);
            break;
        }

        if (clampMin != null && Number.isFinite(clampMin)) {
          value = Math.max(value, clampMin);
        }

        if (clampMax != null && Number.isFinite(clampMax)) {
          value = Math.min(value, clampMax);
        }
      }

      return value;
    },
  });
}
