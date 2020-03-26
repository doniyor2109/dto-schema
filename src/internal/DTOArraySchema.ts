import { DTOCollectionType } from './DTOMetadata';
import { DTOSchema } from './DTOSchema';

export interface DTOCollectionSchemaOptions<
  TEntry = unknown,
  TCollection extends Iterable<TEntry> | ArrayLike<TEntry> = TEntry[]
> {
  nullable?: boolean;
  type?: 'array' | 'set' | DTOCollectionType<TEntry, TCollection>;
}

export class DTOArraySchema<
  TEntry = unknown,
  TCollection extends Iterable<TEntry> | ArrayLike<TEntry> = TEntry[]
> {
  protected options: Required<DTOCollectionSchemaOptions<TEntry, TCollection>>;

  constructor({
    type = 'array',
    nullable = false,
  }: DTOCollectionSchemaOptions<TEntry, TCollection> = {}) {
    this.options = { type, nullable };
  }

  protected transform(
    raw: Iterable<TEntry> | ArrayLike<TEntry>,
    fn: (value: unknown) => unknown,
  ): null | TCollection {
    const { type, nullable } = this.options;

    if (type == null && nullable) {
      return null;
    }

    const array = Array.from(raw, x => fn(x));

    return (type === 'array'
      ? array
      : type === 'set'
      ? new Set(array)
      : type(array)) as TCollection;
  }

  parse(
    raw: Iterable<TEntry> | ArrayLike<TEntry>,
    schema: DTOSchema<TEntry>,
  ): TCollection | null {
    return this.transform(raw, x => schema.parse(x));
  }

  serialize(
    raw: Iterable<TEntry> | ArrayLike<TEntry>,
    schema: DTOSchema<TEntry>,
  ) {
    return this.transform(raw, x => schema.serialize(x));
  }
}
