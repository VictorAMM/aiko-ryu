// Typed Event Payloads
export interface BaseEventPayload {
  timestamp: Date;
  correlationId?: string;
  sourceAgent?: string;
}

export interface SpecificationEventPayload extends BaseEventPayload {
  specificationId: string;
  action: 'validate' | 'create' | 'update' | 'delete';
  specification?: AgentSpecification;
  validationResult?: ValidationResult;
}

export interface DesignEventPayload extends BaseEventPayload {
  designId: string;
  action: 'generate' | 'validate' | 'update';
  designArtifact?: DesignArtifact;
  userContext?: UserInteraction;
}

export interface UserInteractionEventPayload extends BaseEventPayload {
  interactionId: string;
  userId: string;
  sessionId: string;
  action: string;
  context: Record<string, string | number | boolean>;
  outcome: 'success' | 'failure' | 'partial';
  feedback?: string;
}

export interface SystemEventPayload extends BaseEventPayload {
  eventType: 'initialize' | 'shutdown' | 'error' | 'status-change';
  status?: AgentStatus;
  error?: Error;
}

export interface ValidationEventPayload extends BaseEventPayload {
  ruleId: string;
  input: Record<string, any>;
  result: ValidationResult;
  context: string;
}

export interface BackupEventPayload extends BaseEventPayload {
  hash: string;
  size?: number;
  operation: 'store' | 'retrieve' | 'delete' | 'validate';
  content?: string;
}

export interface SnapshotEventPayload extends BaseEventPayload {
  snapshotId: string;
  nodeCount?: number;
  operation: 'create' | 'restore' | 'validate' | 'delete';
  result?: boolean;
}

export interface CulturalTransformationEventPayload extends BaseEventPayload {
  workshopId?: string;
  teamId?: string;
  metricId?: string;
  learningPathId?: string;
  operation: 'workshop' | 'team' | 'metric' | 'learning';
  data?: Record<string, any>;
}

export type EventPayload = 
  | SpecificationEventPayload
  | DesignEventPayload
  | UserInteractionEventPayload
  | SystemEventPayload
  | ValidationEventPayload
  | BackupEventPayload
  | SnapshotEventPayload
  | CulturalTransformationEventPayload;

export interface AgentContract {
  readonly id: string;
  readonly role: string;
  readonly dependencies: string[];
  
  // Core lifecycle
  initialize(): Promise<void>;
  handleEvent(eventType: string, payload: EventPayload): Promise<void>;
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
  payload?: EventPayload;
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
  details?: Record<string, string | number | boolean>;
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

export interface ValidationInput<T = Record<string, any>> {
  data: T;
  context: ValidationContext;
  rules: ValidationRule[];
  metadata?: Record<string, string | number | boolean>;
}

export interface ValidationContext {
  agentId: string;
  domain: string;
  timestamp: Date;
  environment: 'development' | 'staging' | 'production';
}

export interface ValidationRule {
  id: string;
  name: string;
  rule: string;
  validator: <T>(input: ValidationInput<T>) => ValidationResult;
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

export interface DesignArtifactContent {
  type: 'wireframe' | 'prototype' | 'userFlow' | 'interactionModel' | 'specification';
  data: Record<string, any>;
  metadata: Record<string, string | number | boolean>;
  schema: string;
}

export interface DesignArtifact {
  id: string;
  type: 'wireframe' | 'prototype' | 'userFlow' | 'interactionModel' | 'specification';
  content: DesignArtifactContent;
  version: string;
  createdAt: Date;
  validatedBy: string[];
}

export interface UserInteraction {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  context: Record<string, string | number | boolean>;
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
  parameters: Record<string, string | number | boolean>;
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