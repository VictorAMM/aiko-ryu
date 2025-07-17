// src/agents/AikoAgent.ts
import { 
  AgentContract, 
  TraceEvent, 
  AgentStatus, 
  AgentSpecification, 
  ValidationResult, 
  DesignArtifact, 
  UserInteraction,
  DesignIntent,
  UserRequirement,
  ValidationRule
} from './AgentContract';

export class AikoAgent implements AgentContract {
  readonly id: string;
  readonly role = 'SemanticValidator';
  readonly dependencies: string[] = [];
  
  private status: AgentStatus = {
    status: 'initializing',
    uptime: 0
  };
  
  // DDD/SDD state
  private specifications: Map<string, AgentSpecification> = new Map();
  private designArtifacts: DesignArtifact[] = [];
  private userInteractions: UserInteraction[] = [];
  private validationRules: ValidationRule[] = [];
  
  // Distributed tracing state
  private traceAttributes: Record<string, unknown> = {};
  private traceEvents: Array<{ name: string; attributes?: Record<string, unknown>; timestamp: Date }> = [];
  private traceExceptions: Array<{ error: Error; timestamp: Date }> = [];
  private traceMetrics: Array<{ eventCount: number; errorCount: number; agentUptime: number; eventType: string; timestamp: Date }> = [];
  private activeTraceContexts: Array<{ traceId: string; spanId: string; agentId: string; eventType: string; timestamp: Date }> = [];
  private completedSpans: Array<{ 
    attributes: Record<string, unknown>; 
    events: Array<{ name: string; attributes?: Record<string, unknown>; timestamp: Date }>; 
    exceptions: Array<{ error: Error; timestamp: Date }>; 
    metrics: Array<{ eventCount: number; errorCount: number; agentUptime: number; eventType: string; timestamp: Date }>; 
    timestamp: Date 
  }> = [];
  
  constructor(id: string) {
    this.id = id;
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
      metadata: {}
    });
  }
  
  async handleEvent(eventType: string, payload: unknown): Promise<void> {
    this.emitTrace({
      timestamp: new Date(),
      eventType,
      payload,
      metadata: {}
    });
    
    switch (eventType) {
      case 'specification.validate':
        await this.handleSpecificationValidation(payload as AgentSpecification);
        break;
      case 'design.artifact.generate':
        await this.handleDesignArtifactGeneration(payload as DesignIntent);
        break;
      case 'user.interaction.track':
        await this.handleUserInteractionTracking(payload as UserInteraction);
        break;
      default:
        // Handle unknown event types with semantic validation
        await this.handleUnknownEvent(eventType, payload);
        break;
    }
  }
  
  async shutdown(): Promise<void> {
    this.status = {
      status: 'shutting-down',
      uptime: Date.now() - this.status.uptime
    };
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'agent.shutdown',
      metadata: {}
    });
  }
  
  /**
   * Emits trace events with distributed tracing integration.
   * Implements OpenTelemetry-compatible tracing with span creation, 
   * context propagation, and metrics collection.
   */
  emitTrace(event: TraceEvent): void {
    // Create trace span for the event
    const span = this.createTraceSpan(event);
    
    try {
      // Add event attributes to span
      span.setAttributes({
        'agent.id': this.id,
        'agent.role': this.role,
        'event.type': event.eventType,
        'event.timestamp': event.timestamp.toISOString(),
        'trace.source': 'aiko-agent'
      });
      
      // Add event payload as span events
      span.addEvent('trace.emit', {
        'event.payload': JSON.stringify(event.payload),
        'event.metadata': JSON.stringify(event.metadata)
      });
      
      // Propagate context to downstream systems
      this.propagateTraceContext(event);
      
      // Collect metrics
      this.collectTraceMetrics(event);
      
      // Log for development/debugging
      console.log(`[AikoAgent:${this.id}]`, event);
      
    } catch (error) {
      // Handle tracing errors gracefully
      span.recordException(error as Error);
      console.error(`[AikoAgent:${this.id}] Tracing error:`, error);
    } finally {
      span.end();
    }
  }
  
  private createTraceSpan(_event: TraceEvent): {
    setAttributes: (attributes: Record<string, unknown>) => void;
    addEvent: (name: string, attributes?: Record<string, unknown>) => void;
    recordException: (error: Error) => void;
    end: () => void;
  } {
    // Mock span implementation - in production, this would use OpenTelemetry
    return {
      setAttributes: (attributes: Record<string, unknown>) => {
        // Store attributes for later use
        this.traceAttributes = { ...this.traceAttributes, ...attributes };
      },
      addEvent: (name: string, attributes?: Record<string, unknown>) => {
        // Store event for later processing
        this.traceEvents.push({ name, attributes, timestamp: new Date() });
      },
      recordException: (error: Error) => {
        // Store exception for error tracking
        this.traceExceptions.push({ error, timestamp: new Date() });
      },
      end: () => {
        // Finalize span and send to tracing system
        this.finalizeTraceSpan();
      }
    };
  }
  
  private propagateTraceContext(event: TraceEvent): void {
    // Propagate trace context to other agents and systems
    const traceContext = {
      traceId: this.generateTraceId(),
      spanId: this.generateSpanId(),
      agentId: this.id,
      eventType: event.eventType,
      timestamp: event.timestamp
    };
    
    // Store context for downstream propagation
    this.activeTraceContexts.push(traceContext);
    
    // In production, this would inject context into HTTP headers, 
    // message queues, or other communication channels
  }
  
  private collectTraceMetrics(event: TraceEvent): void {
    // Collect metrics for observability
    const metrics = {
      eventCount: this.traceEvents.length,
      errorCount: this.traceExceptions.length,
      agentUptime: Date.now() - this.status.uptime,
      eventType: event.eventType
    };
    
    // Store metrics for monitoring
    this.traceMetrics.push({ ...metrics, timestamp: new Date() });
  }
  
  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateSpanId(): string {
    return `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private finalizeTraceSpan(): void {
    // Send span data to tracing system
    const spanData = {
      attributes: this.traceAttributes,
      events: this.traceEvents,
      exceptions: this.traceExceptions,
      metrics: this.traceMetrics,
      timestamp: new Date()
    };
    
    // In production, this would send to OpenTelemetry collector
    // For now, store locally for debugging
    this.completedSpans.push(spanData);
  }
  
  getStatus(): AgentStatus {
    return {
      ...this.status,
      uptime: this.status.status === 'ready' 
        ? Date.now() - this.status.uptime 
        : this.status.uptime
    };
  }
  
  // DDD/SDD Implementation
  
  validateSpecification(spec: AgentSpecification): ValidationResult {
    const results: ValidationResult[] = [];
    
    // Validate syntax
    results.push(this.validateSyntax(spec));
    
    // Validate semantics
    results.push(this.validateSemantics(spec));
    
    // Validate completeness
    results.push(this.validateCompleteness(spec));
    
    // Validate design intent
    results.push(this.validateDesignIntent(spec.designIntent));
    
    // Validate user requirements
    results.push(this.validateUserRequirements(spec.userRequirements));
    
    // Store specification if valid
    if (results.every(r => r.result)) {
      this.specifications.set(spec.id, spec);
    }
    
    return {
      result: results.every(r => r.result),
      consensus: results.every(r => r.consensus),
      reason: results.some(r => !r.result) ? 'Specification validation failed' : undefined,
      details: {
        validationResults: results,
        specificationId: spec.id
      }
    };
  }
  
  generateDesignArtifacts(): DesignArtifact[] {
    return this.designArtifacts;
  }
  
  trackUserInteraction(interaction: UserInteraction): void {
    this.userInteractions.push(interaction);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'user.interaction.tracked',
      payload: interaction,
      metadata: {
        sourceAgent: this.id
      }
    });
  }
  
  // Private methods for DDD/SDD functionality
  
  private initializeValidationRules(): void {
    this.validationRules = [
      {
        id: 'req-001',
        name: 'Agent ID Required',
        rule: 'Agent must have a unique ID',
        validator: (input: unknown): ValidationResult => {
          const spec = input as AgentSpecification;
          return {
            result: !!spec.id && spec.id.length > 0,
            consensus: true,
            reason: !spec.id ? 'Agent ID is required' : undefined
          };
        },
        errorMessage: 'Agent ID is required and must be unique'
      },
      {
        id: 'req-002',
        name: 'Role Definition',
        rule: 'Agent must have a defined role',
        validator: (input: unknown): ValidationResult => {
          const spec = input as AgentSpecification;
          return {
            result: !!spec.role && spec.role.length > 0,
            consensus: true,
            reason: !spec.role ? 'Agent role is required' : undefined
          };
        },
        errorMessage: 'Agent role must be defined'
      },
      {
        id: 'req-003',
        name: 'Capabilities Required',
        rule: 'Agent must have at least one capability',
        validator: (input: unknown): ValidationResult => {
          const spec = input as AgentSpecification;
          return {
            result: spec.capabilities.length > 0,
            consensus: true,
            reason: spec.capabilities.length === 0 ? 'At least one capability is required' : undefined
          };
        },
        errorMessage: 'Agent must have at least one capability defined'
      }
    ];
  }
  
  private validateSyntax(spec: AgentSpecification): ValidationResult {
    const errors: string[] = [];
    
    // Check required fields
    if (!spec.id) errors.push('Missing agent ID');
    if (!spec.role) errors.push('Missing agent role');
    if (!spec.capabilities || spec.capabilities.length === 0) {
      errors.push('No capabilities defined');
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Syntax errors: ${errors.join(', ')}` : undefined
    };
  }
  
  private validateSemantics(spec: AgentSpecification): ValidationResult {
    const errors: string[] = [];
    
    // Validate capability semantics
    for (const capability of spec.capabilities) {
      if (!capability.name) errors.push(`Capability missing name`);
      if (!capability.description) errors.push(`Capability ${capability.name} missing description`);
    }
    
    // Validate interface semantics
    for (const iface of spec.interfaces) {
      if (!iface.name) errors.push(`Interface missing name`);
      if (iface.methods.length === 0 && iface.events.length === 0) {
        errors.push(`Interface ${iface.name} has no methods or events`);
      }
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Semantic errors: ${errors.join(', ')}` : undefined
    };
  }
  
  private validateCompleteness(spec: AgentSpecification): ValidationResult {
    const errors: string[] = [];
    
    // Check if all required components are present
    if (!spec.designIntent) errors.push('Missing design intent');
    if (!spec.userRequirements || spec.userRequirements.length === 0) {
      errors.push('No user requirements defined');
    }
    if (!spec.validationRules || spec.validationRules.length === 0) {
      errors.push('No validation rules defined');
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Completeness errors: ${errors.join(', ')}` : undefined
    };
  }
  
  private validateDesignIntent(designIntent: DesignIntent): ValidationResult {
    const errors: string[] = [];
    
    if (!designIntent.purpose) errors.push('Missing design purpose');
    if (!designIntent.userGoals || designIntent.userGoals.length === 0) {
      errors.push('No user goals defined');
    }
    if (!designIntent.successMetrics || designIntent.successMetrics.length === 0) {
      errors.push('No success metrics defined');
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Design intent errors: ${errors.join(', ')}` : undefined
    };
  }
  
  private validateUserRequirements(requirements: UserRequirement[]): ValidationResult {
    const errors: string[] = [];
    
    for (const req of requirements) {
      if (!req.description) errors.push(`Requirement ${req.id} missing description`);
      if (!req.userStory) errors.push(`Requirement ${req.id} missing user story`);
      if (!req.acceptanceCriteria || req.acceptanceCriteria.length === 0) {
        errors.push(`Requirement ${req.id} missing acceptance criteria`);
      }
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `User requirement errors: ${errors.join(', ')}` : undefined
    };
  }
  
  // Event handlers
  
  private async handleSpecificationValidation(spec: AgentSpecification): Promise<void> {
    const result = this.validateSpecification(spec);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'specification.validated',
      payload: { specification: spec, result },
      metadata: { sourceAgent: this.id }
    });
  }
  
  private async handleDesignArtifactGeneration(designIntent: DesignIntent): Promise<void> {
    const artifact: DesignArtifact = {
      id: `artifact-${Date.now()}`,
      type: 'specification',
      content: designIntent,
      version: '1.0.0',
      createdAt: new Date(),
      validatedBy: [this.id]
    };
    
    this.designArtifacts.push(artifact);
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'design.artifact.generated',
      payload: artifact,
      metadata: { sourceAgent: this.id }
    });
  }
  
  private async handleUserInteractionTracking(interaction: UserInteraction): Promise<void> {
    this.trackUserInteraction(interaction);
  }

  private async handleUnknownEvent(eventType: string, payload: unknown): Promise<void> {
    // Semantic validation for unknown event types
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'unknown.event.received',
      payload: { eventType, payload },
      metadata: {
        sourceAgent: this.id
      }
    });
  }
} 