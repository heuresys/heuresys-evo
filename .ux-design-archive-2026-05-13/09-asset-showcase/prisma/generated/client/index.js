Object.defineProperty(exports, '__esModule', { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
} = require('./runtime/library.js');

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: '5.22.0',
  engine: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
};

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.NotFoundError = NotFoundError;
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

const path = require('path');

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable',
});

exports.Prisma.AssetScalarFieldEnum = {
  id: 'id',
  name: 'name',
  kind: 'kind',
  category: 'category',
  subcategory: 'subcategory',
  sourcePath: 'sourcePath',
  sourceLine: 'sourceLine',
  description: 'description',
  value: 'value',
  importPath: 'importPath',
  previewHtml: 'previewHtml',
  promoted: 'promoted',
  deprecated: 'deprecated',
  chromeStandard: 'chromeStandard',
  dashboardCode: 'dashboardCode',
  mockupSource: 'mockupSource',
  behaviorsJson: 'behaviorsJson',
  colorTokensJson: 'colorTokensJson',
  subElementsJson: 'subElementsJson',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.VariantScalarFieldEnum = {
  id: 'id',
  assetId: 'assetId',
  name: 'name',
  modifier: 'modifier',
  propsJson: 'propsJson',
  previewHtml: 'previewHtml',
  notes: 'notes',
  createdAt: 'createdAt',
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  color: 'color',
};

exports.Prisma.AssetTagScalarFieldEnum = {
  assetId: 'assetId',
  tagId: 'tagId',
};

exports.Prisma.PromotionLogScalarFieldEnum = {
  id: 'id',
  assetId: 'assetId',
  action: 'action',
  notes: 'notes',
  createdAt: 'createdAt',
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last',
};

exports.Prisma.ModelName = {
  Asset: 'Asset',
  Variant: 'Variant',
  Tag: 'Tag',
  AssetTag: 'AssetTag',
  PromotionLog: 'PromotionLog',
};
/**
 * Create the Client
 */
const config = {
  generator: {
    name: 'client',
    provider: {
      fromEnvVar: null,
      value: 'prisma-client-js',
    },
    output: {
      value: 'D:\\evo.heuresys.com\\.ux-design\\09-asset-showcase\\prisma\\generated\\client',
      fromEnvVar: null,
    },
    config: {
      engineType: 'library',
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: 'windows',
        native: true,
      },
    ],
    previewFeatures: [],
    sourceFilePath: 'D:\\evo.heuresys.com\\.ux-design\\09-asset-showcase\\prisma\\schema.prisma',
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: null,
  },
  relativePath: '../..',
  clientVersion: '5.22.0',
  engineVersion: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
  datasourceNames: ['db'],
  activeProvider: 'sqlite',
  inlineDatasources: {
    db: {
      url: {
        fromEnvVar: null,
        value: 'file:../data.db',
      },
    },
  },
  inlineSchema:
    '// Heuresys Asset Showcase — local catalog management DB.\n// SQLite file `../data.db` (gitignored). Schema versioned alongside server.js.\n//\n// 5 tabelle:\n//   asset           — atomo catalogo (token/css/react/widget)\n//   variant         — variante di un asset (modifier CSS o stato React)\n//   tag             — etichetta libera (M:N con asset via asset_tag)\n//   asset_tag       — pivot M:N\n//   promotion_log   — audit trail append-only (promote/unpromote/edit/create/delete)\n\ngenerator client {\n  provider      = "prisma-client-js"\n  output        = "./generated/client"\n  binaryTargets = ["native"]\n}\n\ndatasource db {\n  provider = "sqlite"\n  url      = "file:../data.db"\n}\n\nmodel Asset {\n  id              Int      @id @default(autoincrement())\n  name            String   @unique\n  kind            String // \'token\' | \'css\' | \'react\' | \'widget\'\n  category        String?\n  subcategory     String?\n  sourcePath      String?  @map("source_path")\n  sourceLine      Int?     @map("source_line")\n  description     String?\n  /// Per token: il valore CSS literal (es. "#aab5f7"). Per altri: meta extra.\n  value           String?\n  /// Stringified import path (es. "@heuresys/ui/Button").\n  importPath      String?  @map("import_path")\n  /// Default preview HTML rendered nel canvas Preview tab. Per CSS classes\n  /// derivato da templates.mjs; per token swatch generato dal frontend; per\n  /// React/widget link a Storybook (vuoto).\n  previewHtml     String?  @map("preview_html")\n  /// Boolean: true se l\'asset compare nel SoT brand-dashboard-catalog.md\n  promoted        Boolean  @default(false)\n  /// Boolean: deprecato post-L41/L42 ecc.\n  deprecated      Boolean  @default(false)\n  /// Boolean: true se asset è universal chrome standardizzato cross-role\n  /// (header/footer/sidebar). Diventa lo shell di TUTTE le dashboard di ruolo.\n  chromeStandard  Boolean  @default(false) @map("chrome_standard")\n  /// Per body asset: dashboard code di provenienza (es. "org_systems_v2").\n  /// Null per chrome universale o per asset non legati a una dashboard specifica.\n  dashboardCode   String?  @map("dashboard_code")\n  /// Path al mockup di origine (audit trail provenienza dell\'import). Append-only.\n  mockupSource    String?  @map("mockup_source")\n  /// JSON: { hover?, active?, animations?, transitions?, focus? } — descrive behavior grafico.\n  behaviorsJson   String?  @map("behaviors_json")\n  /// JSON: array di token CSS variables usati (es. ["--accent","--surface-1"]).\n  colorTokensJson String?  @map("color_tokens_json")\n  /// JSON: array di sub-element class names che vivono nested dentro questo wrapper.\n  subElementsJson String?  @map("sub_elements_json")\n  notes           String?\n  createdAt       DateTime @default(now()) @map("created_at")\n  updatedAt       DateTime @updatedAt @map("updated_at")\n\n  variants      Variant[]\n  tags          AssetTag[]\n  promotionLogs PromotionLog[]\n\n  @@index([kind])\n  @@index([promoted])\n  @@index([deprecated])\n  @@index([category])\n  @@index([chromeStandard])\n  @@index([dashboardCode])\n  @@map("asset")\n}\n\nmodel Variant {\n  id          Int      @id @default(autoincrement())\n  assetId     Int      @map("asset_id")\n  name        String\n  /// CSS modifier (es. ".pill-warn") oppure variant key React (es. "primary").\n  modifier    String?\n  /// JSON stringified props (per React) o data sample (per CSS).\n  propsJson   String?  @map("props_json")\n  /// HTML inline da renderizzare nel preview pane.\n  previewHtml String?  @map("preview_html")\n  notes       String?\n  createdAt   DateTime @default(now()) @map("created_at")\n\n  asset Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)\n\n  @@index([assetId])\n  @@map("variant")\n}\n\nmodel Tag {\n  id     Int        @id @default(autoincrement())\n  name   String     @unique\n  /// Hex color or semantic key for badge rendering.\n  color  String?\n  assets AssetTag[]\n\n  @@map("tag")\n}\n\nmodel AssetTag {\n  assetId Int   @map("asset_id")\n  tagId   Int   @map("tag_id")\n  asset   Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)\n  tag     Tag   @relation(fields: [tagId], references: [id], onDelete: Cascade)\n\n  @@id([assetId, tagId])\n  @@map("asset_tag")\n}\n\nmodel PromotionLog {\n  id        Int      @id @default(autoincrement())\n  assetId   Int      @map("asset_id")\n  /// \'promote\' | \'unpromote\' | \'edit\' | \'create\' | \'delete\' | \'tag-add\' | \'tag-remove\'\n  action    String\n  /// Optional details (e.g. previous/new state, reason).\n  notes     String?\n  createdAt DateTime @default(now()) @map("created_at")\n\n  asset Asset @relation(fields: [assetId], references: [id], onDelete: Cascade)\n\n  @@index([assetId])\n  @@index([action])\n  @@map("promotion_log")\n}\n',
  inlineSchemaHash: '6f5ec297e9a983b522ef1c9c5396d128a7beef8b9dce6465feb6da57a283b233',
  copyEngine: true,
};

const fs = require('fs');

config.dirname = __dirname;
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = ['prisma/generated/client', 'generated/client'];

  const alternativePath =
    alternativePaths.find((altPath) => {
      return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'));
    }) ?? alternativePaths[0];

  config.dirname = path.join(process.cwd(), alternativePath);
  config.isBundled = true;
}

config.runtimeDataModel = JSON.parse(
  '{"models":{"Asset":{"dbName":"asset","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"kind","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"subcategory","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sourcePath","dbName":"source_path","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sourceLine","dbName":"source_line","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"value","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Per token: il valore CSS literal (es. \\"#aab5f7\\"). Per altri: meta extra."},{"name":"importPath","dbName":"import_path","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Stringified import path (es. \\"@heuresys/ui/Button\\")."},{"name":"previewHtml","dbName":"preview_html","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Default preview HTML rendered nel canvas Preview tab. Per CSS classes\\\\nderivato da templates.mjs; per token swatch generato dal frontend; per\\\\nReact/widget link a Storybook (vuoto)."},{"name":"promoted","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false,"documentation":"Boolean: true se l\'asset compare nel SoT brand-dashboard-catalog.md"},{"name":"deprecated","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false,"documentation":"Boolean: deprecato post-L41/L42 ecc."},{"name":"chromeStandard","dbName":"chrome_standard","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false,"documentation":"Boolean: true se asset è universal chrome standardizzato cross-role\\\\n(header/footer/sidebar). Diventa lo shell di TUTTE le dashboard di ruolo."},{"name":"dashboardCode","dbName":"dashboard_code","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Per body asset: dashboard code di provenienza (es. \\"org_systems_v2\\").\\\\nNull per chrome universale o per asset non legati a una dashboard specifica."},{"name":"mockupSource","dbName":"mockup_source","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Path al mockup di origine (audit trail provenienza dell\'import). Append-only."},{"name":"behaviorsJson","dbName":"behaviors_json","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"JSON: { hover?, active?, animations?, transitions?, focus? } — descrive behavior grafico."},{"name":"colorTokensJson","dbName":"color_tokens_json","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"JSON: array di token CSS variables usati (es. [\\"--accent\\",\\"--surface-1\\"])."},{"name":"subElementsJson","dbName":"sub_elements_json","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"JSON: array di sub-element class names che vivono nested dentro questo wrapper."},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"variants","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Variant","relationName":"AssetToVariant","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"tags","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AssetTag","relationName":"AssetToAssetTag","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"promotionLogs","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PromotionLog","relationName":"AssetToPromotionLog","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Variant":{"dbName":"variant","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"assetId","dbName":"asset_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"modifier","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"CSS modifier (es. \\".pill-warn\\") oppure variant key React (es. \\"primary\\")."},{"name":"propsJson","dbName":"props_json","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"JSON stringified props (per React) o data sample (per CSS)."},{"name":"previewHtml","dbName":"preview_html","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"HTML inline da renderizzare nel preview pane."},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"asset","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Asset","relationName":"AssetToVariant","relationFromFields":["assetId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Tag":{"dbName":"tag","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"color","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Hex color or semantic key for badge rendering."},{"name":"assets","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AssetTag","relationName":"AssetTagToTag","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AssetTag":{"dbName":"asset_tag","fields":[{"name":"assetId","dbName":"asset_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"tagId","dbName":"tag_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"asset","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Asset","relationName":"AssetToAssetTag","relationFromFields":["assetId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"tag","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Tag","relationName":"AssetTagToTag","relationFromFields":["tagId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["assetId","tagId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"PromotionLog":{"dbName":"promotion_log","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"assetId","dbName":"asset_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"\'promote\' | \'unpromote\' | \'edit\' | \'create\' | \'delete\' | \'tag-add\' | \'tag-remove\'"},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false,"documentation":"Optional details (e.g. previous/new state, reason)."},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"asset","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Asset","relationName":"AssetToPromotionLog","relationFromFields":["assetId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}'
);
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.engineWasm = undefined;

const { warnEnvConflicts } = require('./runtime/library.js');

warnEnvConflicts({
  rootEnvPath:
    config.relativeEnvPaths.rootEnvPath &&
    path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath:
    config.relativeEnvPaths.schemaEnvPath &&
    path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath),
});

const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);

// file annotations for bundling tools to include these files
path.join(__dirname, 'query_engine-windows.dll.node');
path.join(process.cwd(), 'prisma/generated/client/query_engine-windows.dll.node');
// file annotations for bundling tools to include these files
path.join(__dirname, 'schema.prisma');
path.join(process.cwd(), 'prisma/generated/client/schema.prisma');
