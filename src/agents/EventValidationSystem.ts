// src/agents/EventValidationSystem.ts

import { z } from 'zod';

/**
 * Event Validation System
 * 
 * Provides comprehensive validation for:
 * - Event payload structure validation
 * - Event type mapping and standardization
 * - Context propagation with field validation
 * - Schema-based validation with Zod
 */

// ============================================================================
// EVENT TYPE REGISTRY
// ============================================================================

export const EVENT_TYPES = {
  // Semantic Validation Events
  'semantic.validation.request': 'specification.validate',
  'semantic.validation.response': 'specification.validated',
  'semantic.validation.error': 'specification.validation.error',
  
  // Integrity Validation Events
  'integrity.validation.request': 'integrity.validate',
  'integrity.validation.response': 'integrity.validated',
  'integrity.validation.error': 'integrity.validation.error',
  
  // DAG Orchestration Events
  'dag.orchestration.request': 'dag.orchestrate',
  'dag.orchestration.response': 'dag.orchestrated',
  'dag.orchestration.error': 'dag.orchestration.error',
  
  // Context Propagation Events
  'context.propagation.request': 'context.propagate',
  'context.propagation.response': 'context.propagated',
  'context.propagation.error': 'context.propagation.error',
  
  // RAG Knowledge Events
  'rag.knowledge.request': 'rag.retrieve',
  'rag.knowledge.response': 'rag.retrieved',
  'rag.knowledge.error': 'rag.retrieval.error',
  
  // Business Logic Events
  'business.rule.request': 'business.rule.execute',
  'business.rule.response': 'business.rule.executed',
  'business.rule.error': 'business.rule.error',
  
  // Compliance Events
  'compliance.validation.request': 'compliance.validate',
  'compliance.validation.response': 'compliance.validated',
  'compliance.validation.error': 'compliance.validation.error',
  
  // Security Events
  'security.operation.request': 'security.operate',
  'security.operation.response': 'security.operated',
  'security.operation.error': 'security.operation.error',
  
  // Network Performance Events
  'network.optimization.request': 'network.optimize',
  'network.optimization.response': 'network.optimized',
  'network.optimization.error': 'network.optimization.error',
  
  // Composition Events
  'composition.request': 'composition.create',
  'composition.response': 'composition.created',
  'composition.error': 'composition.error',
  
  // System Events
  'agent.initialized': 'agent.initialized',
  'agent.shutdown': 'agent.shutdown',
  'system.health.check': 'system.health.check',
  'system.ready': 'system.ready'
} as const;

export type EventType = keyof typeof EVENT_TYPES;

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

// Base schemas
const BaseEventSchema = z.object({
  timestamp: z.date(),
  eventType: z.string(),
  sourceAgent: z.string(),
  traceId: z.string().optional(),
  correlationId: z.string().optional()
});

const BaseContextSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  domain: z.string().optional(),
  state: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

// Semantic Validation Schemas
const SemanticValidationRequestSchema = z.object({
  specificationId: z.string(),
  specification: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    capabilities: z.array(z.string()).optional(),
    interfaces: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    constraints: z.array(z.string()).optional(),
    contracts: z.array(z.string()).optional()
  }),
  context: BaseContextSchema.optional()
});

const SemanticValidationResponseSchema = z.object({
  specificationId: z.string(),
  result: z.object({
    valid: z.boolean(),
    errors: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional()
  }),
  context: BaseContextSchema.optional()
});

// Integrity Validation Schemas
const IntegrityValidationRequestSchema = z.object({
  output: z.unknown(),
  context: z.object({
    operation: z.string(),
    securityLevel: z.enum(['low', 'medium', 'high', 'critical']),
    complianceRequired: z.boolean().optional(),
    agentId: z.string().optional()
  }),
  validationRules: z.array(z.string()).optional()
});

const IntegrityValidationResponseSchema = z.object({
  outputId: z.string(),
  result: z.object({
    valid: z.boolean(),
    integrityScore: z.number().min(0).max(1),
    violations: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional()
  }),
  context: BaseContextSchema.optional()
});

// DAG Orchestration Schemas
const DAGNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['agent', 'service', 'gateway']),
  role: z.string(),
  status: z.enum(['active', 'inactive', 'error']),
  dependencies: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()).optional()
});

const DAGEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(['data', 'control', 'event']),
  metadata: z.record(z.string(), z.unknown()).optional()
});

const DAGOrchestrationRequestSchema = z.object({
  dagSpec: z.object({
    id: z.string(),
    nodes: z.array(DAGNodeSchema),
    edges: z.array(DAGEdgeSchema),
    metadata: z.record(z.string(), z.unknown()).optional()
  }),
  workflowId: z.string(),
  context: BaseContextSchema.optional()
});

// Context Propagation Schemas
const ContextPropagationRequestSchema = z.object({
  contextSlice: BaseContextSchema,
  targetAgents: z.array(z.string()),
  propagationType: z.enum(['broadcast', 'targeted', 'filtered']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  ttl: z.number().optional() // Time to live in milliseconds
});

const ContextPropagationResponseSchema = z.object({
  contextId: z.string(),
  propagatedTo: z.array(z.string()),
  failedAgents: z.array(z.string()).optional(),
  propagationTime: z.number(),
  context: BaseContextSchema
});

// RAG Knowledge Schemas
const RAGKnowledgeRequestSchema = z.object({
  query: z.string(),
  context: z.object({
    domain: z.string().optional(),
    complexity: z.enum(['basic', 'intermediate', 'advanced']).optional(),
    maxTokens: z.number().optional(),
    confidenceThreshold: z.number().min(0).max(1).optional()
  }),
  filters: z.record(z.string(), z.unknown()).optional()
});

const RAGKnowledgeResponseSchema = z.object({
  queryId: z.string(),
  results: z.array(z.object({
    content: z.string(),
    source: z.string(),
    confidence: z.number().min(0).max(1),
    relevance: z.number().min(0).max(1)
  })),
  synthesis: z.string().optional(),
  context: BaseContextSchema.optional()
});

// Business Logic Schemas
const BusinessRuleRequestSchema = z.object({
  ruleId: z.string(),
  data: z.record(z.string(), z.unknown()),
  context: z.object({
    userId: z.string().optional(),
    userRole: z.string().optional(),
    department: z.string().optional(),
    amount: z.number().optional()
  }),
  parameters: z.record(z.string(), z.unknown()).optional()
});

const BusinessRuleResponseSchema = z.object({
  ruleId: z.string(),
  result: z.object({
    approved: z.boolean(),
    reason: z.string().optional(),
    riskScore: z.number().min(0).max(1).optional(),
    recommendations: z.array(z.string()).optional()
  }),
  context: BaseContextSchema.optional()
});

// Compliance Validation Schemas
const ComplianceValidationRequestSchema = z.object({
  requirements: z.array(z.string()),
  context: z.object({
    dataType: z.string(),
    jurisdiction: z.string(),
    industry: z.string().optional(),
    riskLevel: z.enum(['low', 'medium', 'high']).optional()
  }),
  policies: z.array(z.string()).optional()
});

const ComplianceValidationResponseSchema = z.object({
  validationId: z.string(),
  result: z.object({
    compliant: z.boolean(),
    violations: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    riskScore: z.number().min(0).max(1)
  }),
  context: BaseContextSchema.optional()
});

// Security Operation Schemas
const SecurityOperationRequestSchema = z.object({
  operation: z.string(),
  data: z.record(z.string(), z.unknown()),
  context: z.object({
    securityLevel: z.enum(['low', 'medium', 'high', 'critical']),
    encryptionRequired: z.boolean().optional(),
    auditRequired: z.boolean().optional()
  }),
  parameters: z.record(z.string(), z.unknown()).optional()
});

const SecurityOperationResponseSchema = z.object({
  operationId: z.string(),
  result: z.object({
    success: z.boolean(),
    encrypted: z.boolean().optional(),
    auditTrail: z.string().optional(),
    securityScore: z.number().min(0).max(1).optional()
  }),
  context: BaseContextSchema.optional()
});

// Network Optimization Schemas
const NetworkOptimizationRequestSchema = z.object({
  operation: z.string(),
  metrics: z.record(z.string(), z.unknown()),
  context: z.object({
    networkType: z.string().optional(),
    optimizationTarget: z.string().optional(),
    constraints: z.record(z.string(), z.unknown()).optional()
  }),
  parameters: z.record(z.string(), z.unknown()).optional()
});

const NetworkOptimizationResponseSchema = z.object({
  optimizationId: z.string(),
  result: z.object({
    optimized: z.boolean(),
    performanceGain: z.number().optional(),
    recommendations: z.array(z.string()).optional(),
    newMetrics: z.record(z.string(), z.unknown()).optional()
  }),
  context: BaseContextSchema.optional()
});

// Composition Schemas
const CompositionRequestSchema = z.object({
  requirements: z.array(z.string()),
  context: z.object({
    domain: z.string(),
    scale: z.enum(['small', 'medium', 'large', 'enterprise']),
    constraints: z.record(z.string(), z.unknown()).optional()
  }),
  parameters: z.record(z.string(), z.unknown()).optional()
});

const CompositionResponseSchema = z.object({
  compositionId: z.string(),
  result: z.object({
    agents: z.array(z.string()),
    workflow: z.record(z.string(), z.unknown()),
    estimatedCost: z.number().optional(),
    estimatedTime: z.number().optional()
  }),
  context: BaseContextSchema.optional()
});

// ============================================================================
// EVENT SCHEMA REGISTRY
// ============================================================================

export const EVENT_SCHEMAS = {
  // Semantic Validation
  'semantic.validation.request': SemanticValidationRequestSchema,
  'semantic.validation.response': SemanticValidationResponseSchema,
  
  // Integrity Validation
  'integrity.validation.request': IntegrityValidationRequestSchema,
  'integrity.validation.response': IntegrityValidationResponseSchema,
  
  // DAG Orchestration
  'dag.orchestration.request': DAGOrchestrationRequestSchema,
  'dag.orchestration.response': z.object({
    workflowId: z.string(),
    status: z.enum(['completed', 'failed', 'partial']),
    results: z.record(z.string(), z.unknown()),
    context: BaseContextSchema.optional()
  }),
  
  // Context Propagation
  'context.propagation.request': ContextPropagationRequestSchema,
  'context.propagation.response': ContextPropagationResponseSchema,
  
  // RAG Knowledge
  'rag.knowledge.request': RAGKnowledgeRequestSchema,
  'rag.knowledge.response': RAGKnowledgeResponseSchema,
  
  // Business Logic
  'business.rule.request': BusinessRuleRequestSchema,
  'business.rule.response': BusinessRuleResponseSchema,
  
  // Compliance
  'compliance.validation.request': ComplianceValidationRequestSchema,
  'compliance.validation.response': ComplianceValidationResponseSchema,
  
  // Security
  'security.operation.request': SecurityOperationRequestSchema,
  'security.operation.response': SecurityOperationResponseSchema,
  
  // Network Performance
  'network.optimization.request': NetworkOptimizationRequestSchema,
  'network.optimization.response': NetworkOptimizationResponseSchema,
  
  // Composition
  'composition.request': CompositionRequestSchema,
  'composition.response': CompositionResponseSchema
} as const;

// ============================================================================
// EVENT VALIDATION SYSTEM
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  normalizedEvent?: {
    eventType: string;
    payload: unknown;
    context?: unknown;
  };
}

export interface EventValidationContext {
  sourceAgent: string;
  targetAgent?: string;
  timestamp: Date;
  traceId?: string;
  correlationId?: string;
}

export class EventValidationSystem {
  private static instance: EventValidationSystem;
  private validationCache: Map<string, ValidationResult> = new Map();
  
  private constructor() {}
  
  static getInstance(): EventValidationSystem {
    if (!EventValidationSystem.instance) {
      EventValidationSystem.instance = new EventValidationSystem();
    }
    return EventValidationSystem.instance;
  }
  
  /**
   * Validates and normalizes an event
   */
  validateEvent(
    eventType: string,
    payload: unknown,
    context: EventValidationContext
  ): ValidationResult {
    const cacheKey = `${eventType}-${JSON.stringify(payload)}`;
    
    // Check cache first
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }
    
    const result: ValidationResult = {
      valid: false,
      errors: [],
      warnings: []
    };
    
    try {
      // 1. Map event type
      const mappedEventType = this.mapEventType(eventType);
      if (!mappedEventType) {
        result.errors.push(`Unknown event type: ${eventType}`);
        return result;
      }
      
      // 2. Get schema for validation
      const schema = EVENT_SCHEMAS[eventType as keyof typeof EVENT_SCHEMAS];
      if (!schema) {
        result.warnings.push(`No schema found for event type: ${eventType}`);
        // Still allow the event to proceed
        result.valid = true;
        result.normalizedEvent = {
          eventType: mappedEventType,
          payload,
          context
        };
        return result;
      }
      
      // 3. Validate payload against schema
      const validationResult = schema.safeParse(payload);
      if (!validationResult.success) {
        result.errors.push(...validationResult.error.issues.map((e: any) => e.message));
        return result;
      }
      
      // 4. Validate context if present
      if (payload && typeof payload === 'object' && 'context' in payload) {
        const contextValidation = this.validateContext(payload.context as unknown);
        if (!contextValidation.valid) {
          result.warnings.push(...contextValidation.errors);
        }
      }
      
      // 5. Success - normalize event
      result.valid = true;
      result.normalizedEvent = {
        eventType: mappedEventType,
        payload: validationResult.data,
        context
      };
      
      // Cache the result
      this.validationCache.set(cacheKey, result);
      
    } catch (error) {
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return result;
  }
  
  /**
   * Maps external event types to internal event types
   */
  private mapEventType(eventType: string): string | null {
    return EVENT_TYPES[eventType as EventType] || null;
  }
  
  /**
   * Validates context structure
   */
  private validateContext(context: unknown): ValidationResult {
    const result: ValidationResult = {
      valid: false,
      errors: [],
      warnings: []
    };
    
    try {
      const contextValidation = BaseContextSchema.safeParse(context);
      if (!contextValidation.success) {
        result.errors.push(...contextValidation.error.issues.map((e: any) => e.message));
        return result;
      }
      
      result.valid = true;
    } catch (error) {
      result.errors.push(`Context validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return result;
  }
  
  /**
   * Creates a properly structured context
   */
  createContext(data: {
    id: string;
    userId?: string;
    sessionId?: string;
    domain?: string;
    state?: string;
    metadata?: Record<string, unknown>;
  }): unknown {
    return BaseContextSchema.parse(data);
  }
  
  /**
   * Validates and normalizes a context propagation request
   */
  validateContextPropagation(
    contextSlice: unknown,
    targetAgents: string[]
  ): ValidationResult {
    const result: ValidationResult = {
      valid: false,
      errors: [],
      warnings: []
    };
    
    try {
      // Validate context slice
      const contextValidation = BaseContextSchema.safeParse(contextSlice);
      if (!contextValidation.success) {
        result.errors.push(...contextValidation.error.issues.map((e: any) => e.message));
        return result;
      }
      
      // Validate target agents
      if (!Array.isArray(targetAgents) || targetAgents.length === 0) {
        result.errors.push('Target agents must be a non-empty array');
        return result;
      }
      
      // Validate each target agent
      for (const agent of targetAgents) {
        if (typeof agent !== 'string' || agent.trim() === '') {
          result.errors.push(`Invalid target agent: ${agent}`);
        }
      }
      
      if (result.errors.length === 0) {
        result.valid = true;
        result.normalizedEvent = {
          eventType: 'context.propagate',
          payload: {
            contextSlice: contextValidation.data,
            targetAgents
          }
        };
      }
      
    } catch (error) {
      result.errors.push(`Context propagation validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return result;
  }
  
  /**
   * Clears validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
  }
  
  /**
   * Gets validation statistics
   */
  getValidationStats(): {
    totalValidations: number;
    successRate: number;
    mostCommonErrors: string[];
  } {
    const totalValidations = this.validationCache.size;
    const successfulValidations = Array.from(this.validationCache.values()).filter(r => r.valid).length;
    const successRate = totalValidations > 0 ? (successfulValidations / totalValidations) * 100 : 0;
    
    // Count most common errors
    const errorCounts = new Map<string, number>();
    for (const result of this.validationCache.values()) {
      for (const error of result.errors) {
        errorCounts.set(error, (errorCounts.get(error) || 0) + 1);
      }
    }
    
    const mostCommonErrors = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error]) => error);
    
    return {
      totalValidations,
      successRate,
      mostCommonErrors
    };
  }
}

// ============================================================================
// EVENT NORMALIZATION UTILITIES
// ============================================================================

export class EventNormalizer {
  private validationSystem: EventValidationSystem;
  
  constructor() {
    this.validationSystem = EventValidationSystem.getInstance();
  }
  
  /**
   * Normalizes an event for processing
   */
  normalizeEvent(
    eventType: string,
    payload: unknown,
    context: EventValidationContext
  ): {
    eventType: string;
    payload: unknown;
    context: EventValidationContext;
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const validation = this.validationSystem.validateEvent(eventType, payload, context);
    
    return {
      eventType: validation.normalizedEvent?.eventType || eventType,
      payload: validation.normalizedEvent?.payload || payload,
      context: validation.normalizedEvent?.context as EventValidationContext || context,
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }
  
  /**
   * Creates a properly structured event
   */
  createEvent(
    eventType: string,
    payload: unknown,
    sourceAgent: string,
    options?: {
      traceId?: string;
      correlationId?: string;
      targetAgent?: string;
    }
  ): {
    eventType: string;
    payload: unknown;
    context: EventValidationContext;
  } {
    const context: EventValidationContext = {
      sourceAgent,
      targetAgent: options?.targetAgent,
      timestamp: new Date(),
      traceId: options?.traceId,
      correlationId: options?.correlationId
    };
    
    const normalized = this.normalizeEvent(eventType, payload, context);
    
    return {
      eventType: normalized.eventType,
      payload: normalized.payload,
      context: normalized.context
    };
  }
}

// ============================================================================
// CONTEXT PROPAGATION UTILITIES
// ============================================================================

export class ContextPropagator {
  private validationSystem: EventValidationSystem;
  
  constructor() {
    this.validationSystem = EventValidationSystem.getInstance();
  }
  
  /**
   * Creates a properly structured context slice
   */
  createContextSlice(data: {
    id: string;
    userId?: string;
    sessionId?: string;
    domain?: string;
    state?: string;
    metadata?: Record<string, unknown>;
  }): unknown {
    return this.validationSystem.createContext(data);
  }
  
  /**
   * Validates and prepares context propagation
   */
  prepareContextPropagation(
    contextSlice: unknown,
    targetAgents: string[],
    options?: {
      propagationType?: 'broadcast' | 'targeted' | 'filtered';
      priority?: 'low' | 'medium' | 'high' | 'critical';
      ttl?: number;
    }
  ): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    normalizedPayload?: unknown;
  } {
    const validation = this.validationSystem.validateContextPropagation(contextSlice, targetAgents);
    
    if (validation.valid && validation.normalizedEvent) {
      const payload = validation.normalizedEvent.payload as any;
      payload.propagationType = options?.propagationType || 'targeted';
      payload.priority = options?.priority || 'medium';
      payload.ttl = options?.ttl || 30000; // 30 seconds default
      
      return {
        valid: true,
        errors: [],
        warnings: validation.warnings,
        normalizedPayload: payload
      };
    }
    
    return {
      valid: false,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }
}

// Export utilities
export const eventValidationSystem = EventValidationSystem.getInstance();
export const eventNormalizer = new EventNormalizer();
export const contextPropagator = new ContextPropagator(); 