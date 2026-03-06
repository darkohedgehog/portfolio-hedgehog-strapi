# CODING_GUIDELINES.md

## Purpose

This document defines coding rules and project conventions for this Strapi project.

The goal is to keep the codebase:

- predictable
- maintainable
- secure
- easy to extend
- consistent for both humans and AI coding tools

All new code should follow these guidelines unless there is a strong, documented reason not to.

---

## Project Context

This project uses:

- Strapi v5
- TypeScript
- Node.js
- SQLite / PostgreSQL / MySQL depending on environment
- API consumption from external frontend applications such as Next.js

Code should be written with a production mindset and with clear separation of responsibilities.

---

## General Principles

### 1. Prefer clarity over cleverness
Write code that is easy to read and easy to debug.

### 2. Keep controllers thin
Controllers should only:
- receive request data
- validate or normalize lightweight input
- call services
- return formatted responses

Business logic must not live in controllers.

### 3. Put business logic in services
If logic is reusable, testable, or not strictly request-related, place it in services.

### 4. Avoid duplication
If the same logic appears more than once, extract it into a helper, utility, or service.

### 5. Use TypeScript properly
Avoid `any` unless absolutely necessary.
Prefer explicit types for:
- params
- service input/output
- helper functions
- transformed response objects

### 6. Keep functions small
A function should ideally do one thing well.
If a function becomes hard to scan, split it.

### 7. Favor safe defaults
Assume missing fields, null values, malformed input, and incomplete relations can happen.

---

## File and Folder Conventions

### Naming

- Use `kebab-case` for folders and file names where appropriate
- Use `camelCase` for variables and functions
- Use `PascalCase` only for types, interfaces, and React components outside Strapi
- Use descriptive names, not short unclear names

### Examples

Good:
- `format-book-response.ts`
- `book-service.ts`
- `buildImageUrl`
- `BookListItem`

Bad:
- `utils2.ts`
- `dataFix.ts`
- `tmp.ts`

---

## Strapi Architecture Rules

### Controllers
Controllers must stay minimal.

Allowed responsibilities:
- reading params
- reading query values
- calling service methods
- sending response

Not allowed:
- large transformation blocks
- database-heavy logic
- repeated relation mapping logic
- complicated validation chains

### Services
Services should contain:
- business rules
- entity fetching logic
- transformation orchestration
- reusable logic shared by controllers

### Helpers / Utils
Use helpers for:
- formatting media URLs
- mapping entities into frontend-safe shapes
- parsing locale values
- sanitizing strings
- formatting dates
- building filters or query objects

### Policies / Middlewares
Use policies and middlewares when logic belongs to access control, request flow, or global request handling.

Do not place permission logic directly inside every controller unless there is a very specific reason.

---

## Data Fetching Rules

### Prefer official Strapi APIs
Use Strapi APIs and recommended project patterns.
Do not introduce raw database queries unless absolutely necessary and documented.

### Be explicit with populate
Never overpopulate by default.
Only request relations that are actually needed.

### Return predictable shapes
Frontend consumers should receive consistent response shapes.
Avoid returning mixed or unstable structures.

### Do not leak internal fields
Never expose:
- private fields
- internal-only flags
- sensitive metadata
- admin-only values
- unnecessary timestamps unless needed

---

## Response Formatting

### Transform data before returning it
Do not dump raw entity structures directly if the frontend expects a cleaner format.

Use mapping functions to create stable response objects.

Example goals:
- normalized media objects
- consistent relation arrays
- locale-aware fields
- frontend-safe defaults

### Prefer null or empty arrays over undefined
For public API responses:
- use `null` for missing single values
- use `[]` for missing collections

This makes frontend handling easier and more predictable.

---

## Validation Rules

### Always validate external input
Anything coming from:
- request body
- params
- query string
- custom endpoints

must be treated as untrusted input.

### Validate before processing
Validation should happen before:
- database writes
- business logic execution
- relation handling
- file processing

### Normalize input when useful
Examples:
- trim strings
- convert empty strings to null when appropriate
- coerce page/pageSize to numbers
- validate locale format

---

## Error Handling

### Fail clearly
Throw meaningful errors with enough context to debug the issue.

### Do not hide real problems
Avoid broad silent catch blocks.

Bad:
- swallowing errors
- returning fake success values
- using vague messages like `"Something went wrong"` everywhere internally

### Use user-safe messages for public responses
Internal logs can be specific.
Public API responses should be clear but not expose sensitive internals.

---

## Logging

### Log useful information
Log:
- important failures
- integration errors
- data issues that affect correctness

Do not log:
- secrets
- tokens
- passwords
- full sensitive payloads

### Keep logs actionable
A log should help diagnose a real issue.
Avoid noisy, repetitive console logs in production code.

---

## Security Rules

### Never hardcode secrets
Secrets must come from environment variables.

### Never commit credentials
Do not commit:
- API keys
- tokens
- passwords
- secrets
- private URLs with credentials

### Treat all input as unsafe
Sanitize and validate everything coming from the outside.

### Apply least privilege
Only expose what the frontend actually needs.

---

## TypeScript Rules

### Avoid `any`
Use:
- interfaces
- type aliases
- generics
- `unknown` when needed, then narrow it safely

### Prefer explicit return types for shared utilities and services
This improves predictability and AI-generated code quality.

### Reuse domain types
If the same structure appears multiple times, extract a reusable type.

---

## Media Handling

### Always handle missing media safely
Media fields may be:
- null
- missing
- partially populated
- differently shaped depending on query/populate

Code must guard against missing nested fields.

### Build absolute URLs in one place
If absolute URLs are needed, centralize that logic in a helper.

Do not duplicate media URL logic across controllers and services.

---

## Localization Rules

If a content type supports localization:

- always be explicit about locale handling
- never assume one locale unless that is the documented default
- keep locale mapping predictable
- preserve frontend-friendly localized response shape

When locale is user-controlled, validate it before use.

---

## Query and Filtering Rules

### Keep query handling predictable
When supporting:
- pagination
- sorting
- filtering
- locale
- search

normalize all query params first.

### Set sensible defaults
Examples:
- default page
- default pageSize
- maximum pageSize
- default sort order

### Never trust raw query values
Everything from `ctx.query` must be validated or normalized.

---

## Performance Rules

### Do not overfetch
Only populate what is actually used.

### Avoid repeated transformations
If a response mapper already exists, reuse it.

### Be careful with large collections
For collection endpoints:
- use pagination
- limit populate depth
- avoid expensive nested processing when not needed

---

## Code Style Rules

### Prefer early returns
This reduces nesting and improves readability.

### Avoid deeply nested conditionals
Split complex logic into smaller functions.

### Keep comments useful
Do not comment obvious code.
Comment:
- non-obvious business rules
- integration constraints
- important edge cases
- reasons behind unusual decisions

### Write maintainable code first
Do not optimize prematurely.

---

## Reusability Rules

Before writing new logic, check whether similar functionality already exists in:

- services
- utils
- helpers
- transformers
- shared constants
- validation helpers

If it exists, reuse or extend it instead of duplicating it.

---

## AI Assistant Rules

When generating or modifying code for this repository:

1. Follow Strapi v5 conventions
2. Use TypeScript for all new files when possible
3. Keep controllers thin
4. Put business logic in services
5. Reuse existing helpers before creating new ones
6. Do not introduce `any` without strong reason
7. Do not overfetch relations
8. Return stable, frontend-friendly response shapes
9. Handle null and optional values safely
10. Do not change architecture patterns unless explicitly asked

When editing existing code:
- preserve current project style
- avoid unrelated refactors
- avoid renaming files/functions unless necessary
- keep changes scoped to the requested task

---

## Recommended Structure for Custom Logic

Use this mental model:

- controller = request in / response out
- service = business logic
- helper = small reusable utility
- transformer = shape data for frontend
- policy = access rules
- middleware = request lifecycle behavior

---

## Environment Rules

### Environment variables
Use environment variables for:
- secrets
- database credentials
- API keys
- app URLs
- frontend URLs
- upload provider configuration

### Never assume production config locally
Code should work safely across:
- local development
- staging
- production

---

## Git and Change Discipline

### Keep commits focused
One change should solve one problem.

### Do not mix unrelated work
Avoid combining:
- bug fixes
- refactors
- formatting-only edits
- new features

in a single change unless necessary.

---

## Final Rule

When in doubt, choose the solution that is:

- simpler
- safer
- more readable
- easier for the next developer to extend