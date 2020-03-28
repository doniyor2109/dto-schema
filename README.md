## DTO Schema

![Node CI](https://github.com/umidbekkarimov/dto-schema/workflows/Node%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/umidbekkarimov/dto-schema/branch/master/graph/badge.svg)](https://codecov.io/gh/umidbekkarimov/dto-schema)
[![npm version](https://img.shields.io/npm/v/dto-schema.svg)](https://npmjs.com/dto-schema)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/dto-schema.svg)](https://bundlephobia.com/result?p=dto-schema)
[![npm type definitions](https://img.shields.io/npm/types/dto-schema.svg)](https://npmjs.com/dto-schema)
[![npm downloads](https://img.shields.io/npm/dm/dto-schema.svg)](https://npmjs.com/dto-schema)
[![npm license](https://img.shields.io/npm/l/dto-schema.svg)](https://npmjs.com/dto-schema)

### Installation

```bash
# NPM
npm i dto-schema
# Yarn
yarn add dto-schema
```

#### Babel

Setup [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) with `legacy` mode.

```json
{
  "plugins": [["@babel/plugin-proposal-decorators", { "legacy": true }]]
}
```

#### TypeScript

Enable `experimentalDecorators` property in `tsconfig.json`

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

#### Browser

Current build targets modern browsers that supports ESModules (see the [browserlist](https://github.com/babel/babel/blob/master/packages/babel-compat-data/data/native-modules.json)), so you will need to polyfill required **ES2015** features like `Map` and `WeakMap` and transpile unsupported syntax like **classes** or **arrow functions**.

### API

#### `parseDTO`

```typescript
function parseDTO<T extends object>(Cls: DTOConstructor, raw: T | object): T;
```

Transforms provided `raw` value with rules defined in the provided `Cls` constructor.

```typescript
import { parseDTO, StringProp } from 'dto-schema';

class UserDTO {
  @StringProp() guid: string;
  @StringProp() name: string;
  password: string; // this one is not annotated, so it would not be transformed.
}

expect(parseDTO(UserDTO, {})).toEqual({ guid: '', name: '' });

expect(
  parseDTO(UserDTO, { guid: 1, name: 'Leeroy Jenkins', password: 'yolo' }),
).toEqual({ guid: '1', name: 'Leeroy Jenkins' });

const user = new UserDTO();
user.name = 'John';
expect(parseDTO(UserDTO, user)).toEqual({ guid: '', name: 'John' });
```

#### `serializeDTO`

```typescript
function serializeDTO<T extends object>(
  Cls: DTOConstructor,
  raw: T | object,
): object;
```

Unlike `parseDTO`, `serializedDTO` uses `DTOSchemaOptions#serialize` method which prepares a valid JSON object.

```typescript
import { serializedDTO, Prop } from 'dto-schema';

class UserFilter {
  @Prop({
    type: 'set',
    testType(value: unknown) {
      return value instanceof Set;
    },
    normalize(value: unknown) {
      if (value instanceof Set) {
        return value;
      }

      if (Array.isArray(value)) {
        return new Set(value);
      }

      return new Set();
    },
    serialize(value: Set<string>) {
      return Array.from(value);
    },
  })
  roles: Set<string>;
}

const filter = new UserFilter();
filter.roles = new Set(['admin', 'editor']);

expect(serializedDTO(UserFilter, filter)).toEqual({
  roles: ['admin', 'editor'],
});

expect(
  serializedDTO(UserFilter, { roles: new Set(['admin', 'editor']) }),
).toEqual({ roles: ['admin', 'editor'] });

expect(
  serializedDTO(UserFilter, { roles: ['admin', 'editor', 'admin'] }),
).toEqual({
  // It will `parse` to the `Set` first, so duplicated `admin` role will be removed.
  roles: ['admin', 'editor'],
});
```

#### `BooleanProp`

```typescript
interface BooleanPropOptions {
  /**
   * Value to use when value is `null` or `undefined`.
   */
  defaultValue?: null | boolean;
}

function BooleanProp(options?: BooleanPropOptions): PropertyDecorator;
```

Annotates property as a `boolean`, accepts `BooleanPropOptions`.

```typescript
import { parseDTO, BooleanProp } from 'dto-schema';

class UserDTO {
  @BooleanProp() isVerified: boolean;
  @BooleanProp({ defaultValue: true }) isActive: boolean;
  @BooleanProp({ defaultValue: null }) isSubscribed: boolean;
}

expect(parseDTO(UserDTO, {})).toEqual({
  isVerified: false,
  isActive: true,
  isSubscribed: null,
});

expect(
  parseDTO(UserDTO, {
    isVerified: true,
    isActive: false,
    isSubscribed: false,
  }),
).toEqual({
  isVerified: true,
  isActive: false,
  isSubscribed: false,
});
```

#### `NumberProp`

```typescript
interface NumberPropOptions {
  /**
   * Value to use when value is `null` or `undefined`.
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
   * Round method to use to adjust a value.
   */
  round?: boolean | 'ceil' | 'floor' | 'trunc';
}

function NumberProp(options?: NumberPropOptions): PropertyDecorator;
```

Annotates property as a `number`, accepts `NumberPropOptions`.

```typescript
import { parseDTO, NumberProp } from 'dto-schema';

class ProductFilter {
  @NumberProp()
  id: number;

  @NumberProp({ defaultValue: 1, round: true, clampMin: 1 })
  page: number;

  @NumberProp({ defaultValue: null, round: true, clampMin: 1, clampMax: 50 })
  pageSize: number;
}

expect(parseDTO(ProductFilter, {})).toEqual({
  id: NaN,
  page: 1,
  pageSize: null,
});

expect(
  parseDTO(ProductFilter, {
    id: 42,
    page: 0,
    pageSize: 100,
  }),
).toEqual({
  id: 42,
  page: 1,
  pageSize: 50,
});

expect(
  parseDTO(ProductFilter, {
    id: 42,
    page: 3.33333,
    pageSize: 3.3333,
  }),
).toEqual({
  id: 42,
  page: 3,
  pageSize: 3,
});
```

#### `NumberProp`

```typescript
interface NumberPropOptions {
  /**
   * Value to use when value is `null` or `undefined`.
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
   * Round method to use to adjust a value.
   */
  round?: boolean | 'ceil' | 'floor' | 'trunc';
}

function NumberProp(options?: NumberPropOptions): PropertyDecorator;
```

Annotates property as a `number`, accepts `NumberPropOptions`.

```typescript
import { parseDTO, NumberProp } from 'dto-schema';

class ProductFilter {
  @NumberProp()
  id: number;

  @NumberProp({ defaultValue: 1, round: true, clampMin: 1 })
  page: number;

  @NumberProp({ defaultValue: null, round: true, clampMin: 1, clampMax: 50 })
  pageSize: number;
}

expect(parseDTO(ProductFilter, {})).toEqual({
  id: NaN,
  page: 1,
  pageSize: null,
});

expect(
  parseDTO(ProductFilter, {
    id: 42,
    page: 0,
    pageSize: 100,
  }),
).toEqual({
  id: 42,
  page: 1,
  pageSize: 50,
});

expect(
  parseDTO(ProductFilter, {
    id: 42,
    page: 3.33333,
    pageSize: 3.3333,
  }),
).toEqual({
  id: 42,
  page: 3,
  pageSize: 3,
});
```
