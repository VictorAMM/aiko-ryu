export interface AgentContract {
  readonly id: string;
  readonly role: string;
  readonly dependencies: string[];
  
  // Core lifecycle
  initialize(): Promise<void>;
  handleEvent(eventType: string, payload: unknown): Promise<void>;
  shutdown(): Promise<void>;
  
  // Observability
  emitTrace(event: TraceEvent): void;
  getStatus(): AgentStatus;
  
  // DDD/SDD additions
  validateSpecification(spec: AgentSpecification): ValidationResult;
  generateDesignArtifacts(): DesignArtifact[];
  trackUserInteraction(interaction: UserInteraction): void;
}

export interface TraceEvent {
  timestamp: Date;
  eventType: string;
  payload?: unknown;
  metadata: {
    correlationId?: string;
    sourceAgent?: string;
  };
}

export interface AgentStatus {
  status: 'initializing' | 'ready' | 'error' | 'shutting-down' | 'terminated';
  lastEvent?: string;
  lastTrace?: TraceEvent;
  uptime: number;
}

export interface ValidationResult {
  result: boolean;
  consensus: boolean;
  reason?: string;
  escalatedTo?: string;
  details?: Record<string, unknown>;
}

// DDD/SDD Enhanced Interfaces

export interface AgentSpecification {
  id: string;
  role: string;
  dependencies: string[];
  capabilities: Capability[];
  interfaces: Interface[];
  behaviors: Behavior[];
  constraints: Constraint[];
  validationRules: ValidationRule[];
  designIntent: DesignIntent;
  userRequirements: UserRequirement[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  inputs: Parameter[];
  outputs: Parameter[];
  preconditions: Condition[];
  postconditions: Condition[];
}

export interface Interface {
  id: string;
  name: string;
  methods: Method[];
  events: Event[];
  properties: Property[];
}

export interface Behavior {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  conditions: Condition[];
  outcomes: Outcome[];
}

export interface Constraint {
  id: string;
  type: 'business' | 'technical' | 'security' | 'performance';
  description: string;
  validationRule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ValidationRule {
  id: string;
  name: string;
  rule: string;
  validator: (input: unknown) => ValidationResult;
  errorMessage: string;
}

export interface DesignIntent {
  purpose: string;
  userGoals: string[];
  successMetrics: Metric[];
  designPrinciples: string[];
  accessibilityRequirements: string[];
}

export interface UserRequirement {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  userStory: string;
  acceptanceCriteria: string[];
  persona: string;
}

export interface DesignArtifact {
  id: string;
  type: 'wireframe' | 'prototype' | 'userFlow' | 'interactionModel' | 'specification';
  content: unknown;
  version: string;
  createdAt: Date;
  validatedBy: string[];
}

export interface UserInteraction {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  context: Record<string, unknown>;
  timestamp: Date;
  outcome: 'success' | 'failure' | 'partial';
  feedback?: string;
}

// Supporting interfaces

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation?: ValidationRule;
}

export interface Method {
  name: string;
  parameters: Parameter[];
  returnType: string;
  description: string;
}

export interface Event {
  name: string;
  payload: Parameter[];
  description: string;
}

export interface Property {
  name: string;
  type: string;
  readonly: boolean;
  description: string;
}

export interface Trigger {
  type: 'event' | 'schedule' | 'condition' | 'manual';
  value: string;
  description: string;
}

export interface Action {
  id: string;
  type: 'function' | 'event' | 'state-change';
  target: string;
  parameters: Record<string, unknown>;
}

export interface Condition {
  id: string;
  expression: string;
  description: string;
  operator: 'and' | 'or' | 'not';
}

export interface Outcome {
  id: string;
  type: 'success' | 'failure' | 'partial';
  description: string;
  nextActions: string[];
}

export interface Metric {
  id: string;
  name: string;
  type: 'performance' | 'usability' | 'business' | 'technical';
  target: number;
  unit: string;
  description: string;
} 