# Módulo: Backup & Recovery System

## Propósito
Sistema de backup incremental baseado em Content-Addressable Storage (CAS) + Metadata DAG que suporta regeneração dependency-aware e restauração seletiva.

## Interface/Contrato

```typescript
// Content-Addressable Storage (AikoCAS)
interface ContentAddressableStorage {
  store(content: unknown, metadata?: Record<string, unknown>): Promise<string>;
  retrieve(hash: string): Promise<unknown>;
  exists(hash: string): boolean;
  delete(hash: string): Promise<boolean>;
  list(): Promise<string[]>;
}

// Metadata DAG (RyuMetadataDAG)
interface MetadataDAG {
  timestamp: Date;
  version: string;
  nodes: Record<string, DAGNode>;
  edges: DAGEdge[];
  consensus: boolean;
  validatedBy: string[];
}

// Backup Manager
interface BackupManager {
  createSnapshot(description: string, tags?: string[]): Promise<BackupSnapshot>;
  restoreSnapshot(snapshotId: string, policy?: RegenerationPolicy): Promise<ValidationResult>;
  listSnapshots(): Promise<BackupSnapshot[]>;
  deleteSnapshot(snapshotId: string): Promise<boolean>;
  garbageCollect(): Promise<string[]>;
}
```

## Inputs/Outputs
- **Input:** DAG state, node outputs, metadata
- **Output:** Snapshots, restoration results, validation reports

## Eventos
- `backup.snapshot.created`
- `backup.snapshot.restored`
- `backup.garbage.collected`
- `backup.validation.failed`

## Storage Structure
```
.backups/
├── blobs/
│   ├── <sha256-1>.json: raw output of node A
│   ├── <sha256-2>.json: raw output of node B
│   └── ...
└── metadata/
    ├── snapshots.json: DAG state snapshots
    └── ...
```

## DAG Node Metadata
```typescript
interface DAGNode {
  id: string;
  hash: string;
  deps: string[];
  metadata: NodeMetadata;
  status: 'pending' | 'computing' | 'completed' | 'failed';
  agentId: string;
  traceId: string;
}

interface NodeMetadata {
  agentRole: string;
  capability: string;
  inputHashes: string[];
  outputHashes: string[];
  computationTime: number;
  memoryUsage: number;
  validationResult: ValidationResult;
  designIntent: string;
  userRequirement: string;
}
```

## Exemplo de Uso

### Creating Snapshots
```typescript
const backupManager = new AikoRyuBackupManager();

// Create snapshot with DAG state
const snapshot = await backupManager.createSnapshot(
  'Production system backup',
  ['production', 'stable']
);
```

### Incremental Restoration
```typescript
const policy: RegenerationPolicy = {
  strategy: 'incremental',
  validateBeforeRestore: true,
  preserveHistory: true,
  maxSnapshots: 10,
  ttlDays: 30
};

const result = await backupManager.restoreSnapshot(snapshotId, policy);
```

### Dependency-Aware Recovery
```typescript
// System automatically:
// 1. Traverses DAG in dependency order
// 2. Validates each node before restoration
// 3. Restores only needed nodes
// 4. Recomputes missing or invalid nodes
```

## Falhas Conhecidas
- Snapshots muito grandes podem impactar performance
- Falha de consenso pode impedir criação de snapshot
- Dependências circulares podem causar deadlock na restauração

## DDD/SDD Alignment

### Immutability & Traceability
- **Content Addressing**: Every node output is hashed and stored immutably
- **Audit Trail**: All backup operations emit trace events for auditability
- **Consensus Validation**: DAG snapshots require consensus validation before creation

### Specification-Driven Recovery
- **Regeneration Policy**: Configurable strategies (incremental, full, selective)
- **Dependency Awareness**: Topological sort ensures correct restoration order
- **Validation Chain**: "Nothing trusted, everything verified" during restore

### Design Intent Preservation
- **Metadata Richness**: Each node preserves design intent and user requirements
- **Context Preservation**: Full context maintained through metadata DAG
- **Traceability**: Complete audit trail from intention to execution

## Benefits

| Feature | Benefit | DDD/SDD Alignment |
|---------|---------|-------------------|
| **Content Addressing** | Efficient deduplication, easy rollback | Immutability principle |
| **Metadata DAG** | Dependency-aware restoration | Specification-driven |
| **Incremental Recovery** | Restore only needed nodes | Design intent preservation |
| **Consensus Validation** | Ensure backup integrity | "Nothing trusted" principle |
| **Trace Events** | Complete audit trail | Observability mandate |
| **Immutable Snapshots** | Prevent side-effects during restore | Contract immutability |

## Testing & Validation

```bash
# Run backup system tests
npm test test/backup.test.ts

# Test CAS operations
npm test -- --testNamePattern="Content-Addressable Storage"

# Test DAG operations
npm test -- --testNamePattern="Metadata DAG"

# Test DDD/SDD alignment
npm test -- --testNamePattern="DDD/SDD Alignment"
```

## Future Enhancements

### Phase 1: Foundation
- [x] CAS implementation with SHA256 hashing
- [x] Metadata DAG with consensus validation
- [x] Incremental restoration with dependency awareness
- [x] Trace events for auditability

### Phase 2: Advanced Features
- [ ] Delta compression for large blobs
- [ ] Distributed storage backend (S3, IPFS)
- [ ] Cryptographic proof of integrity (Rekor-style)
- [ ] Real-time backup synchronization

### Phase 3: Integration
- [ ] Mesh orchestration integration
- [ ] Agent lifecycle backup automation
- [ ] Cross-agent dependency tracking
- [ ] Performance optimization

### Phase 4: Production Ready
- [ ] Garbage collection policies
- [ ] Backup encryption
- [ ] Disaster recovery procedures
- [ ] Monitoring and alerting

## Teste Relacionado
- [test/backup.test.ts](../../test/backup.test.ts) 