export function getObjectTag(value: object): string {
  return Object.prototype.toString.call(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNumberLike(value: unknown): value is number | Number {
  return isNumber(value) || value instanceof Number;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isStringLike(value: unknown): value is string | String {
  return isString(value) || value instanceof String;
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value != null;
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isSymbol(value: unknown): value is symbol {
  return (
    typeof value === 'symbol' ||
    (isObject(value) && getObjectTag(value) === '[object Symbol]')
  );
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function toNumber(value: unknown): number {
  if (value == null || isSymbol(value)) {
    return NaN;
  }

  if (isNumber(value)) {
    return value;
  }

  if (isDate(value)) {
    return value.valueOf();
  }

  if (isObject(value) && !Array.isArray(value)) {
    value = toString(value);
  }

  if (isStringLike(value)) {
    return parseFloat(value.toString());
  }

  return Number(value);
}

export function toString(value: unknown): string {
  if (value == null) {
    return '';
  }

  if (isString(value)) {
    return value;
  }

  if (isDate(value)) {
    return Number.isNaN(value.valueOf())
      ? value.toString()
      : value.toISOString();
  }

  if (Array.isArray(value)) {
    return String(value.map(x => toString(x)));
  }

  if (isNumberLike(value)) {
    return Object.is(value.valueOf(), -0) ? '-0' : value.toString();
  }

  if (isObject(value) && !isFunction(value.toString)) {
    return getObjectTag(value);
  }

  return String(value);
}
