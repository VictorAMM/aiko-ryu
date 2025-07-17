// test/backup.test.ts
// Tests for Content-Addressable Storage + Metadata DAG backup system

import { 
  AikoCAS, 
  RyuMetadataDAG, 
  AikoRyuBackupManager,
  ContentAddressableStorage,
  DAGNode,
  DAGEdge,
  BackupSnapshot,
  RegenerationPolicy
} from '../src/backup/ContentAddressableStorage';
import path from 'path';
import fs from 'fs';

describe('AikoRyu Backup System', () => {
  let cas: ContentAddressableStorage;
  let dag: RyuMetadataDAG;
  let backupManager: AikoRyuBackupManager;
  const testStoragePath = path.resolve('../.test-backups');

  beforeEach((): void => {
    cas = new AikoCAS(testStoragePath);
    dag = new RyuMetadataDAG(path.join(testStoragePath, 'metadata'));
    backupManager = new AikoRyuBackupManager(testStoragePath);
  });

  afterEach(async (): Promise<void> => {
    // Clean up test storage
    if (fs.existsSync(testStoragePath)) {
      fs.rmSync(testStoragePath, { recursive: true, force: true });
    }
  });

  describe('Content-Addressable Storage (AikoCAS)', () => {
    it('should store and retrieve content with hash-based addressing', async (): Promise<void> => {
      const testContent = { agentId: 'aiko-1', status: 'ready', data: 'test-data' };
      
      // Store content
      const hash = await cas.store(testContent);
      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA256 length
      
      // Verify content exists
      expect(cas.exists(hash)).toBe(true);
      
      // Retrieve content
      const retrievedContent = await cas.retrieve(hash);
      expect(retrievedContent).toEqual(testContent);
    });

    it('should handle metadata with content storage', async (): Promise<void> => {
      const testContent = { role: 'SemanticValidator', capabilities: ['validation'] };
      const metadata = { 
        agentRole: 'SemanticValidator',
        designIntent: 'Validate semantic consistency',
        userRequirement: 'Ensure system integrity'
      };
      
      const hash = await cas.store(testContent, metadata);
      
      // Verify content can be retrieved
      const retrieved = await cas.retrieve(hash);
      expect(retrieved).toEqual(testContent);
    });

    it('should list all stored content hashes', async (): Promise<void> => {
      const content1 = { id: 'agent-1', status: 'ready' };
      const content2 = { id: 'agent-2', status: 'computing' };
      
      await cas.store(content1);
      await cas.store(content2);
      
      const hashes = await cas.list();
      expect(hashes.length).toBe(2);
      expect(hashes.every(hash => hash.endsWith('.json'))).toBe(true);
    });

    it('should delete content by hash', async (): Promise<void> => {
      const testContent = { id: 'test-agent', status: 'ready' };
      const hash = await cas.store(testContent);
      
      expect(cas.exists(hash)).toBe(true);
      
      const deleted = await cas.delete(hash);
      expect(deleted).toBe(true);
      expect(cas.exists(hash)).toBe(false);
    });

    it('should handle duplicate content with same hash', async (): Promise<void> => {
      const testContent = { id: 'duplicate-test', data: 'same-content' };
      
      const hash1 = await cas.store(testContent);
      const hash2 = await cas.store(testContent);
      
      expect(hash1).toBe(hash2); // Same content should produce same hash
      expect(cas.exists(hash1)).toBe(true);
    });
  });

  describe('Metadata DAG (RyuMetadataDAG)', () => {
    it('should create snapshots with DAG metadata', async (): Promise<void> => {
      const nodes: Record<string, DAGNode> = {
        'agent-aiko': {
          id: 'agent-aiko',
          hash: await cas.store({ role: 'SemanticValidator', status: 'ready' }),
          deps: [],
          metadata: {
            agentRole: 'SemanticValidator',
            capability: 'validation',
            inputHashes: [],
            outputHashes: [],
            computationTime: 100,
            memoryUsage: 50,
            validationResult: { result: true, consensus: true },
            designIntent: 'Validate semantic consistency',
            userRequirement: 'Ensure system integrity'
          },
          status: 'completed',
          agentId: 'aiko-1',
          traceId: `trace-${Date.now()}`
        },
        'agent-sarah': {
          id: 'agent-sarah',
          hash: await cas.store({ role: 'RAGEngine', status: 'ready' }),
          deps: ['agent-aiko'],
          metadata: {
            agentRole: 'RAGEngine',
            capability: 'knowledge-retrieval',
            inputHashes: [],
            outputHashes: [],
            computationTime: 200,
            memoryUsage: 100,
            validationResult: { result: true, consensus: true },
            designIntent: 'Provide context-aware responses',
            userRequirement: 'Access relevant knowledge'
          },
          status: 'completed',
          agentId: 'sarah-1',
          traceId: `trace-${Date.now()}`
        }
      };
      
      const edges: DAGEdge[] = [
        {
          from: 'agent-aiko',
          to: 'agent-sarah',
          type: 'dependency',
          metadata: { dataFlow: 'semantic-validation-to-rag' }
        }
      ];
      
      const snapshot = await dag.createSnapshot(nodes, edges, 'Test DAG snapshot', ['test', 'dddsdd']);
      
      expect(snapshot.id).toBeDefined();
      expect(snapshot.timestamp).toBeInstanceOf(Date);
      expect(snapshot.metadataDAG.nodes).toEqual(nodes);
      expect(snapshot.metadataDAG.edges).toEqual(edges);
      expect(snapshot.metadataDAG.consensus).toBe(true);
      expect(snapshot.immutable).toBe(true);
    });

    it('should validate consensus for DAG snapshots', async (): Promise<void> => {
      const validNodes: Record<string, DAGNode> = {
        'node-1': {
          id: 'node-1',
          hash: await cas.store({ data: 'test1' }),
          deps: [],
          metadata: {
            agentRole: 'TestAgent',
            capability: 'test',
            inputHashes: [],
            outputHashes: [],
            computationTime: 50,
            memoryUsage: 25,
            validationResult: { result: true, consensus: true },
            designIntent: 'Test functionality',
            userRequirement: 'Validate system'
          },
          status: 'completed',
          agentId: 'test-1',
          traceId: 'trace-1'
        }
      };
      
      const validEdges: DAGEdge[] = [];
      
      const snapshot = await dag.createSnapshot(validNodes, validEdges, 'Valid snapshot');
      expect(snapshot.metadataDAG.consensus).toBe(true);
    });

    it('should list all snapshots', async (): Promise<void> => {
      const nodes: Record<string, DAGNode> = {
        'test-node': {
          id: 'test-node',
          hash: await cas.store({ data: 'test' }),
          deps: [],
          metadata: {
            agentRole: 'TestAgent',
            capability: 'test',
            inputHashes: [],
            outputHashes: [],
            computationTime: 10,
            memoryUsage: 5,
            validationResult: { result: true, consensus: true },
            designIntent: 'Test',
            userRequirement: 'Test'
          },
          status: 'completed',
          agentId: 'test-1',
          traceId: 'trace-1'
        }
      };
      
      await dag.createSnapshot(nodes, [], 'Snapshot 1');
      await dag.createSnapshot(nodes, [], 'Snapshot 2');
      
      const snapshots = await dag.listSnapshots();
      expect(snapshots.length).toBe(2);
      expect(snapshots.every(s => s.description.startsWith('Snapshot'))).toBe(true);
    });

    it('should restore snapshots with incremental policy', async (): Promise<void> => {
      const nodes: Record<string, DAGNode> = {
        'restore-test': {
          id: 'restore-test',
          hash: await cas.store({ data: 'restore-test' }),
          deps: [],
          metadata: {
            agentRole: 'TestAgent',
            capability: 'test',
            inputHashes: [],
            outputHashes: [],
            computationTime: 10,
            memoryUsage: 5,
            validationResult: { result: true, consensus: true },
            designIntent: 'Test restoration',
            userRequirement: 'Test restoration'
          },
          status: 'completed',
          agentId: 'test-1',
          traceId: 'trace-1'
        }
      };
      
      const snapshot = await dag.createSnapshot(nodes, [], 'Restore test snapshot');
      
      const policy: RegenerationPolicy = {
        strategy: 'incremental',
        validateBeforeRestore: true,
        preserveHistory: true,
        maxSnapshots: 5,
        ttlDays: 30
      };
      
      const result = await dag.restoreSnapshot(snapshot.id, cas, policy);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
      expect(result.details?.restoredNodes).toContain('restore-test');
    });

    it('should handle missing snapshots gracefully', async (): Promise<void> => {
      const result = await dag.restoreSnapshot('non-existent-snapshot', cas);
      
      expect(result.result).toBe(false);
      expect(result.consensus).toBe(false);
      expect(result.reason).toContain('Snapshot not found');
    });

    it('should perform garbage collection', async (): Promise<void> => {
      const nodes: Record<string, DAGNode> = {
        'gc-test': {
          id: 'gc-test',
          hash: await cas.store({ data: 'gc-test' }),
          deps: [],
          metadata: {
            agentRole: 'TestAgent',
            capability: 'test',
            inputHashes: [],
            outputHashes: [],
            computationTime: 10,
            memoryUsage: 5,
            validationResult: { result: true, consensus: true },
            designIntent: 'Test GC',
            userRequirement: 'Test GC'
          },
          status: 'completed',
          agentId: 'test-1',
          traceId: 'trace-1'
        }
      };
      
      // Create more snapshots than the max limit, some immutable and some not
      const createdSnapshots: { id: string, isImmutable: boolean }[] = [];
      for (let i = 0; i < 15; i++) {
        const isImmutable = i < 5; // First 5 snapshots are immutable, rest are not
        const snap = await dag.createSnapshot(nodes, [], `Snapshot ${i}`, [], isImmutable);
        createdSnapshots.push({ id: snap.id, isImmutable });
      }
      
      const policy: RegenerationPolicy = {
        strategy: 'incremental',
        validateBeforeRestore: true,
        preserveHistory: true,
        maxSnapshots: 5, // Reduced to ensure garbage collection triggers
        ttlDays: 30
      };
      
      const deletedSnapshots = await dag.garbageCollect(policy);
      expect(deletedSnapshots.length).toBeGreaterThan(0);
      
      const remainingSnapshots = await dag.listSnapshots();
      const remainingIds = new Set(remainingSnapshots.map(s => s.id));
      // All immutable snapshots must remain
      for (let i = 0; i < 5; i++) {
        expect(remainingIds.has(createdSnapshots[i].id)).toBe(true);
      }
      // Only the last maxSnapshots mutable snapshots should remain
      const mutableSnapshots = createdSnapshots.slice(5);
      const lastMutable = mutableSnapshots.slice(-policy.maxSnapshots);
      for (const snap of lastMutable) {
        expect(remainingIds.has(snap.id)).toBe(true);
      }
      // All older mutable snapshots should be deleted
      const deletedMutable = mutableSnapshots.slice(0, -policy.maxSnapshots);
      for (const snap of deletedMutable) {
        expect(remainingIds.has(snap.id)).toBe(false);
      }
    });
  });

  describe('Backup Manager (AikoRyuBackupManager)', () => {
    it('should create and manage snapshots through the manager', async (): Promise<void> => {
      const snapshot = await backupManager.createSnapshot('Test backup', ['test', 'backup']);
      
      expect(snapshot.id).toBeDefined();
      expect(snapshot.description).toBe('Test backup');
      expect(snapshot.tags).toContain('test');
      expect(snapshot.tags).toContain('backup');
      expect(snapshot.immutable).toBe(true);
    });

    it('should restore snapshots through the manager', async (): Promise<void> => {
      const snapshot = await backupManager.createSnapshot('Restore test');
      
      const policy: RegenerationPolicy = {
        strategy: 'incremental',
        validateBeforeRestore: true,
        preserveHistory: true,
        maxSnapshots: 5,
        ttlDays: 30
      };
      
      const result = await backupManager.restoreSnapshot(snapshot.id, policy);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should list snapshots through the manager', async (): Promise<void> => {
      await backupManager.createSnapshot('Snapshot 1');
      await backupManager.createSnapshot('Snapshot 2');
      
      const snapshots = await backupManager.listSnapshots();
      expect(snapshots.length).toBe(2);
    });

    it('should delete snapshots through the manager', async (): Promise<void> => {
      const snapshot = await backupManager.createSnapshot('Delete test');
      
      const deleted = await backupManager.deleteSnapshot(snapshot.id);
      expect(deleted).toBe(false); // Should be false because snapshots are immutable by default
      
      const snapshots = await backupManager.listSnapshots();
      expect(snapshots.length).toBe(1); // Should still exist because immutable
    });

    it('should perform garbage collection through the manager', async (): Promise<void> => {
      // Create multiple snapshots, some immutable and some not
      for (let i = 0; i < 15; i++) {
        const isImmutable = i < 5; // First 5 snapshots are immutable, rest are not
        await backupManager.createSnapshot(`Snapshot ${i}`, [], isImmutable);
      }
      
      // Override the default policy to ensure garbage collection triggers
      const policy: RegenerationPolicy = {
        strategy: 'incremental',
        validateBeforeRestore: true,
        preserveHistory: true,
        maxSnapshots: 5, // Reduced to ensure garbage collection triggers
        ttlDays: 30
      };
      
      const deleted = await backupManager.garbageCollect(policy);
      expect(deleted.length).toBeGreaterThan(0);
    });
  });

  describe('DDD/SDD Alignment', () => {
    it('should maintain traceability and auditability', async (): Promise<void> => {
      const testContent = { 
        agentId: 'aiko-1', 
        role: 'SemanticValidator',
        designIntent: 'Validate semantic consistency',
        userRequirement: 'Ensure system integrity'
      };
      
      const hash = await cas.store(testContent);
      
      // Verify content is stored with metadata
      const retrieved = await cas.retrieve(hash);
      expect(retrieved).toEqual(testContent);
    });

    it('should validate specifications during backup', async (): Promise<void> => {
      const nodes: Record<string, DAGNode> = {
        'spec-validator': {
          id: 'spec-validator',
          hash: await cas.store({ 
            role: 'SpecificationValidator',
            validationResult: { result: true, consensus: true }
          }),
          deps: [],
          metadata: {
            agentRole: 'SpecificationValidator',
            capability: 'specification-validation',
            inputHashes: [],
            outputHashes: [],
            computationTime: 100,
            memoryUsage: 50,
            validationResult: { result: true, consensus: true },
            designIntent: 'Validate agent specifications',
            userRequirement: 'Ensure specification compliance'
          },
          status: 'completed',
          agentId: 'spec-1',
          traceId: 'trace-spec'
        }
      };
      
      const snapshot = await dag.createSnapshot(nodes, [], 'Specification validation test');
      
      expect(snapshot.metadataDAG.consensus).toBe(true);
      expect(snapshot.metadataDAG.validatedBy).toContain('RyuMetadataDAG');
    });

    it('should support incremental regeneration with dependency awareness', async (): Promise<void> => {
      const baseNode: DAGNode = {
        id: 'base-node',
        hash: await cas.store({ data: 'base-data' }),
        deps: [],
        metadata: {
          agentRole: 'BaseAgent',
          capability: 'base-capability',
          inputHashes: [],
          outputHashes: [],
          computationTime: 50,
          memoryUsage: 25,
          validationResult: { result: true, consensus: true },
          designIntent: 'Provide base functionality',
          userRequirement: 'Base system requirements'
        },
        status: 'completed',
        agentId: 'base-1',
        traceId: 'trace-base'
      };
      
      const dependentNode: DAGNode = {
        id: 'dependent-node',
        hash: await cas.store({ data: 'dependent-data', dependsOn: 'base-node' }),
        deps: ['base-node'],
        metadata: {
          agentRole: 'DependentAgent',
          capability: 'dependent-capability',
          inputHashes: [baseNode.hash],
          outputHashes: [],
          computationTime: 100,
          memoryUsage: 50,
          validationResult: { result: true, consensus: true },
          designIntent: 'Extend base functionality',
          userRequirement: 'Extended system requirements'
        },
        status: 'completed',
        agentId: 'dependent-1',
        traceId: 'trace-dependent'
      };
      
      const nodes = { 'base-node': baseNode, 'dependent-node': dependentNode };
      const edges: DAGEdge[] = [
        {
          from: 'base-node',
          to: 'dependent-node',
          type: 'dependency',
          metadata: { dataFlow: 'base-to-dependent' }
        }
      ];
      
      const snapshot = await dag.createSnapshot(nodes, edges, 'Dependency test');
      
      const policy: RegenerationPolicy = {
        strategy: 'incremental',
        validateBeforeRestore: true,
        preserveHistory: true,
        maxSnapshots: 5,
        ttlDays: 30
      };
      
      const result = await dag.restoreSnapshot(snapshot.id, cas, policy);
      
      expect(result.result).toBe(true);
      expect(result.details?.restoredNodes).toContain('base-node');
      expect(result.details?.restoredNodes).toContain('dependent-node');
    });
  });
}); 