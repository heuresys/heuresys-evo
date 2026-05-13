/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Asset
 *
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>;
/**
 * Model Variant
 *
 */
export type Variant = $Result.DefaultSelection<Prisma.$VariantPayload>;
/**
 * Model Tag
 *
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>;
/**
 * Model AssetTag
 *
 */
export type AssetTag = $Result.DefaultSelection<Prisma.$AssetTagPayload>;
/**
 * Model PromotionLog
 *
 */
export type PromotionLog = $Result.DefaultSelection<Prisma.$PromotionLogPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Assets
 * const assets = await prisma.asset.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Assets
   * const assets = await prisma.asset.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void
  ): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>;

  /**
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Assets
   * const assets = await prisma.asset.findMany()
   * ```
   */
  get asset(): Prisma.AssetDelegate<ExtArgs>;

  /**
   * `prisma.variant`: Exposes CRUD operations for the **Variant** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Variants
   * const variants = await prisma.variant.findMany()
   * ```
   */
  get variant(): Prisma.VariantDelegate<ExtArgs>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Tags
   * const tags = await prisma.tag.findMany()
   * ```
   */
  get tag(): Prisma.TagDelegate<ExtArgs>;

  /**
   * `prisma.assetTag`: Exposes CRUD operations for the **AssetTag** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AssetTags
   * const assetTags = await prisma.assetTag.findMany()
   * ```
   */
  get assetTag(): Prisma.AssetTagDelegate<ExtArgs>;

  /**
   * `prisma.promotionLog`: Exposes CRUD operations for the **PromotionLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PromotionLogs
   * const promotionLogs = await prisma.promotionLog.findMany()
   * ```
   */
  get promotionLog(): Prisma.PromotionLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import NotFoundError = runtime.NotFoundError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? K : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Asset: 'Asset';
    Variant: 'Variant';
    Tag: 'Tag';
    AssetTag: 'AssetTag';
    PromotionLog: 'PromotionLog';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs; clientOptions: PrismaClientOptions },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    ClientOptions = {},
  > = {
    meta: {
      modelProps: 'asset' | 'variant' | 'tag' | 'assetTag' | 'promotionLog';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>;
        fields: Prisma.AssetFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[];
          };
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[];
          };
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAsset>;
          };
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AssetGroupByOutputType>[];
          };
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>;
            result: $Utils.Optional<AssetCountAggregateOutputType> | number;
          };
        };
      };
      Variant: {
        payload: Prisma.$VariantPayload<ExtArgs>;
        fields: Prisma.VariantFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VariantFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VariantFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>;
          };
          findFirst: {
            args: Prisma.VariantFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VariantFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>;
          };
          findMany: {
            args: Prisma.VariantFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>[];
          };
          create: {
            args: Prisma.VariantCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>;
          };
          createMany: {
            args: Prisma.VariantCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VariantCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>[];
          };
          delete: {
            args: Prisma.VariantDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>;
          };
          update: {
            args: Prisma.VariantUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>;
          };
          deleteMany: {
            args: Prisma.VariantDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VariantUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.VariantUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VariantPayload>;
          };
          aggregate: {
            args: Prisma.VariantAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVariant>;
          };
          groupBy: {
            args: Prisma.VariantGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VariantGroupByOutputType>[];
          };
          count: {
            args: Prisma.VariantCountArgs<ExtArgs>;
            result: $Utils.Optional<VariantCountAggregateOutputType> | number;
          };
        };
      };
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>;
        fields: Prisma.TagFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>;
          };
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>;
          };
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[];
          };
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>;
          };
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[];
          };
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>;
          };
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>;
          };
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TagPayload>;
          };
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTag>;
          };
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TagGroupByOutputType>[];
          };
          count: {
            args: Prisma.TagCountArgs<ExtArgs>;
            result: $Utils.Optional<TagCountAggregateOutputType> | number;
          };
        };
      };
      AssetTag: {
        payload: Prisma.$AssetTagPayload<ExtArgs>;
        fields: Prisma.AssetTagFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AssetTagFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AssetTagFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>;
          };
          findFirst: {
            args: Prisma.AssetTagFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AssetTagFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>;
          };
          findMany: {
            args: Prisma.AssetTagFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>[];
          };
          create: {
            args: Prisma.AssetTagCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>;
          };
          createMany: {
            args: Prisma.AssetTagCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AssetTagCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>[];
          };
          delete: {
            args: Prisma.AssetTagDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>;
          };
          update: {
            args: Prisma.AssetTagUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>;
          };
          deleteMany: {
            args: Prisma.AssetTagDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AssetTagUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.AssetTagUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetTagPayload>;
          };
          aggregate: {
            args: Prisma.AssetTagAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAssetTag>;
          };
          groupBy: {
            args: Prisma.AssetTagGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AssetTagGroupByOutputType>[];
          };
          count: {
            args: Prisma.AssetTagCountArgs<ExtArgs>;
            result: $Utils.Optional<AssetTagCountAggregateOutputType> | number;
          };
        };
      };
      PromotionLog: {
        payload: Prisma.$PromotionLogPayload<ExtArgs>;
        fields: Prisma.PromotionLogFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PromotionLogFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PromotionLogFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>;
          };
          findFirst: {
            args: Prisma.PromotionLogFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PromotionLogFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>;
          };
          findMany: {
            args: Prisma.PromotionLogFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>[];
          };
          create: {
            args: Prisma.PromotionLogCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>;
          };
          createMany: {
            args: Prisma.PromotionLogCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PromotionLogCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>[];
          };
          delete: {
            args: Prisma.PromotionLogDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>;
          };
          update: {
            args: Prisma.PromotionLogUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>;
          };
          deleteMany: {
            args: Prisma.PromotionLogDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PromotionLogUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.PromotionLogUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PromotionLogPayload>;
          };
          aggregate: {
            args: Prisma.PromotionLogAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePromotionLog>;
          };
          groupBy: {
            args: Prisma.PromotionLogGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PromotionLogGroupByOutputType>[];
          };
          count: {
            args: Prisma.PromotionLogCountArgs<ExtArgs>;
            result: $Utils.Optional<PromotionLogCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition
    ? T['emit'] extends 'event'
      ? T['level']
      : never
    : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
      : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type AssetCountOutputType
   */

  export type AssetCountOutputType = {
    variants: number;
    tags: number;
    promotionLogs: number;
  };

  export type AssetCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    variants?: boolean | AssetCountOutputTypeCountVariantsArgs;
    tags?: boolean | AssetCountOutputTypeCountTagsArgs;
    promotionLogs?: boolean | AssetCountOutputTypeCountPromotionLogsArgs;
  };

  // Custom InputTypes
  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetCountOutputType
     */
    select?: AssetCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountVariantsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VariantWhereInput;
  };

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountTagsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AssetTagWhereInput;
  };

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountPromotionLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PromotionLogWhereInput;
  };

  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    assets: number;
  };

  export type TagCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    assets?: boolean | TagCountOutputTypeCountAssetsArgs;
  };

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountAssetsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AssetTagWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null;
    _avg: AssetAvgAggregateOutputType | null;
    _sum: AssetSumAggregateOutputType | null;
    _min: AssetMinAggregateOutputType | null;
    _max: AssetMaxAggregateOutputType | null;
  };

  export type AssetAvgAggregateOutputType = {
    id: number | null;
    sourceLine: number | null;
  };

  export type AssetSumAggregateOutputType = {
    id: number | null;
    sourceLine: number | null;
  };

  export type AssetMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    kind: string | null;
    category: string | null;
    subcategory: string | null;
    sourcePath: string | null;
    sourceLine: number | null;
    description: string | null;
    value: string | null;
    importPath: string | null;
    previewHtml: string | null;
    promoted: boolean | null;
    deprecated: boolean | null;
    chromeStandard: boolean | null;
    dashboardCode: string | null;
    mockupSource: string | null;
    behaviorsJson: string | null;
    colorTokensJson: string | null;
    subElementsJson: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AssetMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    kind: string | null;
    category: string | null;
    subcategory: string | null;
    sourcePath: string | null;
    sourceLine: number | null;
    description: string | null;
    value: string | null;
    importPath: string | null;
    previewHtml: string | null;
    promoted: boolean | null;
    deprecated: boolean | null;
    chromeStandard: boolean | null;
    dashboardCode: string | null;
    mockupSource: string | null;
    behaviorsJson: string | null;
    colorTokensJson: string | null;
    subElementsJson: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AssetCountAggregateOutputType = {
    id: number;
    name: number;
    kind: number;
    category: number;
    subcategory: number;
    sourcePath: number;
    sourceLine: number;
    description: number;
    value: number;
    importPath: number;
    previewHtml: number;
    promoted: number;
    deprecated: number;
    chromeStandard: number;
    dashboardCode: number;
    mockupSource: number;
    behaviorsJson: number;
    colorTokensJson: number;
    subElementsJson: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type AssetAvgAggregateInputType = {
    id?: true;
    sourceLine?: true;
  };

  export type AssetSumAggregateInputType = {
    id?: true;
    sourceLine?: true;
  };

  export type AssetMinAggregateInputType = {
    id?: true;
    name?: true;
    kind?: true;
    category?: true;
    subcategory?: true;
    sourcePath?: true;
    sourceLine?: true;
    description?: true;
    value?: true;
    importPath?: true;
    previewHtml?: true;
    promoted?: true;
    deprecated?: true;
    chromeStandard?: true;
    dashboardCode?: true;
    mockupSource?: true;
    behaviorsJson?: true;
    colorTokensJson?: true;
    subElementsJson?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AssetMaxAggregateInputType = {
    id?: true;
    name?: true;
    kind?: true;
    category?: true;
    subcategory?: true;
    sourcePath?: true;
    sourceLine?: true;
    description?: true;
    value?: true;
    importPath?: true;
    previewHtml?: true;
    promoted?: true;
    deprecated?: true;
    chromeStandard?: true;
    dashboardCode?: true;
    mockupSource?: true;
    behaviorsJson?: true;
    colorTokensJson?: true;
    subElementsJson?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AssetCountAggregateInputType = {
    id?: true;
    name?: true;
    kind?: true;
    category?: true;
    subcategory?: true;
    sourcePath?: true;
    sourceLine?: true;
    description?: true;
    value?: true;
    importPath?: true;
    previewHtml?: true;
    promoted?: true;
    deprecated?: true;
    chromeStandard?: true;
    dashboardCode?: true;
    mockupSource?: true;
    behaviorsJson?: true;
    colorTokensJson?: true;
    subElementsJson?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AssetAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Assets
     **/
    _count?: true | AssetCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AssetAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AssetSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AssetMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AssetMaxAggregateInputType;
  };

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
    [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>;
  };

  export type AssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: AssetWhereInput;
      orderBy?: AssetOrderByWithAggregationInput | AssetOrderByWithAggregationInput[];
      by: AssetScalarFieldEnum[] | AssetScalarFieldEnum;
      having?: AssetScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: AssetCountAggregateInputType | true;
      _avg?: AssetAvgAggregateInputType;
      _sum?: AssetSumAggregateInputType;
      _min?: AssetMinAggregateInputType;
      _max?: AssetMaxAggregateInputType;
    };

  export type AssetGroupByOutputType = {
    id: number;
    name: string;
    kind: string;
    category: string | null;
    subcategory: string | null;
    sourcePath: string | null;
    sourceLine: number | null;
    description: string | null;
    value: string | null;
    importPath: string | null;
    previewHtml: string | null;
    promoted: boolean;
    deprecated: boolean;
    chromeStandard: boolean;
    dashboardCode: string | null;
    mockupSource: string | null;
    behaviorsJson: string | null;
    colorTokensJson: string | null;
    subElementsJson: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: AssetCountAggregateOutputType | null;
    _avg: AssetAvgAggregateOutputType | null;
    _sum: AssetSumAggregateOutputType | null;
    _min: AssetMinAggregateOutputType | null;
    _max: AssetMaxAggregateOutputType | null;
  };

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AssetGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AssetGroupByOutputType[P]>
          : GetScalarType<T[P], AssetGroupByOutputType[P]>;
      }
    >
  >;

  export type AssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        kind?: boolean;
        category?: boolean;
        subcategory?: boolean;
        sourcePath?: boolean;
        sourceLine?: boolean;
        description?: boolean;
        value?: boolean;
        importPath?: boolean;
        previewHtml?: boolean;
        promoted?: boolean;
        deprecated?: boolean;
        chromeStandard?: boolean;
        dashboardCode?: boolean;
        mockupSource?: boolean;
        behaviorsJson?: boolean;
        colorTokensJson?: boolean;
        subElementsJson?: boolean;
        notes?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        variants?: boolean | Asset$variantsArgs<ExtArgs>;
        tags?: boolean | Asset$tagsArgs<ExtArgs>;
        promotionLogs?: boolean | Asset$promotionLogsArgs<ExtArgs>;
        _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['asset']
    >;

  export type AssetSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      kind?: boolean;
      category?: boolean;
      subcategory?: boolean;
      sourcePath?: boolean;
      sourceLine?: boolean;
      description?: boolean;
      value?: boolean;
      importPath?: boolean;
      previewHtml?: boolean;
      promoted?: boolean;
      deprecated?: boolean;
      chromeStandard?: boolean;
      dashboardCode?: boolean;
      mockupSource?: boolean;
      behaviorsJson?: boolean;
      colorTokensJson?: boolean;
      subElementsJson?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['asset']
  >;

  export type AssetSelectScalar = {
    id?: boolean;
    name?: boolean;
    kind?: boolean;
    category?: boolean;
    subcategory?: boolean;
    sourcePath?: boolean;
    sourceLine?: boolean;
    description?: boolean;
    value?: boolean;
    importPath?: boolean;
    previewHtml?: boolean;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: boolean;
    mockupSource?: boolean;
    behaviorsJson?: boolean;
    colorTokensJson?: boolean;
    subElementsJson?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type AssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variants?: boolean | Asset$variantsArgs<ExtArgs>;
    tags?: boolean | Asset$tagsArgs<ExtArgs>;
    promotionLogs?: boolean | Asset$promotionLogsArgs<ExtArgs>;
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type AssetIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $AssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Asset';
    objects: {
      variants: Prisma.$VariantPayload<ExtArgs>[];
      tags: Prisma.$AssetTagPayload<ExtArgs>[];
      promotionLogs: Prisma.$PromotionLogPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        name: string;
        kind: string;
        category: string | null;
        subcategory: string | null;
        sourcePath: string | null;
        sourceLine: number | null;
        description: string | null;
        /**
         * Per token: il valore CSS literal (es. "#aab5f7"). Per altri: meta extra.
         */
        value: string | null;
        /**
         * Stringified import path (es. "@heuresys/ui/Button").
         */
        importPath: string | null;
        /**
         * Default preview HTML rendered nel canvas Preview tab. Per CSS classes
         * derivato da templates.mjs; per token swatch generato dal frontend; per
         * React/widget link a Storybook (vuoto).
         */
        previewHtml: string | null;
        /**
         * Boolean: true se l'asset compare nel SoT brand-dashboard-catalog.md
         */
        promoted: boolean;
        /**
         * Boolean: deprecato post-L41/L42 ecc.
         */
        deprecated: boolean;
        /**
         * Boolean: true se asset è universal chrome standardizzato cross-role
         * (header/footer/sidebar). Diventa lo shell di TUTTE le dashboard di ruolo.
         */
        chromeStandard: boolean;
        /**
         * Per body asset: dashboard code di provenienza (es. "org_systems_v2").
         * Null per chrome universale o per asset non legati a una dashboard specifica.
         */
        dashboardCode: string | null;
        /**
         * Path al mockup di origine (audit trail provenienza dell'import). Append-only.
         */
        mockupSource: string | null;
        /**
         * JSON: { hover?, active?, animations?, transitions?, focus? } — descrive behavior grafico.
         */
        behaviorsJson: string | null;
        /**
         * JSON: array di token CSS variables usati (es. ["--accent","--surface-1"]).
         */
        colorTokensJson: string | null;
        /**
         * JSON: array di sub-element class names che vivono nested dentro questo wrapper.
         */
        subElementsJson: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['asset']
    >;
    composites: {};
  };

  type AssetGetPayload<S extends boolean | null | undefined | AssetDefaultArgs> = $Result.GetResult<
    Prisma.$AssetPayload,
    S
  >;

  type AssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AssetFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AssetCountAggregateInputType | true;
  };

  export interface AssetDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asset']; meta: { name: 'Asset' } };
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(
      args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(
      args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     *
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AssetFindManyArgs>(
      args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     *
     */
    create<T extends AssetCreateArgs>(
      args: SelectSubset<T, AssetCreateArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AssetCreateManyArgs>(
      args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     *
     */
    delete<T extends AssetDeleteArgs>(
      args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AssetUpdateArgs>(
      args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AssetDeleteManyArgs>(
      args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AssetUpdateManyArgs>(
      args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(
      args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
     **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AssetAggregateArgs>(
      args: Subset<T, AssetAggregateArgs>
    ): Prisma.PrismaPromise<GetAssetAggregateType<T>>;

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Asset model
     */
    readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    variants<T extends Asset$variantsArgs<ExtArgs> = {}>(
      args?: Subset<T, Asset$variantsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    tags<T extends Asset$tagsArgs<ExtArgs> = {}>(
      args?: Subset<T, Asset$tagsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    promotionLogs<T extends Asset$promotionLogsArgs<ExtArgs> = {}>(
      args?: Subset<T, Asset$promotionLogsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Asset model
   */
  interface AssetFieldRefs {
    readonly id: FieldRef<'Asset', 'Int'>;
    readonly name: FieldRef<'Asset', 'String'>;
    readonly kind: FieldRef<'Asset', 'String'>;
    readonly category: FieldRef<'Asset', 'String'>;
    readonly subcategory: FieldRef<'Asset', 'String'>;
    readonly sourcePath: FieldRef<'Asset', 'String'>;
    readonly sourceLine: FieldRef<'Asset', 'Int'>;
    readonly description: FieldRef<'Asset', 'String'>;
    readonly value: FieldRef<'Asset', 'String'>;
    readonly importPath: FieldRef<'Asset', 'String'>;
    readonly previewHtml: FieldRef<'Asset', 'String'>;
    readonly promoted: FieldRef<'Asset', 'Boolean'>;
    readonly deprecated: FieldRef<'Asset', 'Boolean'>;
    readonly chromeStandard: FieldRef<'Asset', 'Boolean'>;
    readonly dashboardCode: FieldRef<'Asset', 'String'>;
    readonly mockupSource: FieldRef<'Asset', 'String'>;
    readonly behaviorsJson: FieldRef<'Asset', 'String'>;
    readonly colorTokensJson: FieldRef<'Asset', 'String'>;
    readonly subElementsJson: FieldRef<'Asset', 'String'>;
    readonly notes: FieldRef<'Asset', 'String'>;
    readonly createdAt: FieldRef<'Asset', 'DateTime'>;
    readonly updatedAt: FieldRef<'Asset', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput;
  };

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput;
  };

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Asset create
   */
  export type AssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Asset
       */
      select?: AssetSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AssetInclude<ExtArgs> | null;
      /**
       * The data needed to create a Asset.
       */
      data: XOR<AssetCreateInput, AssetUncheckedCreateInput>;
    };

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[];
  };

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[];
  };

  /**
   * Asset update
   */
  export type AssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Asset
       */
      select?: AssetSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AssetInclude<ExtArgs> | null;
      /**
       * The data needed to update a Asset.
       */
      data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>;
      /**
       * Choose, which Asset to update.
       */
      where: AssetWhereUniqueInput;
    };

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>;
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput;
  };

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Asset
       */
      select?: AssetSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AssetInclude<ExtArgs> | null;
      /**
       * The filter to search for the Asset to update in case it exists.
       */
      where: AssetWhereUniqueInput;
      /**
       * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
       */
      create: XOR<AssetCreateInput, AssetUncheckedCreateInput>;
      /**
       * In case the Asset was found with the provided `where` argument, update it with this data.
       */
      update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>;
    };

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Asset
       */
      select?: AssetSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AssetInclude<ExtArgs> | null;
      /**
       * Filter which Asset to delete.
       */
      where: AssetWhereUniqueInput;
    };

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput;
  };

  /**
   * Asset.variants
   */
  export type Asset$variantsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    where?: VariantWhereInput;
    orderBy?: VariantOrderByWithRelationInput | VariantOrderByWithRelationInput[];
    cursor?: VariantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: VariantScalarFieldEnum | VariantScalarFieldEnum[];
  };

  /**
   * Asset.tags
   */
  export type Asset$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    where?: AssetTagWhereInput;
    orderBy?: AssetTagOrderByWithRelationInput | AssetTagOrderByWithRelationInput[];
    cursor?: AssetTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AssetTagScalarFieldEnum | AssetTagScalarFieldEnum[];
  };

  /**
   * Asset.promotionLogs
   */
  export type Asset$promotionLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    where?: PromotionLogWhereInput;
    orderBy?: PromotionLogOrderByWithRelationInput | PromotionLogOrderByWithRelationInput[];
    cursor?: PromotionLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PromotionLogScalarFieldEnum | PromotionLogScalarFieldEnum[];
  };

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Asset
       */
      select?: AssetSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AssetInclude<ExtArgs> | null;
    };

  /**
   * Model Variant
   */

  export type AggregateVariant = {
    _count: VariantCountAggregateOutputType | null;
    _avg: VariantAvgAggregateOutputType | null;
    _sum: VariantSumAggregateOutputType | null;
    _min: VariantMinAggregateOutputType | null;
    _max: VariantMaxAggregateOutputType | null;
  };

  export type VariantAvgAggregateOutputType = {
    id: number | null;
    assetId: number | null;
  };

  export type VariantSumAggregateOutputType = {
    id: number | null;
    assetId: number | null;
  };

  export type VariantMinAggregateOutputType = {
    id: number | null;
    assetId: number | null;
    name: string | null;
    modifier: string | null;
    propsJson: string | null;
    previewHtml: string | null;
    notes: string | null;
    createdAt: Date | null;
  };

  export type VariantMaxAggregateOutputType = {
    id: number | null;
    assetId: number | null;
    name: string | null;
    modifier: string | null;
    propsJson: string | null;
    previewHtml: string | null;
    notes: string | null;
    createdAt: Date | null;
  };

  export type VariantCountAggregateOutputType = {
    id: number;
    assetId: number;
    name: number;
    modifier: number;
    propsJson: number;
    previewHtml: number;
    notes: number;
    createdAt: number;
    _all: number;
  };

  export type VariantAvgAggregateInputType = {
    id?: true;
    assetId?: true;
  };

  export type VariantSumAggregateInputType = {
    id?: true;
    assetId?: true;
  };

  export type VariantMinAggregateInputType = {
    id?: true;
    assetId?: true;
    name?: true;
    modifier?: true;
    propsJson?: true;
    previewHtml?: true;
    notes?: true;
    createdAt?: true;
  };

  export type VariantMaxAggregateInputType = {
    id?: true;
    assetId?: true;
    name?: true;
    modifier?: true;
    propsJson?: true;
    previewHtml?: true;
    notes?: true;
    createdAt?: true;
  };

  export type VariantCountAggregateInputType = {
    id?: true;
    assetId?: true;
    name?: true;
    modifier?: true;
    propsJson?: true;
    previewHtml?: true;
    notes?: true;
    createdAt?: true;
    _all?: true;
  };

  export type VariantAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Variant to aggregate.
     */
    where?: VariantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Variants to fetch.
     */
    orderBy?: VariantOrderByWithRelationInput | VariantOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VariantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Variants from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Variants.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Variants
     **/
    _count?: true | VariantCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: VariantAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: VariantSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VariantMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VariantMaxAggregateInputType;
  };

  export type GetVariantAggregateType<T extends VariantAggregateArgs> = {
    [P in keyof T & keyof AggregateVariant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVariant[P]>
      : GetScalarType<T[P], AggregateVariant[P]>;
  };

  export type VariantGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VariantWhereInput;
    orderBy?: VariantOrderByWithAggregationInput | VariantOrderByWithAggregationInput[];
    by: VariantScalarFieldEnum[] | VariantScalarFieldEnum;
    having?: VariantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VariantCountAggregateInputType | true;
    _avg?: VariantAvgAggregateInputType;
    _sum?: VariantSumAggregateInputType;
    _min?: VariantMinAggregateInputType;
    _max?: VariantMaxAggregateInputType;
  };

  export type VariantGroupByOutputType = {
    id: number;
    assetId: number;
    name: string;
    modifier: string | null;
    propsJson: string | null;
    previewHtml: string | null;
    notes: string | null;
    createdAt: Date;
    _count: VariantCountAggregateOutputType | null;
    _avg: VariantAvgAggregateOutputType | null;
    _sum: VariantSumAggregateOutputType | null;
    _min: VariantMinAggregateOutputType | null;
    _max: VariantMaxAggregateOutputType | null;
  };

  type GetVariantGroupByPayload<T extends VariantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VariantGroupByOutputType, T['by']> & {
        [P in keyof T & keyof VariantGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], VariantGroupByOutputType[P]>
          : GetScalarType<T[P], VariantGroupByOutputType[P]>;
      }
    >
  >;

  export type VariantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        assetId?: boolean;
        name?: boolean;
        modifier?: boolean;
        propsJson?: boolean;
        previewHtml?: boolean;
        notes?: boolean;
        createdAt?: boolean;
        asset?: boolean | AssetDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['variant']
    >;

  export type VariantSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      assetId?: boolean;
      name?: boolean;
      modifier?: boolean;
      propsJson?: boolean;
      previewHtml?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      asset?: boolean | AssetDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['variant']
  >;

  export type VariantSelectScalar = {
    id?: boolean;
    assetId?: boolean;
    name?: boolean;
    modifier?: boolean;
    propsJson?: boolean;
    previewHtml?: boolean;
    notes?: boolean;
    createdAt?: boolean;
  };

  export type VariantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>;
  };
  export type VariantIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>;
  };

  export type $VariantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Variant';
      objects: {
        asset: Prisma.$AssetPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: number;
          assetId: number;
          name: string;
          /**
           * CSS modifier (es. ".pill-warn") oppure variant key React (es. "primary").
           */
          modifier: string | null;
          /**
           * JSON stringified props (per React) o data sample (per CSS).
           */
          propsJson: string | null;
          /**
           * HTML inline da renderizzare nel preview pane.
           */
          previewHtml: string | null;
          notes: string | null;
          createdAt: Date;
        },
        ExtArgs['result']['variant']
      >;
      composites: {};
    };

  type VariantGetPayload<S extends boolean | null | undefined | VariantDefaultArgs> =
    $Result.GetResult<Prisma.$VariantPayload, S>;

  type VariantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    VariantFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: VariantCountAggregateInputType | true;
  };

  export interface VariantDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Variant']; meta: { name: 'Variant' } };
    /**
     * Find zero or one Variant that matches the filter.
     * @param {VariantFindUniqueArgs} args - Arguments to find a Variant
     * @example
     * // Get one Variant
     * const variant = await prisma.variant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VariantFindUniqueArgs>(
      args: SelectSubset<T, VariantFindUniqueArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Variant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VariantFindUniqueOrThrowArgs} args - Arguments to find a Variant
     * @example
     * // Get one Variant
     * const variant = await prisma.variant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VariantFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VariantFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Variant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantFindFirstArgs} args - Arguments to find a Variant
     * @example
     * // Get one Variant
     * const variant = await prisma.variant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VariantFindFirstArgs>(
      args?: SelectSubset<T, VariantFindFirstArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Variant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantFindFirstOrThrowArgs} args - Arguments to find a Variant
     * @example
     * // Get one Variant
     * const variant = await prisma.variant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VariantFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VariantFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Variants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Variants
     * const variants = await prisma.variant.findMany()
     *
     * // Get first 10 Variants
     * const variants = await prisma.variant.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const variantWithIdOnly = await prisma.variant.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VariantFindManyArgs>(
      args?: SelectSubset<T, VariantFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a Variant.
     * @param {VariantCreateArgs} args - Arguments to create a Variant.
     * @example
     * // Create one Variant
     * const Variant = await prisma.variant.create({
     *   data: {
     *     // ... data to create a Variant
     *   }
     * })
     *
     */
    create<T extends VariantCreateArgs>(
      args: SelectSubset<T, VariantCreateArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Variants.
     * @param {VariantCreateManyArgs} args - Arguments to create many Variants.
     * @example
     * // Create many Variants
     * const variant = await prisma.variant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VariantCreateManyArgs>(
      args?: SelectSubset<T, VariantCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Variants and returns the data saved in the database.
     * @param {VariantCreateManyAndReturnArgs} args - Arguments to create many Variants.
     * @example
     * // Create many Variants
     * const variant = await prisma.variant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Variants and only return the `id`
     * const variantWithIdOnly = await prisma.variant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VariantCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VariantCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Variant.
     * @param {VariantDeleteArgs} args - Arguments to delete one Variant.
     * @example
     * // Delete one Variant
     * const Variant = await prisma.variant.delete({
     *   where: {
     *     // ... filter to delete one Variant
     *   }
     * })
     *
     */
    delete<T extends VariantDeleteArgs>(
      args: SelectSubset<T, VariantDeleteArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Variant.
     * @param {VariantUpdateArgs} args - Arguments to update one Variant.
     * @example
     * // Update one Variant
     * const variant = await prisma.variant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VariantUpdateArgs>(
      args: SelectSubset<T, VariantUpdateArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Variants.
     * @param {VariantDeleteManyArgs} args - Arguments to filter Variants to delete.
     * @example
     * // Delete a few Variants
     * const { count } = await prisma.variant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VariantDeleteManyArgs>(
      args?: SelectSubset<T, VariantDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Variants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Variants
     * const variant = await prisma.variant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VariantUpdateManyArgs>(
      args: SelectSubset<T, VariantUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Variant.
     * @param {VariantUpsertArgs} args - Arguments to update or create a Variant.
     * @example
     * // Update or create a Variant
     * const variant = await prisma.variant.upsert({
     *   create: {
     *     // ... data to create a Variant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Variant we want to update
     *   }
     * })
     */
    upsert<T extends VariantUpsertArgs>(
      args: SelectSubset<T, VariantUpsertArgs<ExtArgs>>
    ): Prisma__VariantClient<
      $Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Variants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantCountArgs} args - Arguments to filter Variants to count.
     * @example
     * // Count the number of Variants
     * const count = await prisma.variant.count({
     *   where: {
     *     // ... the filter for the Variants we want to count
     *   }
     * })
     **/
    count<T extends VariantCountArgs>(
      args?: Subset<T, VariantCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VariantCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Variant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends VariantAggregateArgs>(
      args: Subset<T, VariantAggregateArgs>
    ): Prisma.PrismaPromise<GetVariantAggregateType<T>>;

    /**
     * Group by Variant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends VariantGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VariantGroupByArgs['orderBy'] }
        : { orderBy?: VariantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VariantGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Variant model
     */
    readonly fields: VariantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Variant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VariantClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AssetDefaultArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Variant model
   */
  interface VariantFieldRefs {
    readonly id: FieldRef<'Variant', 'Int'>;
    readonly assetId: FieldRef<'Variant', 'Int'>;
    readonly name: FieldRef<'Variant', 'String'>;
    readonly modifier: FieldRef<'Variant', 'String'>;
    readonly propsJson: FieldRef<'Variant', 'String'>;
    readonly previewHtml: FieldRef<'Variant', 'String'>;
    readonly notes: FieldRef<'Variant', 'String'>;
    readonly createdAt: FieldRef<'Variant', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Variant findUnique
   */
  export type VariantFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * Filter, which Variant to fetch.
     */
    where: VariantWhereUniqueInput;
  };

  /**
   * Variant findUniqueOrThrow
   */
  export type VariantFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * Filter, which Variant to fetch.
     */
    where: VariantWhereUniqueInput;
  };

  /**
   * Variant findFirst
   */
  export type VariantFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * Filter, which Variant to fetch.
     */
    where?: VariantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Variants to fetch.
     */
    orderBy?: VariantOrderByWithRelationInput | VariantOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Variants.
     */
    cursor?: VariantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Variants from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Variants.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Variants.
     */
    distinct?: VariantScalarFieldEnum | VariantScalarFieldEnum[];
  };

  /**
   * Variant findFirstOrThrow
   */
  export type VariantFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * Filter, which Variant to fetch.
     */
    where?: VariantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Variants to fetch.
     */
    orderBy?: VariantOrderByWithRelationInput | VariantOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Variants.
     */
    cursor?: VariantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Variants from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Variants.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Variants.
     */
    distinct?: VariantScalarFieldEnum | VariantScalarFieldEnum[];
  };

  /**
   * Variant findMany
   */
  export type VariantFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * Filter, which Variants to fetch.
     */
    where?: VariantWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Variants to fetch.
     */
    orderBy?: VariantOrderByWithRelationInput | VariantOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Variants.
     */
    cursor?: VariantWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Variants from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Variants.
     */
    skip?: number;
    distinct?: VariantScalarFieldEnum | VariantScalarFieldEnum[];
  };

  /**
   * Variant create
   */
  export type VariantCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * The data needed to create a Variant.
     */
    data: XOR<VariantCreateInput, VariantUncheckedCreateInput>;
  };

  /**
   * Variant createMany
   */
  export type VariantCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Variants.
     */
    data: VariantCreateManyInput | VariantCreateManyInput[];
  };

  /**
   * Variant createManyAndReturn
   */
  export type VariantCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Variants.
     */
    data: VariantCreateManyInput | VariantCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Variant update
   */
  export type VariantUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * The data needed to update a Variant.
     */
    data: XOR<VariantUpdateInput, VariantUncheckedUpdateInput>;
    /**
     * Choose, which Variant to update.
     */
    where: VariantWhereUniqueInput;
  };

  /**
   * Variant updateMany
   */
  export type VariantUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Variants.
     */
    data: XOR<VariantUpdateManyMutationInput, VariantUncheckedUpdateManyInput>;
    /**
     * Filter which Variants to update
     */
    where?: VariantWhereInput;
  };

  /**
   * Variant upsert
   */
  export type VariantUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * The filter to search for the Variant to update in case it exists.
     */
    where: VariantWhereUniqueInput;
    /**
     * In case the Variant found by the `where` argument doesn't exist, create a new Variant with this data.
     */
    create: XOR<VariantCreateInput, VariantUncheckedCreateInput>;
    /**
     * In case the Variant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VariantUpdateInput, VariantUncheckedUpdateInput>;
  };

  /**
   * Variant delete
   */
  export type VariantDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
    /**
     * Filter which Variant to delete.
     */
    where: VariantWhereUniqueInput;
  };

  /**
   * Variant deleteMany
   */
  export type VariantDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Variants to delete
     */
    where?: VariantWhereInput;
  };

  /**
   * Variant without action
   */
  export type VariantDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Variant
     */
    select?: VariantSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariantInclude<ExtArgs> | null;
  };

  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null;
    _avg: TagAvgAggregateOutputType | null;
    _sum: TagSumAggregateOutputType | null;
    _min: TagMinAggregateOutputType | null;
    _max: TagMaxAggregateOutputType | null;
  };

  export type TagAvgAggregateOutputType = {
    id: number | null;
  };

  export type TagSumAggregateOutputType = {
    id: number | null;
  };

  export type TagMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    color: string | null;
  };

  export type TagMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    color: string | null;
  };

  export type TagCountAggregateOutputType = {
    id: number;
    name: number;
    color: number;
    _all: number;
  };

  export type TagAvgAggregateInputType = {
    id?: true;
  };

  export type TagSumAggregateInputType = {
    id?: true;
  };

  export type TagMinAggregateInputType = {
    id?: true;
    name?: true;
    color?: true;
  };

  export type TagMaxAggregateInputType = {
    id?: true;
    name?: true;
    color?: true;
  };

  export type TagCountAggregateInputType = {
    id?: true;
    name?: true;
    color?: true;
    _all?: true;
  };

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Filter which Tag to aggregate.
       */
      where?: TagWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Tags to fetch.
       */
      orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: TagWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Tags from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Tags.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Tags
       **/
      _count?: true | TagCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to average
       **/
      _avg?: TagAvgAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to sum
       **/
      _sum?: TagSumAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: TagMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: TagMaxAggregateInputType;
    };

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
    [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>;
  };

  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput;
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[];
    by: TagScalarFieldEnum[] | TagScalarFieldEnum;
    having?: TagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TagCountAggregateInputType | true;
    _avg?: TagAvgAggregateInputType;
    _sum?: TagSumAggregateInputType;
    _min?: TagMinAggregateInputType;
    _max?: TagMaxAggregateInputType;
  };

  export type TagGroupByOutputType = {
    id: number;
    name: string;
    color: string | null;
    _count: TagCountAggregateOutputType | null;
    _avg: TagAvgAggregateOutputType | null;
    _sum: TagSumAggregateOutputType | null;
    _min: TagMinAggregateOutputType | null;
    _max: TagMaxAggregateOutputType | null;
  };

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> & {
        [P in keyof T & keyof TagGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TagGroupByOutputType[P]>
          : GetScalarType<T[P], TagGroupByOutputType[P]>;
      }
    >
  >;

  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        color?: boolean;
        assets?: boolean | Tag$assetsArgs<ExtArgs>;
        _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['tag']
    >;

  export type TagSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      color?: boolean;
    },
    ExtArgs['result']['tag']
  >;

  export type TagSelectScalar = {
    id?: boolean;
    name?: boolean;
    color?: boolean;
  };

  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | Tag$assetsArgs<ExtArgs>;
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type TagIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Tag';
    objects: {
      assets: Prisma.$AssetTagPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        name: string;
        /**
         * Hex color or semantic key for badge rendering.
         */
        color: string | null;
      },
      ExtArgs['result']['tag']
    >;
    composites: {};
  };

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<
    Prisma.$TagPayload,
    S
  >;

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    TagFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: TagCountAggregateInputType | true;
  };

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag']; meta: { name: 'Tag' } };
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(
      args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(
      args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     *
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TagFindManyArgs>(
      args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     *
     */
    create<T extends TagCreateArgs>(
      args: SelectSubset<T, TagCreateArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TagCreateManyArgs>(
      args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     *
     */
    delete<T extends TagDeleteArgs>(
      args: SelectSubset<T, TagDeleteArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TagUpdateArgs>(
      args: SelectSubset<T, TagUpdateArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TagDeleteManyArgs>(
      args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TagUpdateManyArgs>(
      args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(
      args: SelectSubset<T, TagUpsertArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
     **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TagAggregateArgs>(
      args: Subset<T, TagAggregateArgs>
    ): Prisma.PrismaPromise<GetTagAggregateType<T>>;

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Tag model
     */
    readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    assets<T extends Tag$assetsArgs<ExtArgs> = {}>(
      args?: Subset<T, Tag$assetsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<'Tag', 'Int'>;
    readonly name: FieldRef<'Tag', 'String'>;
    readonly color: FieldRef<'Tag', 'String'>;
  }

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput;
  };

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput;
  };

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Tag
       */
      select?: TagSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TagInclude<ExtArgs> | null;
      /**
       * Filter, which Tag to fetch.
       */
      where?: TagWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Tags to fetch.
       */
      orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Tags.
       */
      cursor?: TagWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Tags from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Tags.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Tags.
       */
      distinct?: TagScalarFieldEnum | TagScalarFieldEnum[];
    };

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[];
  };

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Tag
       */
      select?: TagSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TagInclude<ExtArgs> | null;
      /**
       * Filter, which Tags to fetch.
       */
      where?: TagWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Tags to fetch.
       */
      orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Tags.
       */
      cursor?: TagWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Tags from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Tags.
       */
      skip?: number;
      distinct?: TagScalarFieldEnum | TagScalarFieldEnum[];
    };

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>;
  };

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[];
  };

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[];
  };

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>;
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput;
  };

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>;
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput;
  };

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput;
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>;
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>;
  };

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput;
  };

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput;
  };

  /**
   * Tag.assets
   */
  export type Tag$assetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    where?: AssetTagWhereInput;
    orderBy?: AssetTagOrderByWithRelationInput | AssetTagOrderByWithRelationInput[];
    cursor?: AssetTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AssetTagScalarFieldEnum | AssetTagScalarFieldEnum[];
  };

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null;
  };

  /**
   * Model AssetTag
   */

  export type AggregateAssetTag = {
    _count: AssetTagCountAggregateOutputType | null;
    _avg: AssetTagAvgAggregateOutputType | null;
    _sum: AssetTagSumAggregateOutputType | null;
    _min: AssetTagMinAggregateOutputType | null;
    _max: AssetTagMaxAggregateOutputType | null;
  };

  export type AssetTagAvgAggregateOutputType = {
    assetId: number | null;
    tagId: number | null;
  };

  export type AssetTagSumAggregateOutputType = {
    assetId: number | null;
    tagId: number | null;
  };

  export type AssetTagMinAggregateOutputType = {
    assetId: number | null;
    tagId: number | null;
  };

  export type AssetTagMaxAggregateOutputType = {
    assetId: number | null;
    tagId: number | null;
  };

  export type AssetTagCountAggregateOutputType = {
    assetId: number;
    tagId: number;
    _all: number;
  };

  export type AssetTagAvgAggregateInputType = {
    assetId?: true;
    tagId?: true;
  };

  export type AssetTagSumAggregateInputType = {
    assetId?: true;
    tagId?: true;
  };

  export type AssetTagMinAggregateInputType = {
    assetId?: true;
    tagId?: true;
  };

  export type AssetTagMaxAggregateInputType = {
    assetId?: true;
    tagId?: true;
  };

  export type AssetTagCountAggregateInputType = {
    assetId?: true;
    tagId?: true;
    _all?: true;
  };

  export type AssetTagAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AssetTag to aggregate.
     */
    where?: AssetTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AssetTags to fetch.
     */
    orderBy?: AssetTagOrderByWithRelationInput | AssetTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AssetTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AssetTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AssetTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AssetTags
     **/
    _count?: true | AssetTagCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AssetTagAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AssetTagSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AssetTagMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AssetTagMaxAggregateInputType;
  };

  export type GetAssetTagAggregateType<T extends AssetTagAggregateArgs> = {
    [P in keyof T & keyof AggregateAssetTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetTag[P]>
      : GetScalarType<T[P], AggregateAssetTag[P]>;
  };

  export type AssetTagGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AssetTagWhereInput;
    orderBy?: AssetTagOrderByWithAggregationInput | AssetTagOrderByWithAggregationInput[];
    by: AssetTagScalarFieldEnum[] | AssetTagScalarFieldEnum;
    having?: AssetTagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AssetTagCountAggregateInputType | true;
    _avg?: AssetTagAvgAggregateInputType;
    _sum?: AssetTagSumAggregateInputType;
    _min?: AssetTagMinAggregateInputType;
    _max?: AssetTagMaxAggregateInputType;
  };

  export type AssetTagGroupByOutputType = {
    assetId: number;
    tagId: number;
    _count: AssetTagCountAggregateOutputType | null;
    _avg: AssetTagAvgAggregateOutputType | null;
    _sum: AssetTagSumAggregateOutputType | null;
    _min: AssetTagMinAggregateOutputType | null;
    _max: AssetTagMaxAggregateOutputType | null;
  };

  type GetAssetTagGroupByPayload<T extends AssetTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetTagGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AssetTagGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AssetTagGroupByOutputType[P]>
          : GetScalarType<T[P], AssetTagGroupByOutputType[P]>;
      }
    >
  >;

  export type AssetTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        assetId?: boolean;
        tagId?: boolean;
        asset?: boolean | AssetDefaultArgs<ExtArgs>;
        tag?: boolean | TagDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['assetTag']
    >;

  export type AssetTagSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      assetId?: boolean;
      tagId?: boolean;
      asset?: boolean | AssetDefaultArgs<ExtArgs>;
      tag?: boolean | TagDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['assetTag']
  >;

  export type AssetTagSelectScalar = {
    assetId?: boolean;
    tagId?: boolean;
  };

  export type AssetTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      asset?: boolean | AssetDefaultArgs<ExtArgs>;
      tag?: boolean | TagDefaultArgs<ExtArgs>;
    };
  export type AssetTagIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>;
    tag?: boolean | TagDefaultArgs<ExtArgs>;
  };

  export type $AssetTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'AssetTag';
      objects: {
        asset: Prisma.$AssetPayload<ExtArgs>;
        tag: Prisma.$TagPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          assetId: number;
          tagId: number;
        },
        ExtArgs['result']['assetTag']
      >;
      composites: {};
    };

  type AssetTagGetPayload<S extends boolean | null | undefined | AssetTagDefaultArgs> =
    $Result.GetResult<Prisma.$AssetTagPayload, S>;

  type AssetTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AssetTagFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AssetTagCountAggregateInputType | true;
  };

  export interface AssetTagDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AssetTag'];
      meta: { name: 'AssetTag' };
    };
    /**
     * Find zero or one AssetTag that matches the filter.
     * @param {AssetTagFindUniqueArgs} args - Arguments to find a AssetTag
     * @example
     * // Get one AssetTag
     * const assetTag = await prisma.assetTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetTagFindUniqueArgs>(
      args: SelectSubset<T, AssetTagFindUniqueArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one AssetTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetTagFindUniqueOrThrowArgs} args - Arguments to find a AssetTag
     * @example
     * // Get one AssetTag
     * const assetTag = await prisma.assetTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetTagFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AssetTagFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first AssetTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagFindFirstArgs} args - Arguments to find a AssetTag
     * @example
     * // Get one AssetTag
     * const assetTag = await prisma.assetTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetTagFindFirstArgs>(
      args?: SelectSubset<T, AssetTagFindFirstArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first AssetTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagFindFirstOrThrowArgs} args - Arguments to find a AssetTag
     * @example
     * // Get one AssetTag
     * const assetTag = await prisma.assetTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetTagFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AssetTagFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more AssetTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetTags
     * const assetTags = await prisma.assetTag.findMany()
     *
     * // Get first 10 AssetTags
     * const assetTags = await prisma.assetTag.findMany({ take: 10 })
     *
     * // Only select the `assetId`
     * const assetTagWithAssetIdOnly = await prisma.assetTag.findMany({ select: { assetId: true } })
     *
     */
    findMany<T extends AssetTagFindManyArgs>(
      args?: SelectSubset<T, AssetTagFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a AssetTag.
     * @param {AssetTagCreateArgs} args - Arguments to create a AssetTag.
     * @example
     * // Create one AssetTag
     * const AssetTag = await prisma.assetTag.create({
     *   data: {
     *     // ... data to create a AssetTag
     *   }
     * })
     *
     */
    create<T extends AssetTagCreateArgs>(
      args: SelectSubset<T, AssetTagCreateArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many AssetTags.
     * @param {AssetTagCreateManyArgs} args - Arguments to create many AssetTags.
     * @example
     * // Create many AssetTags
     * const assetTag = await prisma.assetTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AssetTagCreateManyArgs>(
      args?: SelectSubset<T, AssetTagCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AssetTags and returns the data saved in the database.
     * @param {AssetTagCreateManyAndReturnArgs} args - Arguments to create many AssetTags.
     * @example
     * // Create many AssetTags
     * const assetTag = await prisma.assetTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AssetTags and only return the `assetId`
     * const assetTagWithAssetIdOnly = await prisma.assetTag.createManyAndReturn({
     *   select: { assetId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AssetTagCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AssetTagCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a AssetTag.
     * @param {AssetTagDeleteArgs} args - Arguments to delete one AssetTag.
     * @example
     * // Delete one AssetTag
     * const AssetTag = await prisma.assetTag.delete({
     *   where: {
     *     // ... filter to delete one AssetTag
     *   }
     * })
     *
     */
    delete<T extends AssetTagDeleteArgs>(
      args: SelectSubset<T, AssetTagDeleteArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one AssetTag.
     * @param {AssetTagUpdateArgs} args - Arguments to update one AssetTag.
     * @example
     * // Update one AssetTag
     * const assetTag = await prisma.assetTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AssetTagUpdateArgs>(
      args: SelectSubset<T, AssetTagUpdateArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more AssetTags.
     * @param {AssetTagDeleteManyArgs} args - Arguments to filter AssetTags to delete.
     * @example
     * // Delete a few AssetTags
     * const { count } = await prisma.assetTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AssetTagDeleteManyArgs>(
      args?: SelectSubset<T, AssetTagDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AssetTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetTags
     * const assetTag = await prisma.assetTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AssetTagUpdateManyArgs>(
      args: SelectSubset<T, AssetTagUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AssetTag.
     * @param {AssetTagUpsertArgs} args - Arguments to update or create a AssetTag.
     * @example
     * // Update or create a AssetTag
     * const assetTag = await prisma.assetTag.upsert({
     *   create: {
     *     // ... data to create a AssetTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetTag we want to update
     *   }
     * })
     */
    upsert<T extends AssetTagUpsertArgs>(
      args: SelectSubset<T, AssetTagUpsertArgs<ExtArgs>>
    ): Prisma__AssetTagClient<
      $Result.GetResult<Prisma.$AssetTagPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of AssetTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagCountArgs} args - Arguments to filter AssetTags to count.
     * @example
     * // Count the number of AssetTags
     * const count = await prisma.assetTag.count({
     *   where: {
     *     // ... the filter for the AssetTags we want to count
     *   }
     * })
     **/
    count<T extends AssetTagCountArgs>(
      args?: Subset<T, AssetTagCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetTagCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AssetTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AssetTagAggregateArgs>(
      args: Subset<T, AssetTagAggregateArgs>
    ): Prisma.PrismaPromise<GetAssetTagAggregateType<T>>;

    /**
     * Group by AssetTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetTagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AssetTagGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetTagGroupByArgs['orderBy'] }
        : { orderBy?: AssetTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AssetTagGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetAssetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AssetTag model
     */
    readonly fields: AssetTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetTagClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AssetDefaultArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, TagDefaultArgs<ExtArgs>>
    ): Prisma__TagClient<
      $Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AssetTag model
   */
  interface AssetTagFieldRefs {
    readonly assetId: FieldRef<'AssetTag', 'Int'>;
    readonly tagId: FieldRef<'AssetTag', 'Int'>;
  }

  // Custom InputTypes
  /**
   * AssetTag findUnique
   */
  export type AssetTagFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * Filter, which AssetTag to fetch.
     */
    where: AssetTagWhereUniqueInput;
  };

  /**
   * AssetTag findUniqueOrThrow
   */
  export type AssetTagFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * Filter, which AssetTag to fetch.
     */
    where: AssetTagWhereUniqueInput;
  };

  /**
   * AssetTag findFirst
   */
  export type AssetTagFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * Filter, which AssetTag to fetch.
     */
    where?: AssetTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AssetTags to fetch.
     */
    orderBy?: AssetTagOrderByWithRelationInput | AssetTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AssetTags.
     */
    cursor?: AssetTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AssetTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AssetTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AssetTags.
     */
    distinct?: AssetTagScalarFieldEnum | AssetTagScalarFieldEnum[];
  };

  /**
   * AssetTag findFirstOrThrow
   */
  export type AssetTagFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * Filter, which AssetTag to fetch.
     */
    where?: AssetTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AssetTags to fetch.
     */
    orderBy?: AssetTagOrderByWithRelationInput | AssetTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AssetTags.
     */
    cursor?: AssetTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AssetTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AssetTags.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AssetTags.
     */
    distinct?: AssetTagScalarFieldEnum | AssetTagScalarFieldEnum[];
  };

  /**
   * AssetTag findMany
   */
  export type AssetTagFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * Filter, which AssetTags to fetch.
     */
    where?: AssetTagWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AssetTags to fetch.
     */
    orderBy?: AssetTagOrderByWithRelationInput | AssetTagOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AssetTags.
     */
    cursor?: AssetTagWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AssetTags from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AssetTags.
     */
    skip?: number;
    distinct?: AssetTagScalarFieldEnum | AssetTagScalarFieldEnum[];
  };

  /**
   * AssetTag create
   */
  export type AssetTagCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * The data needed to create a AssetTag.
     */
    data: XOR<AssetTagCreateInput, AssetTagUncheckedCreateInput>;
  };

  /**
   * AssetTag createMany
   */
  export type AssetTagCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AssetTags.
     */
    data: AssetTagCreateManyInput | AssetTagCreateManyInput[];
  };

  /**
   * AssetTag createManyAndReturn
   */
  export type AssetTagCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many AssetTags.
     */
    data: AssetTagCreateManyInput | AssetTagCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AssetTag update
   */
  export type AssetTagUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * The data needed to update a AssetTag.
     */
    data: XOR<AssetTagUpdateInput, AssetTagUncheckedUpdateInput>;
    /**
     * Choose, which AssetTag to update.
     */
    where: AssetTagWhereUniqueInput;
  };

  /**
   * AssetTag updateMany
   */
  export type AssetTagUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AssetTags.
     */
    data: XOR<AssetTagUpdateManyMutationInput, AssetTagUncheckedUpdateManyInput>;
    /**
     * Filter which AssetTags to update
     */
    where?: AssetTagWhereInput;
  };

  /**
   * AssetTag upsert
   */
  export type AssetTagUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * The filter to search for the AssetTag to update in case it exists.
     */
    where: AssetTagWhereUniqueInput;
    /**
     * In case the AssetTag found by the `where` argument doesn't exist, create a new AssetTag with this data.
     */
    create: XOR<AssetTagCreateInput, AssetTagUncheckedCreateInput>;
    /**
     * In case the AssetTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetTagUpdateInput, AssetTagUncheckedUpdateInput>;
  };

  /**
   * AssetTag delete
   */
  export type AssetTagDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
    /**
     * Filter which AssetTag to delete.
     */
    where: AssetTagWhereUniqueInput;
  };

  /**
   * AssetTag deleteMany
   */
  export type AssetTagDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AssetTags to delete
     */
    where?: AssetTagWhereInput;
  };

  /**
   * AssetTag without action
   */
  export type AssetTagDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AssetTag
     */
    select?: AssetTagSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetTagInclude<ExtArgs> | null;
  };

  /**
   * Model PromotionLog
   */

  export type AggregatePromotionLog = {
    _count: PromotionLogCountAggregateOutputType | null;
    _avg: PromotionLogAvgAggregateOutputType | null;
    _sum: PromotionLogSumAggregateOutputType | null;
    _min: PromotionLogMinAggregateOutputType | null;
    _max: PromotionLogMaxAggregateOutputType | null;
  };

  export type PromotionLogAvgAggregateOutputType = {
    id: number | null;
    assetId: number | null;
  };

  export type PromotionLogSumAggregateOutputType = {
    id: number | null;
    assetId: number | null;
  };

  export type PromotionLogMinAggregateOutputType = {
    id: number | null;
    assetId: number | null;
    action: string | null;
    notes: string | null;
    createdAt: Date | null;
  };

  export type PromotionLogMaxAggregateOutputType = {
    id: number | null;
    assetId: number | null;
    action: string | null;
    notes: string | null;
    createdAt: Date | null;
  };

  export type PromotionLogCountAggregateOutputType = {
    id: number;
    assetId: number;
    action: number;
    notes: number;
    createdAt: number;
    _all: number;
  };

  export type PromotionLogAvgAggregateInputType = {
    id?: true;
    assetId?: true;
  };

  export type PromotionLogSumAggregateInputType = {
    id?: true;
    assetId?: true;
  };

  export type PromotionLogMinAggregateInputType = {
    id?: true;
    assetId?: true;
    action?: true;
    notes?: true;
    createdAt?: true;
  };

  export type PromotionLogMaxAggregateInputType = {
    id?: true;
    assetId?: true;
    action?: true;
    notes?: true;
    createdAt?: true;
  };

  export type PromotionLogCountAggregateInputType = {
    id?: true;
    assetId?: true;
    action?: true;
    notes?: true;
    createdAt?: true;
    _all?: true;
  };

  export type PromotionLogAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PromotionLog to aggregate.
     */
    where?: PromotionLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionLogs to fetch.
     */
    orderBy?: PromotionLogOrderByWithRelationInput | PromotionLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PromotionLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PromotionLogs
     **/
    _count?: true | PromotionLogCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: PromotionLogAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: PromotionLogSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PromotionLogMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PromotionLogMaxAggregateInputType;
  };

  export type GetPromotionLogAggregateType<T extends PromotionLogAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromotionLog[P]>
      : GetScalarType<T[P], AggregatePromotionLog[P]>;
  };

  export type PromotionLogGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PromotionLogWhereInput;
    orderBy?: PromotionLogOrderByWithAggregationInput | PromotionLogOrderByWithAggregationInput[];
    by: PromotionLogScalarFieldEnum[] | PromotionLogScalarFieldEnum;
    having?: PromotionLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionLogCountAggregateInputType | true;
    _avg?: PromotionLogAvgAggregateInputType;
    _sum?: PromotionLogSumAggregateInputType;
    _min?: PromotionLogMinAggregateInputType;
    _max?: PromotionLogMaxAggregateInputType;
  };

  export type PromotionLogGroupByOutputType = {
    id: number;
    assetId: number;
    action: string;
    notes: string | null;
    createdAt: Date;
    _count: PromotionLogCountAggregateOutputType | null;
    _avg: PromotionLogAvgAggregateOutputType | null;
    _sum: PromotionLogSumAggregateOutputType | null;
    _min: PromotionLogMinAggregateOutputType | null;
    _max: PromotionLogMaxAggregateOutputType | null;
  };

  type GetPromotionLogGroupByPayload<T extends PromotionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromotionLogGroupByOutputType, T['by']> & {
        [P in keyof T & keyof PromotionLogGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], PromotionLogGroupByOutputType[P]>
          : GetScalarType<T[P], PromotionLogGroupByOutputType[P]>;
      }
    >
  >;

  export type PromotionLogSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      assetId?: boolean;
      action?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      asset?: boolean | AssetDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['promotionLog']
  >;

  export type PromotionLogSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      assetId?: boolean;
      action?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      asset?: boolean | AssetDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['promotionLog']
  >;

  export type PromotionLogSelectScalar = {
    id?: boolean;
    assetId?: boolean;
    action?: boolean;
    notes?: boolean;
    createdAt?: boolean;
  };

  export type PromotionLogInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>;
  };
  export type PromotionLogIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>;
  };

  export type $PromotionLogPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PromotionLog';
    objects: {
      asset: Prisma.$AssetPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        assetId: number;
        /**
         * 'promote' | 'unpromote' | 'edit' | 'create' | 'delete' | 'tag-add' | 'tag-remove'
         */
        action: string;
        /**
         * Optional details (e.g. previous/new state, reason).
         */
        notes: string | null;
        createdAt: Date;
      },
      ExtArgs['result']['promotionLog']
    >;
    composites: {};
  };

  type PromotionLogGetPayload<S extends boolean | null | undefined | PromotionLogDefaultArgs> =
    $Result.GetResult<Prisma.$PromotionLogPayload, S>;

  type PromotionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PromotionLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromotionLogCountAggregateInputType | true;
    };

  export interface PromotionLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PromotionLog'];
      meta: { name: 'PromotionLog' };
    };
    /**
     * Find zero or one PromotionLog that matches the filter.
     * @param {PromotionLogFindUniqueArgs} args - Arguments to find a PromotionLog
     * @example
     * // Get one PromotionLog
     * const promotionLog = await prisma.promotionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromotionLogFindUniqueArgs>(
      args: SelectSubset<T, PromotionLogFindUniqueArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one PromotionLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PromotionLogFindUniqueOrThrowArgs} args - Arguments to find a PromotionLog
     * @example
     * // Get one PromotionLog
     * const promotionLog = await prisma.promotionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromotionLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PromotionLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first PromotionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogFindFirstArgs} args - Arguments to find a PromotionLog
     * @example
     * // Get one PromotionLog
     * const promotionLog = await prisma.promotionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromotionLogFindFirstArgs>(
      args?: SelectSubset<T, PromotionLogFindFirstArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first PromotionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogFindFirstOrThrowArgs} args - Arguments to find a PromotionLog
     * @example
     * // Get one PromotionLog
     * const promotionLog = await prisma.promotionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromotionLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PromotionLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more PromotionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PromotionLogs
     * const promotionLogs = await prisma.promotionLog.findMany()
     *
     * // Get first 10 PromotionLogs
     * const promotionLogs = await prisma.promotionLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const promotionLogWithIdOnly = await prisma.promotionLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PromotionLogFindManyArgs>(
      args?: SelectSubset<T, PromotionLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a PromotionLog.
     * @param {PromotionLogCreateArgs} args - Arguments to create a PromotionLog.
     * @example
     * // Create one PromotionLog
     * const PromotionLog = await prisma.promotionLog.create({
     *   data: {
     *     // ... data to create a PromotionLog
     *   }
     * })
     *
     */
    create<T extends PromotionLogCreateArgs>(
      args: SelectSubset<T, PromotionLogCreateArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many PromotionLogs.
     * @param {PromotionLogCreateManyArgs} args - Arguments to create many PromotionLogs.
     * @example
     * // Create many PromotionLogs
     * const promotionLog = await prisma.promotionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PromotionLogCreateManyArgs>(
      args?: SelectSubset<T, PromotionLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many PromotionLogs and returns the data saved in the database.
     * @param {PromotionLogCreateManyAndReturnArgs} args - Arguments to create many PromotionLogs.
     * @example
     * // Create many PromotionLogs
     * const promotionLog = await prisma.promotionLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PromotionLogs and only return the `id`
     * const promotionLogWithIdOnly = await prisma.promotionLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PromotionLogCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PromotionLogCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a PromotionLog.
     * @param {PromotionLogDeleteArgs} args - Arguments to delete one PromotionLog.
     * @example
     * // Delete one PromotionLog
     * const PromotionLog = await prisma.promotionLog.delete({
     *   where: {
     *     // ... filter to delete one PromotionLog
     *   }
     * })
     *
     */
    delete<T extends PromotionLogDeleteArgs>(
      args: SelectSubset<T, PromotionLogDeleteArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one PromotionLog.
     * @param {PromotionLogUpdateArgs} args - Arguments to update one PromotionLog.
     * @example
     * // Update one PromotionLog
     * const promotionLog = await prisma.promotionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PromotionLogUpdateArgs>(
      args: SelectSubset<T, PromotionLogUpdateArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more PromotionLogs.
     * @param {PromotionLogDeleteManyArgs} args - Arguments to filter PromotionLogs to delete.
     * @example
     * // Delete a few PromotionLogs
     * const { count } = await prisma.promotionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PromotionLogDeleteManyArgs>(
      args?: SelectSubset<T, PromotionLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more PromotionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PromotionLogs
     * const promotionLog = await prisma.promotionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PromotionLogUpdateManyArgs>(
      args: SelectSubset<T, PromotionLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one PromotionLog.
     * @param {PromotionLogUpsertArgs} args - Arguments to update or create a PromotionLog.
     * @example
     * // Update or create a PromotionLog
     * const promotionLog = await prisma.promotionLog.upsert({
     *   create: {
     *     // ... data to create a PromotionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PromotionLog we want to update
     *   }
     * })
     */
    upsert<T extends PromotionLogUpsertArgs>(
      args: SelectSubset<T, PromotionLogUpsertArgs<ExtArgs>>
    ): Prisma__PromotionLogClient<
      $Result.GetResult<Prisma.$PromotionLogPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of PromotionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogCountArgs} args - Arguments to filter PromotionLogs to count.
     * @example
     * // Count the number of PromotionLogs
     * const count = await prisma.promotionLog.count({
     *   where: {
     *     // ... the filter for the PromotionLogs we want to count
     *   }
     * })
     **/
    count<T extends PromotionLogCountArgs>(
      args?: Subset<T, PromotionLogCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromotionLogCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a PromotionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PromotionLogAggregateArgs>(
      args: Subset<T, PromotionLogAggregateArgs>
    ): Prisma.PrismaPromise<GetPromotionLogAggregateType<T>>;

    /**
     * Group by PromotionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PromotionLogGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromotionLogGroupByArgs['orderBy'] }
        : { orderBy?: PromotionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PromotionLogGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetPromotionLogGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PromotionLog model
     */
    readonly fields: PromotionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PromotionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromotionLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AssetDefaultArgs<ExtArgs>>
    ): Prisma__AssetClient<
      $Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the PromotionLog model
   */
  interface PromotionLogFieldRefs {
    readonly id: FieldRef<'PromotionLog', 'Int'>;
    readonly assetId: FieldRef<'PromotionLog', 'Int'>;
    readonly action: FieldRef<'PromotionLog', 'String'>;
    readonly notes: FieldRef<'PromotionLog', 'String'>;
    readonly createdAt: FieldRef<'PromotionLog', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * PromotionLog findUnique
   */
  export type PromotionLogFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionLog to fetch.
     */
    where: PromotionLogWhereUniqueInput;
  };

  /**
   * PromotionLog findUniqueOrThrow
   */
  export type PromotionLogFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionLog to fetch.
     */
    where: PromotionLogWhereUniqueInput;
  };

  /**
   * PromotionLog findFirst
   */
  export type PromotionLogFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionLog to fetch.
     */
    where?: PromotionLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionLogs to fetch.
     */
    orderBy?: PromotionLogOrderByWithRelationInput | PromotionLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PromotionLogs.
     */
    cursor?: PromotionLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PromotionLogs.
     */
    distinct?: PromotionLogScalarFieldEnum | PromotionLogScalarFieldEnum[];
  };

  /**
   * PromotionLog findFirstOrThrow
   */
  export type PromotionLogFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionLog to fetch.
     */
    where?: PromotionLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionLogs to fetch.
     */
    orderBy?: PromotionLogOrderByWithRelationInput | PromotionLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PromotionLogs.
     */
    cursor?: PromotionLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PromotionLogs.
     */
    distinct?: PromotionLogScalarFieldEnum | PromotionLogScalarFieldEnum[];
  };

  /**
   * PromotionLog findMany
   */
  export type PromotionLogFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionLogs to fetch.
     */
    where?: PromotionLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionLogs to fetch.
     */
    orderBy?: PromotionLogOrderByWithRelationInput | PromotionLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PromotionLogs.
     */
    cursor?: PromotionLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionLogs.
     */
    skip?: number;
    distinct?: PromotionLogScalarFieldEnum | PromotionLogScalarFieldEnum[];
  };

  /**
   * PromotionLog create
   */
  export type PromotionLogCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * The data needed to create a PromotionLog.
     */
    data: XOR<PromotionLogCreateInput, PromotionLogUncheckedCreateInput>;
  };

  /**
   * PromotionLog createMany
   */
  export type PromotionLogCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PromotionLogs.
     */
    data: PromotionLogCreateManyInput | PromotionLogCreateManyInput[];
  };

  /**
   * PromotionLog createManyAndReturn
   */
  export type PromotionLogCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many PromotionLogs.
     */
    data: PromotionLogCreateManyInput | PromotionLogCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * PromotionLog update
   */
  export type PromotionLogUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * The data needed to update a PromotionLog.
     */
    data: XOR<PromotionLogUpdateInput, PromotionLogUncheckedUpdateInput>;
    /**
     * Choose, which PromotionLog to update.
     */
    where: PromotionLogWhereUniqueInput;
  };

  /**
   * PromotionLog updateMany
   */
  export type PromotionLogUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PromotionLogs.
     */
    data: XOR<PromotionLogUpdateManyMutationInput, PromotionLogUncheckedUpdateManyInput>;
    /**
     * Filter which PromotionLogs to update
     */
    where?: PromotionLogWhereInput;
  };

  /**
   * PromotionLog upsert
   */
  export type PromotionLogUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * The filter to search for the PromotionLog to update in case it exists.
     */
    where: PromotionLogWhereUniqueInput;
    /**
     * In case the PromotionLog found by the `where` argument doesn't exist, create a new PromotionLog with this data.
     */
    create: XOR<PromotionLogCreateInput, PromotionLogUncheckedCreateInput>;
    /**
     * In case the PromotionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromotionLogUpdateInput, PromotionLogUncheckedUpdateInput>;
  };

  /**
   * PromotionLog delete
   */
  export type PromotionLogDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
    /**
     * Filter which PromotionLog to delete.
     */
    where: PromotionLogWhereUniqueInput;
  };

  /**
   * PromotionLog deleteMany
   */
  export type PromotionLogDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PromotionLogs to delete
     */
    where?: PromotionLogWhereInput;
  };

  /**
   * PromotionLog without action
   */
  export type PromotionLogDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PromotionLog
     */
    select?: PromotionLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionLogInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const AssetScalarFieldEnum: {
    id: 'id';
    name: 'name';
    kind: 'kind';
    category: 'category';
    subcategory: 'subcategory';
    sourcePath: 'sourcePath';
    sourceLine: 'sourceLine';
    description: 'description';
    value: 'value';
    importPath: 'importPath';
    previewHtml: 'previewHtml';
    promoted: 'promoted';
    deprecated: 'deprecated';
    chromeStandard: 'chromeStandard';
    dashboardCode: 'dashboardCode';
    mockupSource: 'mockupSource';
    behaviorsJson: 'behaviorsJson';
    colorTokensJson: 'colorTokensJson';
    subElementsJson: 'subElementsJson';
    notes: 'notes';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type AssetScalarFieldEnum =
    (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum];

  export const VariantScalarFieldEnum: {
    id: 'id';
    assetId: 'assetId';
    name: 'name';
    modifier: 'modifier';
    propsJson: 'propsJson';
    previewHtml: 'previewHtml';
    notes: 'notes';
    createdAt: 'createdAt';
  };

  export type VariantScalarFieldEnum =
    (typeof VariantScalarFieldEnum)[keyof typeof VariantScalarFieldEnum];

  export const TagScalarFieldEnum: {
    id: 'id';
    name: 'name';
    color: 'color';
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum];

  export const AssetTagScalarFieldEnum: {
    assetId: 'assetId';
    tagId: 'tagId';
  };

  export type AssetTagScalarFieldEnum =
    (typeof AssetTagScalarFieldEnum)[keyof typeof AssetTagScalarFieldEnum];

  export const PromotionLogScalarFieldEnum: {
    id: 'id';
    assetId: 'assetId';
    action: 'action';
    notes: 'notes';
    createdAt: 'createdAt';
  };

  export type PromotionLogScalarFieldEnum =
    (typeof PromotionLogScalarFieldEnum)[keyof typeof PromotionLogScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

  /**
   * Deep Input Types
   */

  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[];
    OR?: AssetWhereInput[];
    NOT?: AssetWhereInput | AssetWhereInput[];
    id?: IntFilter<'Asset'> | number;
    name?: StringFilter<'Asset'> | string;
    kind?: StringFilter<'Asset'> | string;
    category?: StringNullableFilter<'Asset'> | string | null;
    subcategory?: StringNullableFilter<'Asset'> | string | null;
    sourcePath?: StringNullableFilter<'Asset'> | string | null;
    sourceLine?: IntNullableFilter<'Asset'> | number | null;
    description?: StringNullableFilter<'Asset'> | string | null;
    value?: StringNullableFilter<'Asset'> | string | null;
    importPath?: StringNullableFilter<'Asset'> | string | null;
    previewHtml?: StringNullableFilter<'Asset'> | string | null;
    promoted?: BoolFilter<'Asset'> | boolean;
    deprecated?: BoolFilter<'Asset'> | boolean;
    chromeStandard?: BoolFilter<'Asset'> | boolean;
    dashboardCode?: StringNullableFilter<'Asset'> | string | null;
    mockupSource?: StringNullableFilter<'Asset'> | string | null;
    behaviorsJson?: StringNullableFilter<'Asset'> | string | null;
    colorTokensJson?: StringNullableFilter<'Asset'> | string | null;
    subElementsJson?: StringNullableFilter<'Asset'> | string | null;
    notes?: StringNullableFilter<'Asset'> | string | null;
    createdAt?: DateTimeFilter<'Asset'> | Date | string;
    updatedAt?: DateTimeFilter<'Asset'> | Date | string;
    variants?: VariantListRelationFilter;
    tags?: AssetTagListRelationFilter;
    promotionLogs?: PromotionLogListRelationFilter;
  };

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    kind?: SortOrder;
    category?: SortOrderInput | SortOrder;
    subcategory?: SortOrderInput | SortOrder;
    sourcePath?: SortOrderInput | SortOrder;
    sourceLine?: SortOrderInput | SortOrder;
    description?: SortOrderInput | SortOrder;
    value?: SortOrderInput | SortOrder;
    importPath?: SortOrderInput | SortOrder;
    previewHtml?: SortOrderInput | SortOrder;
    promoted?: SortOrder;
    deprecated?: SortOrder;
    chromeStandard?: SortOrder;
    dashboardCode?: SortOrderInput | SortOrder;
    mockupSource?: SortOrderInput | SortOrder;
    behaviorsJson?: SortOrderInput | SortOrder;
    colorTokensJson?: SortOrderInput | SortOrder;
    subElementsJson?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    variants?: VariantOrderByRelationAggregateInput;
    tags?: AssetTagOrderByRelationAggregateInput;
    promotionLogs?: PromotionLogOrderByRelationAggregateInput;
  };

  export type AssetWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      name?: string;
      AND?: AssetWhereInput | AssetWhereInput[];
      OR?: AssetWhereInput[];
      NOT?: AssetWhereInput | AssetWhereInput[];
      kind?: StringFilter<'Asset'> | string;
      category?: StringNullableFilter<'Asset'> | string | null;
      subcategory?: StringNullableFilter<'Asset'> | string | null;
      sourcePath?: StringNullableFilter<'Asset'> | string | null;
      sourceLine?: IntNullableFilter<'Asset'> | number | null;
      description?: StringNullableFilter<'Asset'> | string | null;
      value?: StringNullableFilter<'Asset'> | string | null;
      importPath?: StringNullableFilter<'Asset'> | string | null;
      previewHtml?: StringNullableFilter<'Asset'> | string | null;
      promoted?: BoolFilter<'Asset'> | boolean;
      deprecated?: BoolFilter<'Asset'> | boolean;
      chromeStandard?: BoolFilter<'Asset'> | boolean;
      dashboardCode?: StringNullableFilter<'Asset'> | string | null;
      mockupSource?: StringNullableFilter<'Asset'> | string | null;
      behaviorsJson?: StringNullableFilter<'Asset'> | string | null;
      colorTokensJson?: StringNullableFilter<'Asset'> | string | null;
      subElementsJson?: StringNullableFilter<'Asset'> | string | null;
      notes?: StringNullableFilter<'Asset'> | string | null;
      createdAt?: DateTimeFilter<'Asset'> | Date | string;
      updatedAt?: DateTimeFilter<'Asset'> | Date | string;
      variants?: VariantListRelationFilter;
      tags?: AssetTagListRelationFilter;
      promotionLogs?: PromotionLogListRelationFilter;
    },
    'id' | 'name'
  >;

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    kind?: SortOrder;
    category?: SortOrderInput | SortOrder;
    subcategory?: SortOrderInput | SortOrder;
    sourcePath?: SortOrderInput | SortOrder;
    sourceLine?: SortOrderInput | SortOrder;
    description?: SortOrderInput | SortOrder;
    value?: SortOrderInput | SortOrder;
    importPath?: SortOrderInput | SortOrder;
    previewHtml?: SortOrderInput | SortOrder;
    promoted?: SortOrder;
    deprecated?: SortOrder;
    chromeStandard?: SortOrder;
    dashboardCode?: SortOrderInput | SortOrder;
    mockupSource?: SortOrderInput | SortOrder;
    behaviorsJson?: SortOrderInput | SortOrder;
    colorTokensJson?: SortOrderInput | SortOrder;
    subElementsJson?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AssetCountOrderByAggregateInput;
    _avg?: AssetAvgOrderByAggregateInput;
    _max?: AssetMaxOrderByAggregateInput;
    _min?: AssetMinOrderByAggregateInput;
    _sum?: AssetSumOrderByAggregateInput;
  };

  export type AssetScalarWhereWithAggregatesInput = {
    AND?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[];
    OR?: AssetScalarWhereWithAggregatesInput[];
    NOT?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<'Asset'> | number;
    name?: StringWithAggregatesFilter<'Asset'> | string;
    kind?: StringWithAggregatesFilter<'Asset'> | string;
    category?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    subcategory?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    sourcePath?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    sourceLine?: IntNullableWithAggregatesFilter<'Asset'> | number | null;
    description?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    value?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    importPath?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    previewHtml?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    promoted?: BoolWithAggregatesFilter<'Asset'> | boolean;
    deprecated?: BoolWithAggregatesFilter<'Asset'> | boolean;
    chromeStandard?: BoolWithAggregatesFilter<'Asset'> | boolean;
    dashboardCode?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    mockupSource?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    behaviorsJson?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    colorTokensJson?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    subElementsJson?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    notes?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Asset'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Asset'> | Date | string;
  };

  export type VariantWhereInput = {
    AND?: VariantWhereInput | VariantWhereInput[];
    OR?: VariantWhereInput[];
    NOT?: VariantWhereInput | VariantWhereInput[];
    id?: IntFilter<'Variant'> | number;
    assetId?: IntFilter<'Variant'> | number;
    name?: StringFilter<'Variant'> | string;
    modifier?: StringNullableFilter<'Variant'> | string | null;
    propsJson?: StringNullableFilter<'Variant'> | string | null;
    previewHtml?: StringNullableFilter<'Variant'> | string | null;
    notes?: StringNullableFilter<'Variant'> | string | null;
    createdAt?: DateTimeFilter<'Variant'> | Date | string;
    asset?: XOR<AssetRelationFilter, AssetWhereInput>;
  };

  export type VariantOrderByWithRelationInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    name?: SortOrder;
    modifier?: SortOrderInput | SortOrder;
    propsJson?: SortOrderInput | SortOrder;
    previewHtml?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    asset?: AssetOrderByWithRelationInput;
  };

  export type VariantWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      AND?: VariantWhereInput | VariantWhereInput[];
      OR?: VariantWhereInput[];
      NOT?: VariantWhereInput | VariantWhereInput[];
      assetId?: IntFilter<'Variant'> | number;
      name?: StringFilter<'Variant'> | string;
      modifier?: StringNullableFilter<'Variant'> | string | null;
      propsJson?: StringNullableFilter<'Variant'> | string | null;
      previewHtml?: StringNullableFilter<'Variant'> | string | null;
      notes?: StringNullableFilter<'Variant'> | string | null;
      createdAt?: DateTimeFilter<'Variant'> | Date | string;
      asset?: XOR<AssetRelationFilter, AssetWhereInput>;
    },
    'id'
  >;

  export type VariantOrderByWithAggregationInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    name?: SortOrder;
    modifier?: SortOrderInput | SortOrder;
    propsJson?: SortOrderInput | SortOrder;
    previewHtml?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: VariantCountOrderByAggregateInput;
    _avg?: VariantAvgOrderByAggregateInput;
    _max?: VariantMaxOrderByAggregateInput;
    _min?: VariantMinOrderByAggregateInput;
    _sum?: VariantSumOrderByAggregateInput;
  };

  export type VariantScalarWhereWithAggregatesInput = {
    AND?: VariantScalarWhereWithAggregatesInput | VariantScalarWhereWithAggregatesInput[];
    OR?: VariantScalarWhereWithAggregatesInput[];
    NOT?: VariantScalarWhereWithAggregatesInput | VariantScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<'Variant'> | number;
    assetId?: IntWithAggregatesFilter<'Variant'> | number;
    name?: StringWithAggregatesFilter<'Variant'> | string;
    modifier?: StringNullableWithAggregatesFilter<'Variant'> | string | null;
    propsJson?: StringNullableWithAggregatesFilter<'Variant'> | string | null;
    previewHtml?: StringNullableWithAggregatesFilter<'Variant'> | string | null;
    notes?: StringNullableWithAggregatesFilter<'Variant'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Variant'> | Date | string;
  };

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[];
    OR?: TagWhereInput[];
    NOT?: TagWhereInput | TagWhereInput[];
    id?: IntFilter<'Tag'> | number;
    name?: StringFilter<'Tag'> | string;
    color?: StringNullableFilter<'Tag'> | string | null;
    assets?: AssetTagListRelationFilter;
  };

  export type TagOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    color?: SortOrderInput | SortOrder;
    assets?: AssetTagOrderByRelationAggregateInput;
  };

  export type TagWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      name?: string;
      AND?: TagWhereInput | TagWhereInput[];
      OR?: TagWhereInput[];
      NOT?: TagWhereInput | TagWhereInput[];
      color?: StringNullableFilter<'Tag'> | string | null;
      assets?: AssetTagListRelationFilter;
    },
    'id' | 'name'
  >;

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    color?: SortOrderInput | SortOrder;
    _count?: TagCountOrderByAggregateInput;
    _avg?: TagAvgOrderByAggregateInput;
    _max?: TagMaxOrderByAggregateInput;
    _min?: TagMinOrderByAggregateInput;
    _sum?: TagSumOrderByAggregateInput;
  };

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[];
    OR?: TagScalarWhereWithAggregatesInput[];
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<'Tag'> | number;
    name?: StringWithAggregatesFilter<'Tag'> | string;
    color?: StringNullableWithAggregatesFilter<'Tag'> | string | null;
  };

  export type AssetTagWhereInput = {
    AND?: AssetTagWhereInput | AssetTagWhereInput[];
    OR?: AssetTagWhereInput[];
    NOT?: AssetTagWhereInput | AssetTagWhereInput[];
    assetId?: IntFilter<'AssetTag'> | number;
    tagId?: IntFilter<'AssetTag'> | number;
    asset?: XOR<AssetRelationFilter, AssetWhereInput>;
    tag?: XOR<TagRelationFilter, TagWhereInput>;
  };

  export type AssetTagOrderByWithRelationInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
    asset?: AssetOrderByWithRelationInput;
    tag?: TagOrderByWithRelationInput;
  };

  export type AssetTagWhereUniqueInput = Prisma.AtLeast<
    {
      assetId_tagId?: AssetTagAssetIdTagIdCompoundUniqueInput;
      AND?: AssetTagWhereInput | AssetTagWhereInput[];
      OR?: AssetTagWhereInput[];
      NOT?: AssetTagWhereInput | AssetTagWhereInput[];
      assetId?: IntFilter<'AssetTag'> | number;
      tagId?: IntFilter<'AssetTag'> | number;
      asset?: XOR<AssetRelationFilter, AssetWhereInput>;
      tag?: XOR<TagRelationFilter, TagWhereInput>;
    },
    'assetId_tagId'
  >;

  export type AssetTagOrderByWithAggregationInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
    _count?: AssetTagCountOrderByAggregateInput;
    _avg?: AssetTagAvgOrderByAggregateInput;
    _max?: AssetTagMaxOrderByAggregateInput;
    _min?: AssetTagMinOrderByAggregateInput;
    _sum?: AssetTagSumOrderByAggregateInput;
  };

  export type AssetTagScalarWhereWithAggregatesInput = {
    AND?: AssetTagScalarWhereWithAggregatesInput | AssetTagScalarWhereWithAggregatesInput[];
    OR?: AssetTagScalarWhereWithAggregatesInput[];
    NOT?: AssetTagScalarWhereWithAggregatesInput | AssetTagScalarWhereWithAggregatesInput[];
    assetId?: IntWithAggregatesFilter<'AssetTag'> | number;
    tagId?: IntWithAggregatesFilter<'AssetTag'> | number;
  };

  export type PromotionLogWhereInput = {
    AND?: PromotionLogWhereInput | PromotionLogWhereInput[];
    OR?: PromotionLogWhereInput[];
    NOT?: PromotionLogWhereInput | PromotionLogWhereInput[];
    id?: IntFilter<'PromotionLog'> | number;
    assetId?: IntFilter<'PromotionLog'> | number;
    action?: StringFilter<'PromotionLog'> | string;
    notes?: StringNullableFilter<'PromotionLog'> | string | null;
    createdAt?: DateTimeFilter<'PromotionLog'> | Date | string;
    asset?: XOR<AssetRelationFilter, AssetWhereInput>;
  };

  export type PromotionLogOrderByWithRelationInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    action?: SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    asset?: AssetOrderByWithRelationInput;
  };

  export type PromotionLogWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      AND?: PromotionLogWhereInput | PromotionLogWhereInput[];
      OR?: PromotionLogWhereInput[];
      NOT?: PromotionLogWhereInput | PromotionLogWhereInput[];
      assetId?: IntFilter<'PromotionLog'> | number;
      action?: StringFilter<'PromotionLog'> | string;
      notes?: StringNullableFilter<'PromotionLog'> | string | null;
      createdAt?: DateTimeFilter<'PromotionLog'> | Date | string;
      asset?: XOR<AssetRelationFilter, AssetWhereInput>;
    },
    'id'
  >;

  export type PromotionLogOrderByWithAggregationInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    action?: SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: PromotionLogCountOrderByAggregateInput;
    _avg?: PromotionLogAvgOrderByAggregateInput;
    _max?: PromotionLogMaxOrderByAggregateInput;
    _min?: PromotionLogMinOrderByAggregateInput;
    _sum?: PromotionLogSumOrderByAggregateInput;
  };

  export type PromotionLogScalarWhereWithAggregatesInput = {
    AND?: PromotionLogScalarWhereWithAggregatesInput | PromotionLogScalarWhereWithAggregatesInput[];
    OR?: PromotionLogScalarWhereWithAggregatesInput[];
    NOT?: PromotionLogScalarWhereWithAggregatesInput | PromotionLogScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<'PromotionLog'> | number;
    assetId?: IntWithAggregatesFilter<'PromotionLog'> | number;
    action?: StringWithAggregatesFilter<'PromotionLog'> | string;
    notes?: StringNullableWithAggregatesFilter<'PromotionLog'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'PromotionLog'> | Date | string;
  };

  export type AssetCreateInput = {
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    variants?: VariantCreateNestedManyWithoutAssetInput;
    tags?: AssetTagCreateNestedManyWithoutAssetInput;
    promotionLogs?: PromotionLogCreateNestedManyWithoutAssetInput;
  };

  export type AssetUncheckedCreateInput = {
    id?: number;
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    variants?: VariantUncheckedCreateNestedManyWithoutAssetInput;
    tags?: AssetTagUncheckedCreateNestedManyWithoutAssetInput;
    promotionLogs?: PromotionLogUncheckedCreateNestedManyWithoutAssetInput;
  };

  export type AssetUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: VariantUpdateManyWithoutAssetNestedInput;
    tags?: AssetTagUpdateManyWithoutAssetNestedInput;
    promotionLogs?: PromotionLogUpdateManyWithoutAssetNestedInput;
  };

  export type AssetUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: VariantUncheckedUpdateManyWithoutAssetNestedInput;
    tags?: AssetTagUncheckedUpdateManyWithoutAssetNestedInput;
    promotionLogs?: PromotionLogUncheckedUpdateManyWithoutAssetNestedInput;
  };

  export type AssetCreateManyInput = {
    id?: number;
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AssetUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AssetUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VariantCreateInput = {
    name: string;
    modifier?: string | null;
    propsJson?: string | null;
    previewHtml?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    asset: AssetCreateNestedOneWithoutVariantsInput;
  };

  export type VariantUncheckedCreateInput = {
    id?: number;
    assetId: number;
    name: string;
    modifier?: string | null;
    propsJson?: string | null;
    previewHtml?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type VariantUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    asset?: AssetUpdateOneRequiredWithoutVariantsNestedInput;
  };

  export type VariantUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    assetId?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VariantCreateManyInput = {
    id?: number;
    assetId: number;
    name: string;
    modifier?: string | null;
    propsJson?: string | null;
    previewHtml?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type VariantUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VariantUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    assetId?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TagCreateInput = {
    name: string;
    color?: string | null;
    assets?: AssetTagCreateNestedManyWithoutTagInput;
  };

  export type TagUncheckedCreateInput = {
    id?: number;
    name: string;
    color?: string | null;
    assets?: AssetTagUncheckedCreateNestedManyWithoutTagInput;
  };

  export type TagUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    assets?: AssetTagUpdateManyWithoutTagNestedInput;
  };

  export type TagUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    assets?: AssetTagUncheckedUpdateManyWithoutTagNestedInput;
  };

  export type TagCreateManyInput = {
    id?: number;
    name: string;
    color?: string | null;
  };

  export type TagUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type TagUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AssetTagCreateInput = {
    asset: AssetCreateNestedOneWithoutTagsInput;
    tag: TagCreateNestedOneWithoutAssetsInput;
  };

  export type AssetTagUncheckedCreateInput = {
    assetId: number;
    tagId: number;
  };

  export type AssetTagUpdateInput = {
    asset?: AssetUpdateOneRequiredWithoutTagsNestedInput;
    tag?: TagUpdateOneRequiredWithoutAssetsNestedInput;
  };

  export type AssetTagUncheckedUpdateInput = {
    assetId?: IntFieldUpdateOperationsInput | number;
    tagId?: IntFieldUpdateOperationsInput | number;
  };

  export type AssetTagCreateManyInput = {
    assetId: number;
    tagId: number;
  };

  export type AssetTagUpdateManyMutationInput = {};

  export type AssetTagUncheckedUpdateManyInput = {
    assetId?: IntFieldUpdateOperationsInput | number;
    tagId?: IntFieldUpdateOperationsInput | number;
  };

  export type PromotionLogCreateInput = {
    action: string;
    notes?: string | null;
    createdAt?: Date | string;
    asset: AssetCreateNestedOneWithoutPromotionLogsInput;
  };

  export type PromotionLogUncheckedCreateInput = {
    id?: number;
    assetId: number;
    action: string;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type PromotionLogUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    asset?: AssetUpdateOneRequiredWithoutPromotionLogsNestedInput;
  };

  export type PromotionLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    assetId?: IntFieldUpdateOperationsInput | number;
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PromotionLogCreateManyInput = {
    id?: number;
    assetId: number;
    action: string;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type PromotionLogUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PromotionLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    assetId?: IntFieldUpdateOperationsInput | number;
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type VariantListRelationFilter = {
    every?: VariantWhereInput;
    some?: VariantWhereInput;
    none?: VariantWhereInput;
  };

  export type AssetTagListRelationFilter = {
    every?: AssetTagWhereInput;
    some?: AssetTagWhereInput;
    none?: AssetTagWhereInput;
  };

  export type PromotionLogListRelationFilter = {
    every?: PromotionLogWhereInput;
    some?: PromotionLogWhereInput;
    none?: PromotionLogWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type VariantOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AssetTagOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type PromotionLogOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    kind?: SortOrder;
    category?: SortOrder;
    subcategory?: SortOrder;
    sourcePath?: SortOrder;
    sourceLine?: SortOrder;
    description?: SortOrder;
    value?: SortOrder;
    importPath?: SortOrder;
    previewHtml?: SortOrder;
    promoted?: SortOrder;
    deprecated?: SortOrder;
    chromeStandard?: SortOrder;
    dashboardCode?: SortOrder;
    mockupSource?: SortOrder;
    behaviorsJson?: SortOrder;
    colorTokensJson?: SortOrder;
    subElementsJson?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AssetAvgOrderByAggregateInput = {
    id?: SortOrder;
    sourceLine?: SortOrder;
  };

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    kind?: SortOrder;
    category?: SortOrder;
    subcategory?: SortOrder;
    sourcePath?: SortOrder;
    sourceLine?: SortOrder;
    description?: SortOrder;
    value?: SortOrder;
    importPath?: SortOrder;
    previewHtml?: SortOrder;
    promoted?: SortOrder;
    deprecated?: SortOrder;
    chromeStandard?: SortOrder;
    dashboardCode?: SortOrder;
    mockupSource?: SortOrder;
    behaviorsJson?: SortOrder;
    colorTokensJson?: SortOrder;
    subElementsJson?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    kind?: SortOrder;
    category?: SortOrder;
    subcategory?: SortOrder;
    sourcePath?: SortOrder;
    sourceLine?: SortOrder;
    description?: SortOrder;
    value?: SortOrder;
    importPath?: SortOrder;
    previewHtml?: SortOrder;
    promoted?: SortOrder;
    deprecated?: SortOrder;
    chromeStandard?: SortOrder;
    dashboardCode?: SortOrder;
    mockupSource?: SortOrder;
    behaviorsJson?: SortOrder;
    colorTokensJson?: SortOrder;
    subElementsJson?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AssetSumOrderByAggregateInput = {
    id?: SortOrder;
    sourceLine?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type AssetRelationFilter = {
    is?: AssetWhereInput;
    isNot?: AssetWhereInput;
  };

  export type VariantCountOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    name?: SortOrder;
    modifier?: SortOrder;
    propsJson?: SortOrder;
    previewHtml?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
  };

  export type VariantAvgOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
  };

  export type VariantMaxOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    name?: SortOrder;
    modifier?: SortOrder;
    propsJson?: SortOrder;
    previewHtml?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
  };

  export type VariantMinOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    name?: SortOrder;
    modifier?: SortOrder;
    propsJson?: SortOrder;
    previewHtml?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
  };

  export type VariantSumOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
  };

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    color?: SortOrder;
  };

  export type TagAvgOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    color?: SortOrder;
  };

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    color?: SortOrder;
  };

  export type TagSumOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type TagRelationFilter = {
    is?: TagWhereInput;
    isNot?: TagWhereInput;
  };

  export type AssetTagAssetIdTagIdCompoundUniqueInput = {
    assetId: number;
    tagId: number;
  };

  export type AssetTagCountOrderByAggregateInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
  };

  export type AssetTagAvgOrderByAggregateInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
  };

  export type AssetTagMaxOrderByAggregateInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
  };

  export type AssetTagMinOrderByAggregateInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
  };

  export type AssetTagSumOrderByAggregateInput = {
    assetId?: SortOrder;
    tagId?: SortOrder;
  };

  export type PromotionLogCountOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    action?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
  };

  export type PromotionLogAvgOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
  };

  export type PromotionLogMaxOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    action?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
  };

  export type PromotionLogMinOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
    action?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
  };

  export type PromotionLogSumOrderByAggregateInput = {
    id?: SortOrder;
    assetId?: SortOrder;
  };

  export type VariantCreateNestedManyWithoutAssetInput = {
    create?:
      | XOR<VariantCreateWithoutAssetInput, VariantUncheckedCreateWithoutAssetInput>
      | VariantCreateWithoutAssetInput[]
      | VariantUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | VariantCreateOrConnectWithoutAssetInput
      | VariantCreateOrConnectWithoutAssetInput[];
    createMany?: VariantCreateManyAssetInputEnvelope;
    connect?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
  };

  export type AssetTagCreateNestedManyWithoutAssetInput = {
    create?:
      | XOR<AssetTagCreateWithoutAssetInput, AssetTagUncheckedCreateWithoutAssetInput>
      | AssetTagCreateWithoutAssetInput[]
      | AssetTagUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutAssetInput
      | AssetTagCreateOrConnectWithoutAssetInput[];
    createMany?: AssetTagCreateManyAssetInputEnvelope;
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
  };

  export type PromotionLogCreateNestedManyWithoutAssetInput = {
    create?:
      | XOR<PromotionLogCreateWithoutAssetInput, PromotionLogUncheckedCreateWithoutAssetInput>
      | PromotionLogCreateWithoutAssetInput[]
      | PromotionLogUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | PromotionLogCreateOrConnectWithoutAssetInput
      | PromotionLogCreateOrConnectWithoutAssetInput[];
    createMany?: PromotionLogCreateManyAssetInputEnvelope;
    connect?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
  };

  export type VariantUncheckedCreateNestedManyWithoutAssetInput = {
    create?:
      | XOR<VariantCreateWithoutAssetInput, VariantUncheckedCreateWithoutAssetInput>
      | VariantCreateWithoutAssetInput[]
      | VariantUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | VariantCreateOrConnectWithoutAssetInput
      | VariantCreateOrConnectWithoutAssetInput[];
    createMany?: VariantCreateManyAssetInputEnvelope;
    connect?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
  };

  export type AssetTagUncheckedCreateNestedManyWithoutAssetInput = {
    create?:
      | XOR<AssetTagCreateWithoutAssetInput, AssetTagUncheckedCreateWithoutAssetInput>
      | AssetTagCreateWithoutAssetInput[]
      | AssetTagUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutAssetInput
      | AssetTagCreateOrConnectWithoutAssetInput[];
    createMany?: AssetTagCreateManyAssetInputEnvelope;
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
  };

  export type PromotionLogUncheckedCreateNestedManyWithoutAssetInput = {
    create?:
      | XOR<PromotionLogCreateWithoutAssetInput, PromotionLogUncheckedCreateWithoutAssetInput>
      | PromotionLogCreateWithoutAssetInput[]
      | PromotionLogUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | PromotionLogCreateOrConnectWithoutAssetInput
      | PromotionLogCreateOrConnectWithoutAssetInput[];
    createMany?: PromotionLogCreateManyAssetInputEnvelope;
    connect?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type VariantUpdateManyWithoutAssetNestedInput = {
    create?:
      | XOR<VariantCreateWithoutAssetInput, VariantUncheckedCreateWithoutAssetInput>
      | VariantCreateWithoutAssetInput[]
      | VariantUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | VariantCreateOrConnectWithoutAssetInput
      | VariantCreateOrConnectWithoutAssetInput[];
    upsert?:
      | VariantUpsertWithWhereUniqueWithoutAssetInput
      | VariantUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: VariantCreateManyAssetInputEnvelope;
    set?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    disconnect?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    delete?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    connect?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    update?:
      | VariantUpdateWithWhereUniqueWithoutAssetInput
      | VariantUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?:
      | VariantUpdateManyWithWhereWithoutAssetInput
      | VariantUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: VariantScalarWhereInput | VariantScalarWhereInput[];
  };

  export type AssetTagUpdateManyWithoutAssetNestedInput = {
    create?:
      | XOR<AssetTagCreateWithoutAssetInput, AssetTagUncheckedCreateWithoutAssetInput>
      | AssetTagCreateWithoutAssetInput[]
      | AssetTagUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutAssetInput
      | AssetTagCreateOrConnectWithoutAssetInput[];
    upsert?:
      | AssetTagUpsertWithWhereUniqueWithoutAssetInput
      | AssetTagUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: AssetTagCreateManyAssetInputEnvelope;
    set?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    disconnect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    delete?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    update?:
      | AssetTagUpdateWithWhereUniqueWithoutAssetInput
      | AssetTagUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?:
      | AssetTagUpdateManyWithWhereWithoutAssetInput
      | AssetTagUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: AssetTagScalarWhereInput | AssetTagScalarWhereInput[];
  };

  export type PromotionLogUpdateManyWithoutAssetNestedInput = {
    create?:
      | XOR<PromotionLogCreateWithoutAssetInput, PromotionLogUncheckedCreateWithoutAssetInput>
      | PromotionLogCreateWithoutAssetInput[]
      | PromotionLogUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | PromotionLogCreateOrConnectWithoutAssetInput
      | PromotionLogCreateOrConnectWithoutAssetInput[];
    upsert?:
      | PromotionLogUpsertWithWhereUniqueWithoutAssetInput
      | PromotionLogUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: PromotionLogCreateManyAssetInputEnvelope;
    set?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    disconnect?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    delete?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    connect?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    update?:
      | PromotionLogUpdateWithWhereUniqueWithoutAssetInput
      | PromotionLogUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?:
      | PromotionLogUpdateManyWithWhereWithoutAssetInput
      | PromotionLogUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: PromotionLogScalarWhereInput | PromotionLogScalarWhereInput[];
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type VariantUncheckedUpdateManyWithoutAssetNestedInput = {
    create?:
      | XOR<VariantCreateWithoutAssetInput, VariantUncheckedCreateWithoutAssetInput>
      | VariantCreateWithoutAssetInput[]
      | VariantUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | VariantCreateOrConnectWithoutAssetInput
      | VariantCreateOrConnectWithoutAssetInput[];
    upsert?:
      | VariantUpsertWithWhereUniqueWithoutAssetInput
      | VariantUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: VariantCreateManyAssetInputEnvelope;
    set?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    disconnect?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    delete?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    connect?: VariantWhereUniqueInput | VariantWhereUniqueInput[];
    update?:
      | VariantUpdateWithWhereUniqueWithoutAssetInput
      | VariantUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?:
      | VariantUpdateManyWithWhereWithoutAssetInput
      | VariantUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: VariantScalarWhereInput | VariantScalarWhereInput[];
  };

  export type AssetTagUncheckedUpdateManyWithoutAssetNestedInput = {
    create?:
      | XOR<AssetTagCreateWithoutAssetInput, AssetTagUncheckedCreateWithoutAssetInput>
      | AssetTagCreateWithoutAssetInput[]
      | AssetTagUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutAssetInput
      | AssetTagCreateOrConnectWithoutAssetInput[];
    upsert?:
      | AssetTagUpsertWithWhereUniqueWithoutAssetInput
      | AssetTagUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: AssetTagCreateManyAssetInputEnvelope;
    set?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    disconnect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    delete?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    update?:
      | AssetTagUpdateWithWhereUniqueWithoutAssetInput
      | AssetTagUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?:
      | AssetTagUpdateManyWithWhereWithoutAssetInput
      | AssetTagUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: AssetTagScalarWhereInput | AssetTagScalarWhereInput[];
  };

  export type PromotionLogUncheckedUpdateManyWithoutAssetNestedInput = {
    create?:
      | XOR<PromotionLogCreateWithoutAssetInput, PromotionLogUncheckedCreateWithoutAssetInput>
      | PromotionLogCreateWithoutAssetInput[]
      | PromotionLogUncheckedCreateWithoutAssetInput[];
    connectOrCreate?:
      | PromotionLogCreateOrConnectWithoutAssetInput
      | PromotionLogCreateOrConnectWithoutAssetInput[];
    upsert?:
      | PromotionLogUpsertWithWhereUniqueWithoutAssetInput
      | PromotionLogUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: PromotionLogCreateManyAssetInputEnvelope;
    set?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    disconnect?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    delete?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    connect?: PromotionLogWhereUniqueInput | PromotionLogWhereUniqueInput[];
    update?:
      | PromotionLogUpdateWithWhereUniqueWithoutAssetInput
      | PromotionLogUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?:
      | PromotionLogUpdateManyWithWhereWithoutAssetInput
      | PromotionLogUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: PromotionLogScalarWhereInput | PromotionLogScalarWhereInput[];
  };

  export type AssetCreateNestedOneWithoutVariantsInput = {
    create?: XOR<AssetCreateWithoutVariantsInput, AssetUncheckedCreateWithoutVariantsInput>;
    connectOrCreate?: AssetCreateOrConnectWithoutVariantsInput;
    connect?: AssetWhereUniqueInput;
  };

  export type AssetUpdateOneRequiredWithoutVariantsNestedInput = {
    create?: XOR<AssetCreateWithoutVariantsInput, AssetUncheckedCreateWithoutVariantsInput>;
    connectOrCreate?: AssetCreateOrConnectWithoutVariantsInput;
    upsert?: AssetUpsertWithoutVariantsInput;
    connect?: AssetWhereUniqueInput;
    update?: XOR<
      XOR<AssetUpdateToOneWithWhereWithoutVariantsInput, AssetUpdateWithoutVariantsInput>,
      AssetUncheckedUpdateWithoutVariantsInput
    >;
  };

  export type AssetTagCreateNestedManyWithoutTagInput = {
    create?:
      | XOR<AssetTagCreateWithoutTagInput, AssetTagUncheckedCreateWithoutTagInput>
      | AssetTagCreateWithoutTagInput[]
      | AssetTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutTagInput
      | AssetTagCreateOrConnectWithoutTagInput[];
    createMany?: AssetTagCreateManyTagInputEnvelope;
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
  };

  export type AssetTagUncheckedCreateNestedManyWithoutTagInput = {
    create?:
      | XOR<AssetTagCreateWithoutTagInput, AssetTagUncheckedCreateWithoutTagInput>
      | AssetTagCreateWithoutTagInput[]
      | AssetTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutTagInput
      | AssetTagCreateOrConnectWithoutTagInput[];
    createMany?: AssetTagCreateManyTagInputEnvelope;
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
  };

  export type AssetTagUpdateManyWithoutTagNestedInput = {
    create?:
      | XOR<AssetTagCreateWithoutTagInput, AssetTagUncheckedCreateWithoutTagInput>
      | AssetTagCreateWithoutTagInput[]
      | AssetTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutTagInput
      | AssetTagCreateOrConnectWithoutTagInput[];
    upsert?:
      | AssetTagUpsertWithWhereUniqueWithoutTagInput
      | AssetTagUpsertWithWhereUniqueWithoutTagInput[];
    createMany?: AssetTagCreateManyTagInputEnvelope;
    set?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    disconnect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    delete?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    update?:
      | AssetTagUpdateWithWhereUniqueWithoutTagInput
      | AssetTagUpdateWithWhereUniqueWithoutTagInput[];
    updateMany?:
      | AssetTagUpdateManyWithWhereWithoutTagInput
      | AssetTagUpdateManyWithWhereWithoutTagInput[];
    deleteMany?: AssetTagScalarWhereInput | AssetTagScalarWhereInput[];
  };

  export type AssetTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?:
      | XOR<AssetTagCreateWithoutTagInput, AssetTagUncheckedCreateWithoutTagInput>
      | AssetTagCreateWithoutTagInput[]
      | AssetTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?:
      | AssetTagCreateOrConnectWithoutTagInput
      | AssetTagCreateOrConnectWithoutTagInput[];
    upsert?:
      | AssetTagUpsertWithWhereUniqueWithoutTagInput
      | AssetTagUpsertWithWhereUniqueWithoutTagInput[];
    createMany?: AssetTagCreateManyTagInputEnvelope;
    set?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    disconnect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    delete?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    connect?: AssetTagWhereUniqueInput | AssetTagWhereUniqueInput[];
    update?:
      | AssetTagUpdateWithWhereUniqueWithoutTagInput
      | AssetTagUpdateWithWhereUniqueWithoutTagInput[];
    updateMany?:
      | AssetTagUpdateManyWithWhereWithoutTagInput
      | AssetTagUpdateManyWithWhereWithoutTagInput[];
    deleteMany?: AssetTagScalarWhereInput | AssetTagScalarWhereInput[];
  };

  export type AssetCreateNestedOneWithoutTagsInput = {
    create?: XOR<AssetCreateWithoutTagsInput, AssetUncheckedCreateWithoutTagsInput>;
    connectOrCreate?: AssetCreateOrConnectWithoutTagsInput;
    connect?: AssetWhereUniqueInput;
  };

  export type TagCreateNestedOneWithoutAssetsInput = {
    create?: XOR<TagCreateWithoutAssetsInput, TagUncheckedCreateWithoutAssetsInput>;
    connectOrCreate?: TagCreateOrConnectWithoutAssetsInput;
    connect?: TagWhereUniqueInput;
  };

  export type AssetUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<AssetCreateWithoutTagsInput, AssetUncheckedCreateWithoutTagsInput>;
    connectOrCreate?: AssetCreateOrConnectWithoutTagsInput;
    upsert?: AssetUpsertWithoutTagsInput;
    connect?: AssetWhereUniqueInput;
    update?: XOR<
      XOR<AssetUpdateToOneWithWhereWithoutTagsInput, AssetUpdateWithoutTagsInput>,
      AssetUncheckedUpdateWithoutTagsInput
    >;
  };

  export type TagUpdateOneRequiredWithoutAssetsNestedInput = {
    create?: XOR<TagCreateWithoutAssetsInput, TagUncheckedCreateWithoutAssetsInput>;
    connectOrCreate?: TagCreateOrConnectWithoutAssetsInput;
    upsert?: TagUpsertWithoutAssetsInput;
    connect?: TagWhereUniqueInput;
    update?: XOR<
      XOR<TagUpdateToOneWithWhereWithoutAssetsInput, TagUpdateWithoutAssetsInput>,
      TagUncheckedUpdateWithoutAssetsInput
    >;
  };

  export type AssetCreateNestedOneWithoutPromotionLogsInput = {
    create?: XOR<
      AssetCreateWithoutPromotionLogsInput,
      AssetUncheckedCreateWithoutPromotionLogsInput
    >;
    connectOrCreate?: AssetCreateOrConnectWithoutPromotionLogsInput;
    connect?: AssetWhereUniqueInput;
  };

  export type AssetUpdateOneRequiredWithoutPromotionLogsNestedInput = {
    create?: XOR<
      AssetCreateWithoutPromotionLogsInput,
      AssetUncheckedCreateWithoutPromotionLogsInput
    >;
    connectOrCreate?: AssetCreateOrConnectWithoutPromotionLogsInput;
    upsert?: AssetUpsertWithoutPromotionLogsInput;
    connect?: AssetWhereUniqueInput;
    update?: XOR<
      XOR<AssetUpdateToOneWithWhereWithoutPromotionLogsInput, AssetUpdateWithoutPromotionLogsInput>,
      AssetUncheckedUpdateWithoutPromotionLogsInput
    >;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type VariantCreateWithoutAssetInput = {
    name: string;
    modifier?: string | null;
    propsJson?: string | null;
    previewHtml?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type VariantUncheckedCreateWithoutAssetInput = {
    id?: number;
    name: string;
    modifier?: string | null;
    propsJson?: string | null;
    previewHtml?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type VariantCreateOrConnectWithoutAssetInput = {
    where: VariantWhereUniqueInput;
    create: XOR<VariantCreateWithoutAssetInput, VariantUncheckedCreateWithoutAssetInput>;
  };

  export type VariantCreateManyAssetInputEnvelope = {
    data: VariantCreateManyAssetInput | VariantCreateManyAssetInput[];
  };

  export type AssetTagCreateWithoutAssetInput = {
    tag: TagCreateNestedOneWithoutAssetsInput;
  };

  export type AssetTagUncheckedCreateWithoutAssetInput = {
    tagId: number;
  };

  export type AssetTagCreateOrConnectWithoutAssetInput = {
    where: AssetTagWhereUniqueInput;
    create: XOR<AssetTagCreateWithoutAssetInput, AssetTagUncheckedCreateWithoutAssetInput>;
  };

  export type AssetTagCreateManyAssetInputEnvelope = {
    data: AssetTagCreateManyAssetInput | AssetTagCreateManyAssetInput[];
  };

  export type PromotionLogCreateWithoutAssetInput = {
    action: string;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type PromotionLogUncheckedCreateWithoutAssetInput = {
    id?: number;
    action: string;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type PromotionLogCreateOrConnectWithoutAssetInput = {
    where: PromotionLogWhereUniqueInput;
    create: XOR<PromotionLogCreateWithoutAssetInput, PromotionLogUncheckedCreateWithoutAssetInput>;
  };

  export type PromotionLogCreateManyAssetInputEnvelope = {
    data: PromotionLogCreateManyAssetInput | PromotionLogCreateManyAssetInput[];
  };

  export type VariantUpsertWithWhereUniqueWithoutAssetInput = {
    where: VariantWhereUniqueInput;
    update: XOR<VariantUpdateWithoutAssetInput, VariantUncheckedUpdateWithoutAssetInput>;
    create: XOR<VariantCreateWithoutAssetInput, VariantUncheckedCreateWithoutAssetInput>;
  };

  export type VariantUpdateWithWhereUniqueWithoutAssetInput = {
    where: VariantWhereUniqueInput;
    data: XOR<VariantUpdateWithoutAssetInput, VariantUncheckedUpdateWithoutAssetInput>;
  };

  export type VariantUpdateManyWithWhereWithoutAssetInput = {
    where: VariantScalarWhereInput;
    data: XOR<VariantUpdateManyMutationInput, VariantUncheckedUpdateManyWithoutAssetInput>;
  };

  export type VariantScalarWhereInput = {
    AND?: VariantScalarWhereInput | VariantScalarWhereInput[];
    OR?: VariantScalarWhereInput[];
    NOT?: VariantScalarWhereInput | VariantScalarWhereInput[];
    id?: IntFilter<'Variant'> | number;
    assetId?: IntFilter<'Variant'> | number;
    name?: StringFilter<'Variant'> | string;
    modifier?: StringNullableFilter<'Variant'> | string | null;
    propsJson?: StringNullableFilter<'Variant'> | string | null;
    previewHtml?: StringNullableFilter<'Variant'> | string | null;
    notes?: StringNullableFilter<'Variant'> | string | null;
    createdAt?: DateTimeFilter<'Variant'> | Date | string;
  };

  export type AssetTagUpsertWithWhereUniqueWithoutAssetInput = {
    where: AssetTagWhereUniqueInput;
    update: XOR<AssetTagUpdateWithoutAssetInput, AssetTagUncheckedUpdateWithoutAssetInput>;
    create: XOR<AssetTagCreateWithoutAssetInput, AssetTagUncheckedCreateWithoutAssetInput>;
  };

  export type AssetTagUpdateWithWhereUniqueWithoutAssetInput = {
    where: AssetTagWhereUniqueInput;
    data: XOR<AssetTagUpdateWithoutAssetInput, AssetTagUncheckedUpdateWithoutAssetInput>;
  };

  export type AssetTagUpdateManyWithWhereWithoutAssetInput = {
    where: AssetTagScalarWhereInput;
    data: XOR<AssetTagUpdateManyMutationInput, AssetTagUncheckedUpdateManyWithoutAssetInput>;
  };

  export type AssetTagScalarWhereInput = {
    AND?: AssetTagScalarWhereInput | AssetTagScalarWhereInput[];
    OR?: AssetTagScalarWhereInput[];
    NOT?: AssetTagScalarWhereInput | AssetTagScalarWhereInput[];
    assetId?: IntFilter<'AssetTag'> | number;
    tagId?: IntFilter<'AssetTag'> | number;
  };

  export type PromotionLogUpsertWithWhereUniqueWithoutAssetInput = {
    where: PromotionLogWhereUniqueInput;
    update: XOR<PromotionLogUpdateWithoutAssetInput, PromotionLogUncheckedUpdateWithoutAssetInput>;
    create: XOR<PromotionLogCreateWithoutAssetInput, PromotionLogUncheckedCreateWithoutAssetInput>;
  };

  export type PromotionLogUpdateWithWhereUniqueWithoutAssetInput = {
    where: PromotionLogWhereUniqueInput;
    data: XOR<PromotionLogUpdateWithoutAssetInput, PromotionLogUncheckedUpdateWithoutAssetInput>;
  };

  export type PromotionLogUpdateManyWithWhereWithoutAssetInput = {
    where: PromotionLogScalarWhereInput;
    data: XOR<
      PromotionLogUpdateManyMutationInput,
      PromotionLogUncheckedUpdateManyWithoutAssetInput
    >;
  };

  export type PromotionLogScalarWhereInput = {
    AND?: PromotionLogScalarWhereInput | PromotionLogScalarWhereInput[];
    OR?: PromotionLogScalarWhereInput[];
    NOT?: PromotionLogScalarWhereInput | PromotionLogScalarWhereInput[];
    id?: IntFilter<'PromotionLog'> | number;
    assetId?: IntFilter<'PromotionLog'> | number;
    action?: StringFilter<'PromotionLog'> | string;
    notes?: StringNullableFilter<'PromotionLog'> | string | null;
    createdAt?: DateTimeFilter<'PromotionLog'> | Date | string;
  };

  export type AssetCreateWithoutVariantsInput = {
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tags?: AssetTagCreateNestedManyWithoutAssetInput;
    promotionLogs?: PromotionLogCreateNestedManyWithoutAssetInput;
  };

  export type AssetUncheckedCreateWithoutVariantsInput = {
    id?: number;
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tags?: AssetTagUncheckedCreateNestedManyWithoutAssetInput;
    promotionLogs?: PromotionLogUncheckedCreateNestedManyWithoutAssetInput;
  };

  export type AssetCreateOrConnectWithoutVariantsInput = {
    where: AssetWhereUniqueInput;
    create: XOR<AssetCreateWithoutVariantsInput, AssetUncheckedCreateWithoutVariantsInput>;
  };

  export type AssetUpsertWithoutVariantsInput = {
    update: XOR<AssetUpdateWithoutVariantsInput, AssetUncheckedUpdateWithoutVariantsInput>;
    create: XOR<AssetCreateWithoutVariantsInput, AssetUncheckedCreateWithoutVariantsInput>;
    where?: AssetWhereInput;
  };

  export type AssetUpdateToOneWithWhereWithoutVariantsInput = {
    where?: AssetWhereInput;
    data: XOR<AssetUpdateWithoutVariantsInput, AssetUncheckedUpdateWithoutVariantsInput>;
  };

  export type AssetUpdateWithoutVariantsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: AssetTagUpdateManyWithoutAssetNestedInput;
    promotionLogs?: PromotionLogUpdateManyWithoutAssetNestedInput;
  };

  export type AssetUncheckedUpdateWithoutVariantsInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tags?: AssetTagUncheckedUpdateManyWithoutAssetNestedInput;
    promotionLogs?: PromotionLogUncheckedUpdateManyWithoutAssetNestedInput;
  };

  export type AssetTagCreateWithoutTagInput = {
    asset: AssetCreateNestedOneWithoutTagsInput;
  };

  export type AssetTagUncheckedCreateWithoutTagInput = {
    assetId: number;
  };

  export type AssetTagCreateOrConnectWithoutTagInput = {
    where: AssetTagWhereUniqueInput;
    create: XOR<AssetTagCreateWithoutTagInput, AssetTagUncheckedCreateWithoutTagInput>;
  };

  export type AssetTagCreateManyTagInputEnvelope = {
    data: AssetTagCreateManyTagInput | AssetTagCreateManyTagInput[];
  };

  export type AssetTagUpsertWithWhereUniqueWithoutTagInput = {
    where: AssetTagWhereUniqueInput;
    update: XOR<AssetTagUpdateWithoutTagInput, AssetTagUncheckedUpdateWithoutTagInput>;
    create: XOR<AssetTagCreateWithoutTagInput, AssetTagUncheckedCreateWithoutTagInput>;
  };

  export type AssetTagUpdateWithWhereUniqueWithoutTagInput = {
    where: AssetTagWhereUniqueInput;
    data: XOR<AssetTagUpdateWithoutTagInput, AssetTagUncheckedUpdateWithoutTagInput>;
  };

  export type AssetTagUpdateManyWithWhereWithoutTagInput = {
    where: AssetTagScalarWhereInput;
    data: XOR<AssetTagUpdateManyMutationInput, AssetTagUncheckedUpdateManyWithoutTagInput>;
  };

  export type AssetCreateWithoutTagsInput = {
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    variants?: VariantCreateNestedManyWithoutAssetInput;
    promotionLogs?: PromotionLogCreateNestedManyWithoutAssetInput;
  };

  export type AssetUncheckedCreateWithoutTagsInput = {
    id?: number;
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    variants?: VariantUncheckedCreateNestedManyWithoutAssetInput;
    promotionLogs?: PromotionLogUncheckedCreateNestedManyWithoutAssetInput;
  };

  export type AssetCreateOrConnectWithoutTagsInput = {
    where: AssetWhereUniqueInput;
    create: XOR<AssetCreateWithoutTagsInput, AssetUncheckedCreateWithoutTagsInput>;
  };

  export type TagCreateWithoutAssetsInput = {
    name: string;
    color?: string | null;
  };

  export type TagUncheckedCreateWithoutAssetsInput = {
    id?: number;
    name: string;
    color?: string | null;
  };

  export type TagCreateOrConnectWithoutAssetsInput = {
    where: TagWhereUniqueInput;
    create: XOR<TagCreateWithoutAssetsInput, TagUncheckedCreateWithoutAssetsInput>;
  };

  export type AssetUpsertWithoutTagsInput = {
    update: XOR<AssetUpdateWithoutTagsInput, AssetUncheckedUpdateWithoutTagsInput>;
    create: XOR<AssetCreateWithoutTagsInput, AssetUncheckedCreateWithoutTagsInput>;
    where?: AssetWhereInput;
  };

  export type AssetUpdateToOneWithWhereWithoutTagsInput = {
    where?: AssetWhereInput;
    data: XOR<AssetUpdateWithoutTagsInput, AssetUncheckedUpdateWithoutTagsInput>;
  };

  export type AssetUpdateWithoutTagsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: VariantUpdateManyWithoutAssetNestedInput;
    promotionLogs?: PromotionLogUpdateManyWithoutAssetNestedInput;
  };

  export type AssetUncheckedUpdateWithoutTagsInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: VariantUncheckedUpdateManyWithoutAssetNestedInput;
    promotionLogs?: PromotionLogUncheckedUpdateManyWithoutAssetNestedInput;
  };

  export type TagUpsertWithoutAssetsInput = {
    update: XOR<TagUpdateWithoutAssetsInput, TagUncheckedUpdateWithoutAssetsInput>;
    create: XOR<TagCreateWithoutAssetsInput, TagUncheckedCreateWithoutAssetsInput>;
    where?: TagWhereInput;
  };

  export type TagUpdateToOneWithWhereWithoutAssetsInput = {
    where?: TagWhereInput;
    data: XOR<TagUpdateWithoutAssetsInput, TagUncheckedUpdateWithoutAssetsInput>;
  };

  export type TagUpdateWithoutAssetsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type TagUncheckedUpdateWithoutAssetsInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AssetCreateWithoutPromotionLogsInput = {
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    variants?: VariantCreateNestedManyWithoutAssetInput;
    tags?: AssetTagCreateNestedManyWithoutAssetInput;
  };

  export type AssetUncheckedCreateWithoutPromotionLogsInput = {
    id?: number;
    name: string;
    kind: string;
    category?: string | null;
    subcategory?: string | null;
    sourcePath?: string | null;
    sourceLine?: number | null;
    description?: string | null;
    value?: string | null;
    importPath?: string | null;
    previewHtml?: string | null;
    promoted?: boolean;
    deprecated?: boolean;
    chromeStandard?: boolean;
    dashboardCode?: string | null;
    mockupSource?: string | null;
    behaviorsJson?: string | null;
    colorTokensJson?: string | null;
    subElementsJson?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    variants?: VariantUncheckedCreateNestedManyWithoutAssetInput;
    tags?: AssetTagUncheckedCreateNestedManyWithoutAssetInput;
  };

  export type AssetCreateOrConnectWithoutPromotionLogsInput = {
    where: AssetWhereUniqueInput;
    create: XOR<
      AssetCreateWithoutPromotionLogsInput,
      AssetUncheckedCreateWithoutPromotionLogsInput
    >;
  };

  export type AssetUpsertWithoutPromotionLogsInput = {
    update: XOR<
      AssetUpdateWithoutPromotionLogsInput,
      AssetUncheckedUpdateWithoutPromotionLogsInput
    >;
    create: XOR<
      AssetCreateWithoutPromotionLogsInput,
      AssetUncheckedCreateWithoutPromotionLogsInput
    >;
    where?: AssetWhereInput;
  };

  export type AssetUpdateToOneWithWhereWithoutPromotionLogsInput = {
    where?: AssetWhereInput;
    data: XOR<AssetUpdateWithoutPromotionLogsInput, AssetUncheckedUpdateWithoutPromotionLogsInput>;
  };

  export type AssetUpdateWithoutPromotionLogsInput = {
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: VariantUpdateManyWithoutAssetNestedInput;
    tags?: AssetTagUpdateManyWithoutAssetNestedInput;
  };

  export type AssetUncheckedUpdateWithoutPromotionLogsInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    kind?: StringFieldUpdateOperationsInput | string;
    category?: NullableStringFieldUpdateOperationsInput | string | null;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    sourcePath?: NullableStringFieldUpdateOperationsInput | string | null;
    sourceLine?: NullableIntFieldUpdateOperationsInput | number | null;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    value?: NullableStringFieldUpdateOperationsInput | string | null;
    importPath?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    promoted?: BoolFieldUpdateOperationsInput | boolean;
    deprecated?: BoolFieldUpdateOperationsInput | boolean;
    chromeStandard?: BoolFieldUpdateOperationsInput | boolean;
    dashboardCode?: NullableStringFieldUpdateOperationsInput | string | null;
    mockupSource?: NullableStringFieldUpdateOperationsInput | string | null;
    behaviorsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    colorTokensJson?: NullableStringFieldUpdateOperationsInput | string | null;
    subElementsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: VariantUncheckedUpdateManyWithoutAssetNestedInput;
    tags?: AssetTagUncheckedUpdateManyWithoutAssetNestedInput;
  };

  export type VariantCreateManyAssetInput = {
    id?: number;
    name: string;
    modifier?: string | null;
    propsJson?: string | null;
    previewHtml?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type AssetTagCreateManyAssetInput = {
    tagId: number;
  };

  export type PromotionLogCreateManyAssetInput = {
    id?: number;
    action: string;
    notes?: string | null;
    createdAt?: Date | string;
  };

  export type VariantUpdateWithoutAssetInput = {
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VariantUncheckedUpdateWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VariantUncheckedUpdateManyWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: StringFieldUpdateOperationsInput | string;
    modifier?: NullableStringFieldUpdateOperationsInput | string | null;
    propsJson?: NullableStringFieldUpdateOperationsInput | string | null;
    previewHtml?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AssetTagUpdateWithoutAssetInput = {
    tag?: TagUpdateOneRequiredWithoutAssetsNestedInput;
  };

  export type AssetTagUncheckedUpdateWithoutAssetInput = {
    tagId?: IntFieldUpdateOperationsInput | number;
  };

  export type AssetTagUncheckedUpdateManyWithoutAssetInput = {
    tagId?: IntFieldUpdateOperationsInput | number;
  };

  export type PromotionLogUpdateWithoutAssetInput = {
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PromotionLogUncheckedUpdateWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number;
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PromotionLogUncheckedUpdateManyWithoutAssetInput = {
    id?: IntFieldUpdateOperationsInput | number;
    action?: StringFieldUpdateOperationsInput | string;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AssetTagCreateManyTagInput = {
    assetId: number;
  };

  export type AssetTagUpdateWithoutTagInput = {
    asset?: AssetUpdateOneRequiredWithoutTagsNestedInput;
  };

  export type AssetTagUncheckedUpdateWithoutTagInput = {
    assetId?: IntFieldUpdateOperationsInput | number;
  };

  export type AssetTagUncheckedUpdateManyWithoutTagInput = {
    assetId?: IntFieldUpdateOperationsInput | number;
  };

  /**
   * Aliases for legacy arg types
   */
  /**
   * @deprecated Use AssetCountOutputTypeDefaultArgs instead
   */
  export type AssetCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AssetCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use TagCountOutputTypeDefaultArgs instead
   */
  export type TagCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = TagCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AssetDefaultArgs instead
   */
  export type AssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AssetDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VariantDefaultArgs instead
   */
  export type VariantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    VariantDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use TagDefaultArgs instead
   */
  export type TagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    TagDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AssetTagDefaultArgs instead
   */
  export type AssetTagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AssetTagDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use PromotionLogDefaultArgs instead
   */
  export type PromotionLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    PromotionLogDefaultArgs<ExtArgs>;

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
