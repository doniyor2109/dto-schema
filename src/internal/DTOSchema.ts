export interface DTOSchemaOptions<TValue = unknown> {
  type: string;
  testType: (value: unknown) => boolean;
  normalize: (value: unknown) => null | TValue;
  serialize?: (value: TValue) => unknown;
}

export class DTOSchema<TValue = unknown> {
  protected options: DTOSchemaOptions<TValue>;

  constructor(options: DTOSchemaOptions<TValue>) {
    this.options = options;
  }

  parse(raw: TValue | unknown): null | TValue {
    const { type, normalize, testType } = this.options;

    if (raw == null) {
      raw = null;
    }

    const value = normalize(raw);

    if (value == null) {
      return null;
    }

    if (!testType(value)) {
      throw new TypeError(
        [
          `Unexpected type '${typeof raw}', expected '${type}'.`,
          `Input: ${raw}`,
          `Output: ${value}`,
        ].join('\n'),
      );
    }

    return value;
  }

  serialize(raw: TValue | unknown): unknown {
    const { serialize } = this.options;

    const value = this.parse(raw);

    if (value != null && serialize) {
      return serialize(value);
    }

    return value;
  }
}
