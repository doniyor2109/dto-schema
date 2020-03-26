export interface DTOSchemaOptions<TValue> {
  type: string;
  nullable?: boolean;

  testType: (value: unknown) => boolean;
  normalize: (value: unknown) => TValue;
  serialize?: (value: TValue) => unknown;
}

export class DTOSchema<TValue = unknown> {
  protected options: DTOSchemaOptions<TValue>;

  constructor({ nullable = false, ...options }: DTOSchemaOptions<TValue>) {
    this.options = { ...options, nullable };
  }

  parse(raw: TValue | unknown): TValue {
    const { type, normalize, nullable, testType } = this.options;

    if (raw == null) {
      raw = null;
    }

    if (nullable && raw == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    }

    const value = normalize(raw);

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

    if (serialize) {
      return serialize(value);
    }

    return value;
  }
}
