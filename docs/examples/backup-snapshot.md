# Exemplo: Backup Snapshot & Incremental Restore

## Caso de Uso
Backup do estado do DAG e restauração incremental após falha de nó.

## Exemplo
```typescript
const backupManager = new AikoRyuBackupManager();
const snapshot = await backupManager.createSnapshot('Backup produção');
// ...
const result = await backupManager.restoreSnapshot(snapshot.id, { strategy: 'incremental', validateBeforeRestore: true, maxSnapshots: 5, ttlDays: 30 });
```

## Esperado
- Apenas nós alterados são recomputados
- Nós válidos são restaurados do CAS

## Teste Relacionado
- [test/backup.test.ts](../../test/backup.test.ts) 