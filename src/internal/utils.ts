export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value != null;
}

export function getObjectTag(value: object): string {
  return Object.prototype.toString.call(value);
}
