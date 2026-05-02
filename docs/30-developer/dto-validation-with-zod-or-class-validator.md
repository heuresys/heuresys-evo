# DTO Validation: zod vs class-validator — Heuresys evo

> **Decisione**: `zod` + `nestjs-zod`. Vincolo P7 (validated input) soddisfatto runtime + compile-time.
> **Scope**: tutti gli endpoint NestJS in `services/api-gateway/src/**`.

## Trade-off

| Aspetto            | class-validator                             | zod + nestjs-zod                                     |
| ------------------ | ------------------------------------------- | ---------------------------------------------------- |
| Idiomatico NestJS  | Sì (default doc)                            | Buona integrazione via plugin                        |
| Type inference     | No (DTO classe + validators ridondanti)     | Sì (`z.infer<typeof Schema>`)                        |
| Runtime check      | Sì (decoratori)                             | Sì (parsing)                                         |
| OpenAPI auto       | Nativo via `@nestjs/swagger`                | Via `nestjs-zod` patch su SwaggerModule              |
| Composabilità      | Limitata (extends classi)                   | Alta (`.merge()`, `.pick()`, `.omit()`, `.extend()`) |
| Refinement custom  | `@Validate(CustomConstraint)` verboso       | `.refine(fn, msg)` inline                            |
| Sharing FE/BE      | Difficile (decoratori = classi server-side) | Trivial (zod schema importabile in `services/app`)   |
| Bundle size schema | Decoratori metadata-heavy                   | Tree-shakable                                        |

Il fattore decisivo per evo è **sharing FE/BE**: lo stesso `CreateEmployeeSchema` è usato in `services/app` (form RSC + Server Action) e `services/api-gateway` (controller). Class-validator richiederebbe duplicazione zod-side.

## Setup

```bash
npm install zod nestjs-zod --workspace=services/api-gateway
```

`main.ts` — pipe globale:

```typescript
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(8012);
}
bootstrap();
```

## Pattern: DTO con `createZodDto`

Schema condiviso in `packages/shared/src/schemas/employee.ts`:

```typescript
import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  tenantId: z.string().uuid(),
  email: z.string().email().toLowerCase(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  fiscalCode: z
    .string()
    .regex(/^[A-Z0-9]{16}$/, 'Codice fiscale non valido')
    .optional(),
  hireDate: z.coerce.date(),
  roleCode: z.enum([
    'TENANT_OWNER',
    'IT_ADMIN',
    'HR_DIRECTOR',
    'HR_MANAGER',
    'DEPT_HEAD',
    'LINE_MANAGER',
    'EMPLOYEE',
  ]),
  managerId: z.string().uuid().optional(),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
```

DTO NestJS in `services/api-gateway/src/employee/dto/create-employee.dto.ts`:

```typescript
import { createZodDto } from 'nestjs-zod';
import { CreateEmployeeSchema } from '@heuresys/shared/schemas/employee';

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) {}
```

Controller:

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Post()
  @RequirePermission('CORE_HR', 'CREATE')
  async create(@Body() dto: CreateEmployeeDto) {
    // dto è già validato + tipato (CreateEmployeeInput)
    return this.service.create(dto);
  }
}
```

Errori di validazione vengono serializzati automaticamente in 400 con shape:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "path": ["fiscalCode"], "message": "Codice fiscale non valido" }]
}
```

## OpenAPI generation

`nestjs-zod` patcha `SwaggerModule` per emettere schema Swagger dai zod schema:

```typescript
import { patchNestJsSwagger } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

patchNestJsSwagger(); // chiamare prima di SwaggerModule.createDocument

const config = new DocumentBuilder()
  .setTitle('Heuresys API')
  .setVersion('0.1.0')
  .addBearerAuth()
  .build();
const doc = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, doc);
```

I `createZodDto(...)` espongono `.openapi(metadata)` per arricchire spec (description, example).

## Sharing FE: Server Action consumer

In `services/app`, lo stesso schema valida il form:

```typescript
'use server';
import { CreateEmployeeSchema } from '@heuresys/shared/schemas/employee';

export async function createEmployeeAction(formData: FormData) {
  const parsed = CreateEmployeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  // POST a /api/employees con parsed.data, header tenant + JWT
}
```

Zero duplicazione contratto FE/BE.

## Anti-pattern (non usare)

- Mix `class-validator` + `zod` nello stesso controller — confonde pipeline.
- `z.any()` o `z.unknown()` come DTO — viola P7.
- Schema definito inline in controller — non sharable, non testable.
