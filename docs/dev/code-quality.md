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

## Stub Naming Convention

### Intentional Stubs (Allowed)
Parameters in stub functions should be prefixed with `_` to indicate they are intentionally unused placeholders:

```typescript
// GOOD: Intentional stub with _ prefix
private findAffectedAgents(_change: SpecificationChange): string[] {
  // INTENTIONAL STUB: Will implement affected agent analysis in future
  return [];
}

// GOOD: Intentional stub with _ prefix
private calculateNextVersion(_specId: string): string {
  // INTENTIONAL STUB: Will implement version calculation in future
  return '1.1.0';
}
```

### Unused Code (Not Allowed)
Parameters without `_` prefix are considered actual unused code and will be flagged:

```typescript
// BAD: Unused parameter without _ prefix
private findAffectedAgents(change: SpecificationChange): string[] {
  // This will be flagged as unused code
  return [];
}

// BAD: Unused variable
let unusedVar = 42; // This will be flagged
```

## Why This Matters

- **Maintainability:** Unused code and stubs make the codebase harder to understand and maintain.
- **Safety:** `any`/`unknown` types and stubs can hide bugs and break type safety.
- **Compliance:** DDD/SDD require explicit contracts and traceable, validated code.
- **Clarity:** The `_` prefix clearly distinguishes intentional stubs from actual unused code.

## System Policy

- **No unused code, `any`/`unknown` types, or stubs without `_` prefix in production.**
- All such issues must be flagged and resolved before merging.
- Analyzer and CI will fail if any are detected.
- Intentional stubs must use `_` prefix and include clear comments about future implementation.

## How the System Detects Issues

- **ESLint:** Used to detect unused variables/imports and unsafe types.
- **Analyzer:** Runs ESLint and parses for stubs, TODOs, and unsafe types.
- **AST Parsing:** Analyzer parses the AST to find stub methods and validate naming conventions.

## Example Analyzer Output

```
## Stub/Unused/Any Warnings
- [ ] src/agents/AikoAgent.ts:158: 'change' is defined but never used (should be _change for stub)
- [ ] src/specifications/SpecificationEngine.ts:381: Missing return type on function
- [ ] test/backup.test.ts:11: 'BackupSnapshot' is defined but never used
```

## Migration Guide

To migrate existing code:

1. **For intentional stubs:** Add `_` prefix to parameters
   ```typescript
   // Before
   private findAffectedAgents(change: SpecificationChange): string[] {
   
   // After
   private findAffectedAgents(_change: SpecificationChange): string[] {
   ```

2. **For actual unused code:** Either use the parameter or remove it
   ```typescript
   // Before
   function processData(data: string) {
     return 'processed';
   }
   
   // After (if data is needed)
   function processData(data: string) {
     return `processed: ${data}`;
   }
   
   // Or remove unused parameter
   function processData() {
     return 'processed';
   }
   ```

3. **Remove eslint-disable comments:** No longer needed with proper naming
   ```typescript
   // Before
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   private findAffectedAgents(change: SpecificationChange): string[] {
   
   // After
   private findAffectedAgents(_change: SpecificationChange): string[] {
   ``` 