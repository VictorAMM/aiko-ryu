import { EventEmitter } from 'events';
import { AgentContract, AgentStatus, ValidationResult, AgentSpecification, UserInteraction, TraceEvent, DesignArtifact, EventPayload } from './AgentContract';

interface ContextInfo {
  id: string;
  size: number;
  lastAccessed: Date;
  accessCount: number;
  dependencies: string[];
}

interface GarbageCollectionResult {
  success: boolean;
  contextsCleaned: number;
  memoryFreed: number;
  structuralIssues: string[];
  suggestions: string[];
}

interface ContextValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export class GarbageCollectorAgent implements AgentContract {
  public readonly id: string;
  public readonly role: string = 'Garbage Collector Agent';
  public readonly dependencies: string[] = [];

  private eventEmitter: EventEmitter;
  private status: AgentStatus = {
    status: 'initializing',
    uptime: 0
  };

  private registeredContexts: Map<string, ContextInfo> = new Map();
  private contextAccessLog: Map<string, Date[]> = new Map();
  private structuralValidationRules: unknown[] = [];

  constructor(id: string = 'garbage-collector-agent') {
    this.id = id;
    this.eventEmitter = new EventEmitter();
    this.initializeValidationRules();
  }

  async initialize(): Promise<void> {
    this.status = {
      status: 'ready',
      uptime: Date.now()
    };
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'agent.initialized',
      payload: {
        agentId: this.id,
        role: this.role,
        timestamp: new Date(),
        correlationId: this.id,
        sourceAgent: this.id
      },
      metadata: {
        sourceAgent: this.id
      }
    });
  }

  async shutdown(): Promise<void> {
    this.status = {
      status: 'shutting-down',
      uptime: Date.now()
    };
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'agent.shutdown',
      payload: {
        agentId: this.id,
        timestamp: new Date(),
        correlationId: this.id,
        sourceAgent: this.id
      },
      metadata: {
        sourceAgent: this.id
      }
    });
  }

  emitTrace(event: TraceEvent): void {
    console.log(`[${this.role}:${this.id}]`, event);
    this.eventEmitter.emit('trace', event);
  }

  getStatus(): AgentStatus {
    return { ...this.status };
  }

  validateSpecification(_spec: AgentSpecification): ValidationResult {
    return { result: true, consensus: true };
  }

  generateDesignArtifacts(): DesignArtifact[] {
    return [];
  }

  trackUserInteraction(_interaction: UserInteraction): void {
    // Track user interactions for garbage collection
  }

  private initializeValidationRules(): void {
    this.structuralValidationRules = [
      // Mock validation rules for demonstration
      { name: 'context_size_limit', rule: 'context.size < 1000' },
      { name: 'dependency_cycle_check', rule: 'no_circular_dependencies' },
      { name: 'access_frequency_check', rule: 'access_count > 0' }
    ];
  }

  /**
   * Register a context for garbage collection monitoring
   */
  registerContext(contextId: string, contextInfo: Omit<ContextInfo, 'id'>): void {
    const context: ContextInfo = {
      id: contextId,
      ...contextInfo
    };

    this.registeredContexts.set(contextId, context);
    this.contextAccessLog.set(contextId, []);

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'context.registered',
      payload: {
        contextId,
        size: context.size,
        dependencies: context.dependencies.length,
        timestamp: new Date(),
        correlationId: contextId,
        sourceAgent: this.id
      },
      metadata: {
        sourceAgent: this.id
      }
    });
  }

  /**
   * Record context access for usage analysis
   */
  recordContextAccess(contextId: string): void {
    const context = this.registeredContexts.get(contextId);
    if (!context) {
      return;
    }

    // Update access count
    context.accessCount++;
    context.lastAccessed = new Date();

    // Log access
    const accessLog = this.contextAccessLog.get(contextId) || [];
    accessLog.push(new Date());
    this.contextAccessLog.set(contextId, accessLog);

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'context.accessed',
      payload: {
        contextId,
        accessCount: context.accessCount,
        timestamp: new Date(),
        correlationId: contextId,
        sourceAgent: this.id
      },
      metadata: {
        sourceAgent: this.id
      }
    });
  }

  /**
   * Clean up unused contexts
   */
  async cleanupUnusedContexts(): Promise<GarbageCollectionResult> {
    try {
      this.emitTrace({
        timestamp: new Date(),
        eventType: 'garbage.collection.started',
        payload: {
          contextCount: this.registeredContexts.size,
          timestamp: new Date(),
          correlationId: `gc-${Date.now()}`,
          sourceAgent: this.id
        },
        metadata: {
          sourceAgent: this.id
        }
      });

      const contextsToClean: string[] = [];
      let totalMemoryFreed = 0;

      // Identify unused contexts
      for (const [contextId, context] of this.registeredContexts) {
        const timeSinceLastAccess = Date.now() - context.lastAccessed.getTime();
        const accessFrequency = context.accessCount / Math.max(1, (Date.now() - context.lastAccessed.getTime()) / (1000 * 60 * 60)); // accesses per hour

        // Criteria for cleanup: low access frequency and old last access
        if (accessFrequency < 0.1 && timeSinceLastAccess > 1000 * 60 * 60) { // Less than 0.1 accesses per hour and older than 1 hour
          contextsToClean.push(contextId);
          totalMemoryFreed += context.size;
        }
      }

      // Clean up identified contexts
      for (const contextId of contextsToClean) {
        this.registeredContexts.delete(contextId);
        this.contextAccessLog.delete(contextId);
      }

      const result: GarbageCollectionResult = {
        success: true,
        contextsCleaned: contextsToClean.length,
        memoryFreed: totalMemoryFreed,
        structuralIssues: [],
        suggestions: []
      };

      this.emitTrace({
        timestamp: new Date(),
        eventType: 'garbage.collection.completed',
        payload: {
          contextsCleaned: result.contextsCleaned,
          memoryFreed: result.memoryFreed,
          timestamp: new Date(),
          correlationId: `gc-${Date.now()}`,
          sourceAgent: this.id
        },
        metadata: {
          sourceAgent: this.id
        }
      });

      return result;
    } catch (error) {
      this.emitTrace({
        timestamp: new Date(),
        eventType: 'garbage.collection.failed',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
          correlationId: `gc-${Date.now()}`,
          sourceAgent: this.id
        },
        metadata: {
          sourceAgent: this.id
        }
      });

      return {
        success: false,
        contextsCleaned: 0,
        memoryFreed: 0,
        structuralIssues: [error instanceof Error ? error.message : 'Unknown error'],
        suggestions: []
      };
    }
  }

  /**
   * Validate structural integrity of contexts
   */
  async validateContextStructure(): Promise<ContextValidationResult> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for circular dependencies
    for (const [contextId, context] of this.registeredContexts) {
      const visited = new Set<string>();
      const recursionStack = new Set<string>();

      if (this.hasCircularDependency(contextId, context.dependencies, visited, recursionStack)) {
        issues.push(`Circular dependency detected in context: ${contextId}`);
        suggestions.push(`Review dependency chain for context: ${contextId}`);
      }
    }

    // Check for oversized contexts
    for (const [contextId, context] of this.registeredContexts) {
      if (context.size > 1000) {
        issues.push(`Context ${contextId} is oversized (${context.size} bytes)`);
        suggestions.push(`Consider splitting context: ${contextId}`);
      }
    }

    // Check for unused contexts
    for (const [contextId, context] of this.registeredContexts) {
      if (context.accessCount === 0) {
        issues.push(`Context ${contextId} has never been accessed`);
        suggestions.push(`Consider removing unused context: ${contextId}`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Detect circular dependencies using DFS
   */
  private hasCircularDependency(
    contextId: string,
    dependencies: string[],
    visited: Set<string>,
    recursionStack: Set<string>
  ): boolean {
    if (recursionStack.has(contextId)) {
      return true;
    }

    if (visited.has(contextId)) {
      return false;
    }

    visited.add(contextId);
    recursionStack.add(contextId);

    for (const dependency of dependencies) {
      const dependentContext = this.registeredContexts.get(dependency);
      if (dependentContext && this.hasCircularDependency(dependency, dependentContext.dependencies, visited, recursionStack)) {
        return true;
      }
    }

    recursionStack.delete(contextId);
    return false;
  }

  /**
   * Suggest merges and refactors based on context analysis
   */
  async suggestOptimizations(): Promise<{
    merges: string[];
    refactors: string[];
    splits: string[];
  }> {
    const merges: string[] = [];
    const refactors: string[] = [];
    const splits: string[] = [];

    // Analyze context relationships
    const contextGroups = this.groupRelatedContexts();

    for (const group of contextGroups) {
      if (group.length > 1) {
        // Suggest merging related contexts
        merges.push(`Consider merging contexts: ${group.join(', ')}`);
      }
    }

    // Analyze oversized contexts
    for (const [contextId, context] of this.registeredContexts) {
      if (context.size > 2000) {
        splits.push(`Consider splitting large context: ${contextId} (${context.size} bytes)`);
      }
    }

    // Analyze access patterns
    for (const [contextId, context] of this.registeredContexts) {
      if (context.accessCount > 100 && context.size < 100) {
        refactors.push(`Optimize frequently accessed context: ${contextId}`);
      }
    }

    return { merges, refactors, splits };
  }

  /**
   * Group related contexts based on dependencies
   */
  private groupRelatedContexts(): string[][] {
    const groups: string[][] = [];
    const visited = new Set<string>();

    for (const [contextId, context] of this.registeredContexts) {
      if (visited.has(contextId)) {
        continue;
      }

      const group = this.findRelatedContexts(contextId, new Set<string>());
      groups.push(Array.from(group));
      
      for (const relatedId of group) {
        visited.add(relatedId);
      }
    }

    return groups;
  }

  /**
   * Find all contexts related to a given context
   */
  private findRelatedContexts(contextId: string, visited: Set<string>): Set<string> {
    if (visited.has(contextId)) {
      return visited;
    }

    visited.add(contextId);
    const context = this.registeredContexts.get(contextId);
    
    if (!context) {
      return visited;
    }

    // Add direct dependencies
    for (const dependency of context.dependencies) {
      this.findRelatedContexts(dependency, visited);
    }

    // Add contexts that depend on this context
    for (const [otherId, otherContext] of this.registeredContexts) {
      if (otherContext.dependencies.includes(contextId)) {
        this.findRelatedContexts(otherId, visited);
      }
    }

    return visited;
  }

  /**
   * Handle events for garbage collection
   */
  async handleEvent(eventType: string, payload: EventPayload): Promise<void> {
    switch (eventType) {
      case 'context.registered':
        const registerPayload = payload as { contextId: string; size: number; dependencies: string[] };
        this.registerContext(registerPayload.contextId, {
          size: registerPayload.size,
          lastAccessed: new Date(),
          accessCount: 0,
          dependencies: registerPayload.dependencies
        });
        break;

      case 'context.accessed':
        const accessPayload = payload as { contextId: string };
        this.recordContextAccess(accessPayload.contextId);
        break;

      case 'garbage.collection.requested':
        const gcResult = await this.cleanupUnusedContexts();
        this.emitTrace({
          timestamp: new Date(),
          eventType: 'garbage.collection.response',
          payload: {
            success: gcResult.success,
            contextsCleaned: gcResult.contextsCleaned,
            memoryFreed: gcResult.memoryFreed,
            timestamp: new Date(),
            correlationId: payload.correlationId || `gc-${Date.now()}`,
            sourceAgent: this.id
          },
          metadata: {
            sourceAgent: this.id
          }
        });
        break;

      case 'context.validation.requested':
        const validationResult = await this.validateContextStructure();
        this.emitTrace({
          timestamp: new Date(),
          eventType: 'context.validation.response',
          payload: {
            isValid: validationResult.isValid,
            issues: validationResult.issues.length,
            suggestions: validationResult.suggestions.length,
            timestamp: new Date(),
            correlationId: payload.correlationId || `validation-${Date.now()}`,
            sourceAgent: this.id
          },
          metadata: {
            sourceAgent: this.id
          }
        });
        break;

      case 'optimization.suggestions.requested':
        const optimizations = await this.suggestOptimizations();
        this.emitTrace({
          timestamp: new Date(),
          eventType: 'optimization.suggestions.response',
          payload: {
            merges: optimizations.merges.length,
            refactors: optimizations.refactors.length,
            splits: optimizations.splits.length,
            timestamp: new Date(),
            correlationId: payload.correlationId || `optimization-${Date.now()}`,
            sourceAgent: this.id
          },
          metadata: {
            sourceAgent: this.id
          }
        });
        break;

      default:
        // Handle unknown events gracefully
        this.emitTrace({
          timestamp: new Date(),
          eventType: 'warning',
          payload: {
            warning: `Unknown event type: ${eventType}`,
            originalPayload: payload || {},
            timestamp: new Date(),
            correlationId: payload.correlationId || 'unknown-event',
            sourceAgent: this.id
          },
          metadata: {
            sourceAgent: this.id
          }
        });
        break;
    }
  }
} 