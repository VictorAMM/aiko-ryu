// src/backup/ContentAddressableStorage.ts
// Content-Addressable Storage + Metadata DAG for DAG-based backup system
// Aligned with Aiko & Ryu principles: immutability, traceability, consensus

import { AgentContract, TraceEvent, ValidationResult } from '../agents/AgentContract';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Core CAS interfaces aligned with DDD/SDD principles
export interface ContentAddressableStorage {
  store(content: unknown, metadata?: Record<string, unknown>): Promise<string>;
  retrieve(hash: string): Promise<unknown>;
  exists(hash: string): boolean;
  delete(hash: string): Promise<boolean>;
  list(): Promise<string[]>;
}

export interface MetadataDAG {
  timestamp: Date;
  version: string;
  nodes: Record<string, DAGNode>;
  edges: DAGEdge[];
  consensus: boolean;
  validatedBy: string[];
}

export interface DAGNode {
  id: string;
  hash: string;
  deps: string[];
  metadata: NodeMetadata;
  status: 'pending' | 'computing' | 'completed' | 'failed';
  agentId: string;
  traceId: string;
}

export interface DAGEdge {
  from: string;
  to: string;
  type: 'dependency' | 'data-flow' | 'control-flow';
  metadata: Record<string, unknown>;
}

export interface NodeMetadata {
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

export interface BackupSnapshot {
  id: string;
  timestamp: Date;
  metadataDAG: MetadataDAG;
  casHashes: string[];
  version: string;
  description: string;
  tags: string[];
  immutable: boolean;
}

export interface RegenerationPolicy {
  strategy: 'incremental' | 'full' | 'selective';
  validateBeforeRestore: boolean;
  preserveHistory: boolean;
  maxSnapshots: number;
  ttlDays: number;
}

export interface BackupManager {
  createSnapshot(description: string, tags?: string[], immutable?: boolean): Promise<BackupSnapshot>;
  restoreSnapshot(snapshotId: string, policy?: RegenerationPolicy): Promise<ValidationResult>;
  listSnapshots(): Promise<BackupSnapshot[]>;
  deleteSnapshot(snapshotId: string): Promise<boolean>;
  garbageCollect(policy?: RegenerationPolicy): Promise<string[]>;
}

// Implementation aligned with Aiko & Ryu principles
export class AikoCAS implements ContentAddressableStorage {
  private storagePath: string;
  private metadataPath: string;
  
  constructor(storagePath: string = './.backups') {
    this.storagePath = storagePath;
    this.metadataPath = path.join(storagePath, 'metadata');
    this.ensureDirectories();
  }
  
  async store(content: unknown, metadata?: Record<string, unknown>): Promise<string> {
    const contentStr = JSON.stringify(content);
    const hash = this.computeHash(contentStr);
    const blobPath = this.getBlobPath(hash);
    
    // Store content with metadata
    const blobData = {
      content,
      metadata: {
        ...metadata,
        storedAt: new Date().toISOString(),
        hash,
        size: contentStr.length
      }
    };
    
    await fs.promises.writeFile(blobPath, JSON.stringify(blobData, null, 2));
    
    // Emit trace event for auditability
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'cas.content.stored',
      payload: { hash, size: contentStr.length },
      metadata: { sourceAgent: 'AikoCAS' }
    });
    
    return hash;
  }
  
  async retrieve(hash: string): Promise<unknown> {
    const blobPath = this.getBlobPath(hash);
    
    if (!fs.existsSync(blobPath)) {
      throw new Error(`Content not found for hash: ${hash}`);
    }
    
    const blobData = JSON.parse(await fs.promises.readFile(blobPath, 'utf-8'));
    
    // Emit trace event for auditability
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'cas.content.retrieved',
      payload: { hash },
      metadata: { sourceAgent: 'AikoCAS' }
    });
    
    return blobData.content;
  }
  
  exists(hash: string): boolean {
    return fs.existsSync(this.getBlobPath(hash));
  }
  
  async delete(hash: string): Promise<boolean> {
    const blobPath = this.getBlobPath(hash);
    
    if (fs.existsSync(blobPath)) {
      await fs.promises.unlink(blobPath);
      
      // Emit trace event for auditability
      this.emitTrace({
        timestamp: new Date(),
        eventType: 'cas.content.deleted',
        payload: { hash },
        metadata: { sourceAgent: 'AikoCAS' }
      });
      
      return true;
    }
    
    return false;
  }
  
  async list(): Promise<string[]> {
    const blobsPath = path.join(this.storagePath, 'blobs');
    
    if (!fs.existsSync(blobsPath)) {
      return [];
    }
    
    const files = await fs.promises.readdir(blobsPath);
    return files.filter(file => file.endsWith('.json'));
  }
  
  private computeHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
  
  private getBlobPath(hash: string): string {
    return path.join(this.storagePath, 'blobs', `${hash}.json`);
  }
  
  private ensureDirectories(): void {
    const dirs = [
      this.storagePath,
      path.join(this.storagePath, 'blobs'),
      this.metadataPath
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  private emitTrace(event: TraceEvent): void {
    console.log(`[AikoCAS]`, event);
  }
}

export class RyuMetadataDAG {
  private dagPath: string;
  private snapshots: Map<string, BackupSnapshot> = new Map();
  
  constructor(dagPath: string = './.backups/metadata') {
    this.dagPath = dagPath;
    this.loadSnapshots();
  }
  
  async createSnapshot(
    nodes: Record<string, DAGNode>,
    edges: DAGEdge[],
    description: string,
    tags: string[] = [],
    immutable: boolean = true
  ): Promise<BackupSnapshot> {
    const metadataDAG: MetadataDAG = {
      timestamp: new Date(),
      version: '1.0.0',
      nodes,
      edges,
      consensus: this.validateConsensus(nodes, edges),
      validatedBy: ['RyuMetadataDAG']
    };
    
    const snapshot: BackupSnapshot = {
      id: this.generateSnapshotId(),
      timestamp: new Date(),
      metadataDAG,
      casHashes: this.extractHashes(nodes),
      version: '1.0.0',
      description,
      tags,
      immutable
    };
    
    await this.saveSnapshot(snapshot);
    
    // Emit trace event for auditability
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'dag.snapshot.created',
      payload: { snapshotId: snapshot.id, nodeCount: Object.keys(nodes).length },
      metadata: { sourceAgent: 'RyuMetadataDAG' }
    });
    
    return snapshot;
  }
  
  async restoreSnapshot(
    snapshotId: string,
    cas: ContentAddressableStorage,
    policy: RegenerationPolicy = this.getDefaultPolicy()
  ): Promise<ValidationResult> {
    const snapshot = this.snapshots.get(snapshotId);
    
    if (!snapshot) {
      return {
        result: false,
        consensus: false,
        reason: `Snapshot not found: ${snapshotId}`
      };
    }
    
    const restoredNodes: string[] = [];
    const recomputedNodes: string[] = [];
    
    // Traverse DAG in dependency order
    const sortedNodes = this.topologicalSort(snapshot.metadataDAG.nodes, snapshot.metadataDAG.edges);
    
    for (const nodeId of sortedNodes) {
      const node = snapshot.metadataDAG.nodes[nodeId];
      
      if (policy.validateBeforeRestore) {
        const validationResult = await this.validateNode(node, cas);
        if (!validationResult.result) {
          recomputedNodes.push(nodeId);
          continue;
        }
      }
      
      if (cas.exists(node.hash)) {
        restoredNodes.push(nodeId);
      } else {
        recomputedNodes.push(nodeId);
      }
    }
    
    const result: ValidationResult = {
      result: restoredNodes.length > 0,
      consensus: recomputedNodes.length === 0,
      reason: recomputedNodes.length > 0 ? `Nodes need recomputation: ${recomputedNodes.join(', ')}` : undefined,
      details: {
        restoredNodes,
        recomputedNodes,
        totalNodes: sortedNodes.length,
        policy: policy.strategy
      }
    };
    
    // Emit trace event for auditability
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'dag.snapshot.restored',
      payload: { snapshotId, result },
      metadata: { sourceAgent: 'RyuMetadataDAG' }
    });
    
    return result;
  }
  
  async listSnapshots(): Promise<BackupSnapshot[]> {
    return Array.from(this.snapshots.values());
  }
  
  async deleteSnapshot(snapshotId: string): Promise<boolean> {
    const snapshot = this.snapshots.get(snapshotId);
    
    if (snapshot && !snapshot.immutable) {
      this.snapshots.delete(snapshotId);
      await this.saveSnapshots();
      
      // Emit trace event for auditability
      this.emitTrace({
        timestamp: new Date(),
        eventType: 'dag.snapshot.deleted',
        payload: { snapshotId },
        metadata: { sourceAgent: 'RyuMetadataDAG' }
      });
      
      return true;
    }
    
    return false;
  }
  
  async garbageCollect(policy: RegenerationPolicy = this.getDefaultPolicy()): Promise<string[]> {
    const snapshots = await this.listSnapshots();
    const toDelete: string[] = [];
    
    // Keep only the most recent N snapshots
    const sortedSnapshots = snapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const keepSnapshots = sortedSnapshots.slice(0, policy.maxSnapshots);
    
    for (const snapshot of sortedSnapshots) {
      if (!keepSnapshots.includes(snapshot) && !snapshot.immutable) {
        toDelete.push(snapshot.id);
      }
    }
    
    // Delete old snapshots
    for (const snapshotId of toDelete) {
      await this.deleteSnapshot(snapshotId);
    }
    
    return toDelete;
  }
  
  private validateConsensus(nodes: Record<string, DAGNode>, edges: DAGEdge[]): boolean {
    // Validate that all dependencies exist
    for (const edge of edges) {
      if (!nodes[edge.from] || !nodes[edge.to]) {
        return false;
      }
    }
    
    // Validate that all nodes have valid hashes
    for (const node of Object.values(nodes)) {
      if (!node.hash || node.hash.length !== 64) { // SHA256 length
        return false;
      }
    }
    
    return true;
  }
  
  private extractHashes(nodes: Record<string, DAGNode>): string[] {
    return Object.values(nodes).map(node => node.hash);
  }
  
  private generateSnapshotId(): string {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private topologicalSort(nodes: Record<string, DAGNode>, edges: DAGEdge[]): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    // Initialize
    for (const nodeId of Object.keys(nodes)) {
      graph.set(nodeId, []);
      inDegree.set(nodeId, 0);
    }
    
    // Build graph
    for (const edge of edges) {
      graph.get(edge.from)!.push(edge.to);
      inDegree.set(edge.to, inDegree.get(edge.to)! + 1);
    }
    
    // Topological sort
    const queue: string[] = [];
    const result: string[] = [];
    
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);
      
      for (const neighbor of graph.get(nodeId)!) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor)! === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }
  
  private async validateNode(node: DAGNode, cas: ContentAddressableStorage): Promise<ValidationResult> {
    if (!cas.exists(node.hash)) {
      return {
        result: false,
        consensus: false,
        reason: `Node content not found in CAS: ${node.hash}`
      };
    }
    
    return {
      result: true,
      consensus: true,
      details: { nodeId: node.id, hash: node.hash }
    };
  }
  
  private getDefaultPolicy(): RegenerationPolicy {
    return {
      strategy: 'incremental',
      validateBeforeRestore: true,
      preserveHistory: true,
      maxSnapshots: 10,
      ttlDays: 30
    };
  }
  
  private async saveSnapshot(snapshot: BackupSnapshot): Promise<void> {
    this.snapshots.set(snapshot.id, snapshot);
    await this.saveSnapshots();
  }
  
  private async saveSnapshots(): Promise<void> {
    const snapshotsPath = path.join(this.dagPath, 'snapshots.json');
    const snapshotsData = Array.from(this.snapshots.values());
    await fs.promises.writeFile(snapshotsPath, JSON.stringify(snapshotsData, null, 2));
  }
  
  private loadSnapshots(): void {
    const snapshotsPath = path.join(this.dagPath, 'snapshots.json');
    
    if (fs.existsSync(snapshotsPath)) {
      try {
        const snapshotsData = JSON.parse(fs.readFileSync(snapshotsPath, 'utf-8'));
        this.snapshots.clear();
        
        for (const snapshotData of snapshotsData) {
          const snapshot: BackupSnapshot = {
            ...snapshotData,
            timestamp: new Date(snapshotData.timestamp),
            metadataDAG: {
              ...snapshotData.metadataDAG,
              timestamp: new Date(snapshotData.metadataDAG.timestamp)
            }
          };
          this.snapshots.set(snapshot.id, snapshot);
        }
      } catch (error) {
        console.warn('Failed to load snapshots:', error);
      }
    }
  }
  
  private emitTrace(event: TraceEvent): void {
    console.log(`[RyuMetadataDAG]`, event);
  }
}

// Backup Manager that orchestrates CAS and Metadata DAG
export class AikoRyuBackupManager implements BackupManager {
  private cas: ContentAddressableStorage;
  private dag: RyuMetadataDAG;
  
  constructor(storagePath: string = './.backups') {
    this.cas = new AikoCAS(storagePath);
    this.dag = new RyuMetadataDAG(path.join(storagePath, 'metadata'));
  }
  
  async createSnapshot(description: string, tags: string[] = [], immutable: boolean = true): Promise<BackupSnapshot> {
    // This would be called with actual DAG state from the mesh
    const mockNodes: Record<string, DAGNode> = {
      'agent-aiko': {
        id: 'agent-aiko',
        hash: await this.cas.store({ role: 'SemanticValidator', status: 'ready' }),
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
      }
    };
    
    const mockEdges: DAGEdge[] = [];
    
    return await this.dag.createSnapshot(mockNodes, mockEdges, description, tags, immutable);
  }
  
  async restoreSnapshot(snapshotId: string, policy?: RegenerationPolicy): Promise<ValidationResult> {
    return await this.dag.restoreSnapshot(snapshotId, this.cas, policy);
  }
  
  async listSnapshots(): Promise<BackupSnapshot[]> {
    return await this.dag.listSnapshots();
  }
  
  async deleteSnapshot(snapshotId: string): Promise<boolean> {
    return await this.dag.deleteSnapshot(snapshotId);
  }
  
  async garbageCollect(policy?: RegenerationPolicy): Promise<string[]> {
    return await this.dag.garbageCollect(policy);
  }
} 