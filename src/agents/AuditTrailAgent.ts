import { AgentContract, ValidationResult, TraceEvent, AgentStatus, AgentSpecification, DesignArtifact, UserInteraction, EventPayload } from './AgentContract';

export class AuditTrailAgent implements AgentContract {
  readonly id: string;
  readonly role = 'AuditTrail';
  readonly dependencies: string[] = [];
  
  private status: AgentStatus = {
    status: 'initializing',
    uptime: 0
  };
  
  private logs: Record<string, unknown>[] = [];

  constructor() {
    this.id = `audittrail-${Date.now()}`;
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

  async handleEvent(eventType: string, payload: EventPayload): Promise<void> {
    this.logs.push({ eventType, payload, timestamp: Date.now() });
    this.emitTrace({
      timestamp: new Date(),
      eventType,
      payload,
      metadata: {}
    });
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

  emitTrace(event: TraceEvent): void {
    console.log(`[AuditTrailAgent:${this.id}]`, event);
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
    // Audit trail agents validate that specifications include proper traceability
    const hasTraceability = spec.capabilities.some(cap => 
      cap.name.toLowerCase().includes('trace') || 
      cap.name.toLowerCase().includes('audit') ||
      cap.name.toLowerCase().includes('log')
    );
    
    return {
      result: hasTraceability,
      consensus: hasTraceability,
      reason: hasTraceability ? undefined : 'Specification missing traceability capabilities',
      details: { specificationId: spec.id, hasTraceability }
    };
  }
  
  generateDesignArtifacts(): DesignArtifact[] {
    return [{
      id: 'audit-artifact',
      type: 'specification',
      content: {
        type: 'specification',
        data: { auditTrail: this.logs },
        metadata: { agentId: this.id, logCount: this.logs.length },
        schema: 'audit-artifact-v1'
      },
      version: '1.0.0',
      createdAt: new Date(),
      validatedBy: [this.id]
    }];
  }
  
  trackUserInteraction(interaction: UserInteraction): void {
    this.logs.push({
      type: 'user-interaction',
      interaction,
      timestamp: Date.now()
    });
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'user.interaction.tracked',
      payload: {
        interactionId: interaction.id,
        userId: interaction.userId,
        sessionId: interaction.sessionId,
        action: interaction.action,
        context: interaction.context,
        timestamp: interaction.timestamp,
        outcome: interaction.outcome,
        feedback: interaction.feedback,
        correlationId: interaction.sessionId,
        sourceAgent: this.id
      },
      metadata: {
        sourceAgent: this.id
      }
    });
  }

  async validateStep(step: unknown, domain: string, peers: AgentContract[]): Promise<ValidationResult> {
    // Require traceId for traceability
    if (typeof step === 'object' && step !== null && !(step as Record<string, unknown>).traceId) {
      return {
        result: false,
        consensus: false,
        reason: 'Missing traceId for audit trail',
        escalatedTo: this.role,
        details: { stepType: typeof step, domain }
      };
    }
    // Log peer results for traceability
    this.logs.push({ step, domain, peers: peers.map(p => p.id), timestamp: Date.now() });
    return { result: true, consensus: true, details: { stepType: typeof step, domain } };
  }
} 