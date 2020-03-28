import { isBoolean, isNumber, toNumber } from '../internal/utils';
import { Prop } from './Prop';

export interface NumberPropOptions {
  /**
   * Default value to use when input value is `null` or `undefined`.
   */
  defaultValue?: null | number;

  /**
   * Lower bound of the number to clamp.
   */
  clampMin?: number;

  /**
   * Upper bound of the number to clamp.
   */
  clampMax?: number;

  /**
   * Round method to use to adjust input value.
   */
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
    testType(raw) {
      return isNumber(raw);
    },
    normalize(raw) {
      if (raw == null && defaultValue !== undefined) {
        return defaultValue;
      }

      let value = toNumber(raw);

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
