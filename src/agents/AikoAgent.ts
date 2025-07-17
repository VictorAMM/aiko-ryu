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
        // TODO: Implement semantic validation logic
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
  
  emitTrace(event: TraceEvent): void {
    // TODO: Connect to tracing system
    console.log(`[AikoAgent:${this.id}]`, event);
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
} 