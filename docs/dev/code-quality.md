# Code Quality Policy: Stubs, Unused Code, and `any` Types

## Overview

To ensure maintainability, safety, and compliance with DDD/SDD principles, the AikoRyu system enforces strict rules against stubs, unused code, and unsafe types.

## What is Flagged?

- **Stub Methods/Functions:**
  - Methods with empty bodies, only a `TODO`, `throw`, `return undefined`, or similar placeholder.
  - Example:
    ```typescript
    // BAD: Stub method
    doSomething(): void {
      // TODO: implement
    }
    ```

- **Unused Variables/Imports/Parameters:**
  - Any variable, import, or parameter declared but not used in the code.
  - Example:
    ```typescript
    import { Unused } from './foo'; // BAD: unused import
    let unusedVar = 42; // BAD: unused variable
    ```

- **`any` or `unknown` Types:**
  - Usage of `any` or `unknown` types, or missing type annotations.
  - Example:
    ```typescript
    let data: any; // BAD
    function foo(bar): void { ... } // BAD: missing type for 'bar'
    ```

- **Explicit TODO/FIXME Comments:**
  - Any code marked with `TODO` or `FIXME` is flagged for review.

## Why This Matters

- **Maintainability:** Unused code and stubs make the codebase harder to understand and maintain.
- **Safety:** `any`/`unknown` types and stubs can hide bugs and break type safety.
- **Compliance:** DDD/SDD require explicit contracts and traceable, validated code.

## System Policy

- **No stubs, unused code, or `any`/`unknown` types in production.**
- All such issues must be flagged and resolved before merging.
- Analyzer and CI will fail if any are detected.

## How the System Detects Issues

- **ESLint:** Used to detect unused variables/imports and unsafe types.
- **Analyzer:** Runs ESLint and parses for stubs, TODOs, and unsafe types.
- **AST Parsing:** (Optional) Analyzer may parse the AST to find stub methods.

## Example Analyzer Output

```
## Stub/Unused/Any Warnings
- [ ] src/agents/AikoAgent.ts: line 158: stub method (empty body)
- [ ] src/specifications/SpecificationEngine.ts: line 394: unused variable 'specs'
- [ ] src/backup/ContentAddressableStorage.ts: line 123: usage of 'any' type
- [ ] src/agents/AikoAgent.ts: line 200: // TODO: implement validation
```

## Resolution

- Remove or implement all stubs.
- Remove all unused variables/imports/parameters.
- Replace all `any`/`unknown` types with explicit, safe types.
- Remove or resolve all TODO/FIXME comments.

## Allowing Intentional Stubs (with Context)

If a stub, scaffold, scratch, unused variable, or `any`/`unknown` type is **intentionally** left in the code for future iterations, you must add a comment on the previous line explaining the context and motivation. For example:

```typescript
// INTENTIONAL STUB: This method will be implemented in the next sprint to support feature X.
function doSomething(): void {}

// INTENTIONAL UNUSED: Reserved for future API compatibility.
let reservedField: string;

// INTENTIONAL ANY: Third-party library returns dynamic data.
let dynamicData: any; // INTENTIONAL ANY: Awaiting type definitions from upstream
```

The analyzer will allow these if the comment is present and clear.

---

> **This policy is mandatory for all code merged into the main branch.** 