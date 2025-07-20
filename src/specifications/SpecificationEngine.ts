// src/specifications/SpecificationEngine.ts
import { 
  AgentSpecification, 
  TraceEvent,
  ValidationResult, 
  ValidationRule,
  EventPayload,
  SpecificationEventPayload,
  SystemEventPayload
} from '../agents/AgentContract';

export interface SpecificationValidator {
  validateSyntax(spec: AgentSpecification): ValidationResult;
  validateSemantics(spec: AgentSpecification): ValidationResult;
  validateCompleteness(spec: AgentSpecification): ValidationResult;
  validateConsistency(specs: AgentSpecification[]): ValidationResult;
}

export interface CodeGenerator {
  generateAgent(spec: AgentSpecification): GeneratedCode;
  generateTests(spec: AgentSpecification): TestSuite;
  generateMocks(spec: AgentSpecification): MockImplementation;
  generateDocumentation(spec: AgentSpecification): Documentation;
}

export interface ChangeControl {
  impactAnalysis(change: SpecificationChange): ImpactAssessment;
  approvalWorkflow(change: SpecificationChange): ApprovalProcess;
  rollbackStrategy(change: SpecificationChange): RollbackPlan;
  versioningStrategy(spec: AgentSpecification): VersioningPlan;
}

export interface GeneratedCode {
  agentClass: string;
  interfaces: string[];
  tests: TestSuite;
  documentation: Documentation;
  metadata: {
    generatedAt: Date;
    version: string;
    dependencies: string[];
  };
}

export interface TestSuite {
  unitTests: string[];
  integrationTests: string[];
  behaviorTests: string[];
  validationTests: string[];
}

export interface MockImplementation {
  mockAgent: string;
  mockInterfaces: string[];
  mockBehaviors: string[];
}

export interface Documentation {
  apiDocs: string;
  userGuide: string;
  technicalSpec: string;
  examples: string[];
}

export interface SpecificationChange {
  id: string;
  type: 'add' | 'modify' | 'remove' | 'deprecate';
  target: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  affectedComponents: string[];
  timestamp?: Date;
}

export interface ImpactAssessment {
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAgents: string[];
  breakingChanges: string[];
  migrationRequired: boolean;
  estimatedEffort: number;
}

export interface ApprovalProcess {
  steps: ApprovalStep[];
  requiredApprovers: string[];
  timeline: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ApprovalStep {
  step: number;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface RollbackPlan {
  targetVersion: string;
  steps: RollbackStep[];
  validationChecks: string[];
  estimatedDowntime: number;
}

export interface RollbackStep {
  step: number;
  action: string;
  validation: string;
  rollbackCondition: string;
}

export interface VersioningPlan {
  version: string;
  changes: SpecificationChange[];
  compatibility: 'backward' | 'breaking' | 'new';
  migrationGuide?: string;
}

export class SpecificationEngine implements SpecificationValidator, CodeGenerator, ChangeControl {
  private specifications: Map<string, AgentSpecification> = new Map();
  private validationRules: ValidationRule[] = [];
  private changeHistory: SpecificationChange[] = [];
  
  constructor() {
    this.initializeValidationRules();
  }
  
  // SpecificationValidator Implementation
  
  validateSyntax(spec: AgentSpecification): ValidationResult {
    const errors: string[] = [];
    
    // Basic syntax validation
    if (!spec.id || typeof spec.id !== 'string') {
      errors.push('Invalid agent ID');
    }
    
    if (!spec.role || typeof spec.role !== 'string') {
      errors.push('Invalid agent role');
    }
    
    if (!Array.isArray(spec.capabilities)) {
      errors.push('Capabilities must be an array');
    }
    
    if (!Array.isArray(spec.interfaces)) {
      errors.push('Interfaces must be an array');
    }
    
    if (!Array.isArray(spec.behaviors)) {
      errors.push('Behaviors must be an array');
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Syntax errors: ${errors.join(', ')}` : undefined
    };
  }
  
  validateSemantics(spec: AgentSpecification): ValidationResult {
    const errors: string[] = [];
    
    // Validate capabilities
    for (const capability of spec.capabilities) {
      if (!capability.name || !capability.description) {
        errors.push(`Capability ${capability.id} missing required fields`);
      }
      
      // Validate inputs/outputs
      for (const input of capability.inputs) {
        if (!input.name || !input.type) {
          errors.push(`Capability ${capability.id} has invalid input definition`);
        }
      }
      
      for (const output of capability.outputs) {
        if (!output.name || !output.type) {
          errors.push(`Capability ${capability.id} has invalid output definition`);
        }
      }
    }
    
    // Validate interfaces
    for (const iface of spec.interfaces) {
      if (!iface.name) {
        errors.push(`Interface missing name`);
      }
      
      // Validate methods
      for (const method of iface.methods) {
        if (!method.name || !method.returnType) {
          errors.push(`Interface ${iface.name} has invalid method definition`);
        }
      }
    }
    
    // Validate behaviors
    for (const behavior of spec.behaviors) {
      if (!behavior.name || !behavior.trigger) {
        errors.push(`Behavior ${behavior.id} missing required fields`);
      }
      
      if (behavior.actions.length === 0) {
        errors.push(`Behavior ${behavior.id} has no actions defined`);
      }
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Semantic errors: ${errors.join(', ')}` : undefined
    };
  }
  
  validateCompleteness(spec: AgentSpecification): ValidationResult {
    const errors: string[] = [];
    
    // Check for required components
    if (!spec.designIntent) {
      errors.push('Missing design intent');
    }
    
    if (!spec.userRequirements || spec.userRequirements.length === 0) {
      errors.push('No user requirements defined');
    }
    
    if (!spec.validationRules || spec.validationRules.length === 0) {
      errors.push('No validation rules defined');
    }
    
    // Check for required capabilities
    if (spec.capabilities.length === 0) {
      errors.push('No capabilities defined');
    }
    
    // Check for required interfaces
    if (spec.interfaces.length === 0) {
      errors.push('No interfaces defined');
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Completeness errors: ${errors.join(', ')}` : undefined
    };
  }
  
  validateConsistency(specs: AgentSpecification[]): ValidationResult {
    const errors: string[] = [];
    const ids = new Set<string>();
    const roles = new Set<string>();
    
    for (const spec of specs) {
      // Check for duplicate IDs
      if (ids.has(spec.id)) {
        errors.push(`Duplicate agent ID: ${spec.id}`);
      } else {
        ids.add(spec.id);
      }
      
      // Check for duplicate roles
      if (roles.has(spec.role)) {
        errors.push(`Duplicate agent role: ${spec.role}`);
      } else {
        roles.add(spec.role);
      }
      
      // Check for circular dependencies
      const circularDeps = this.detectCircularDependencies(specs);
      if (circularDeps.length > 0) {
        errors.push(`Circular dependencies detected: ${circularDeps.join(', ')}`);
      }
    }
    
    return {
      result: errors.length === 0,
      consensus: true,
      reason: errors.length > 0 ? `Consistency errors: ${errors.join(', ')}` : undefined
    };
  }
  
  // CodeGenerator Implementation
  
  generateAgent(spec: AgentSpecification): GeneratedCode {
    const agentClass = this.generateAgentClass(spec);
    const interfaces = this.generateInterfaces(spec);
    const tests = this.generateTests(spec);
    const documentation = this.generateDocumentation(spec);
    
    return {
      agentClass,
      interfaces,
      tests,
      documentation,
      metadata: {
        generatedAt: new Date(),
        version: '1.0.0',
        dependencies: this.extractDependencies(spec)
      }
    };
  }
  
  generateTests(spec: AgentSpecification): TestSuite {
    return {
      unitTests: this.generateUnitTests(spec),
      integrationTests: this.generateIntegrationTests(spec),
      behaviorTests: this.generateBehaviorTests(spec),
      validationTests: this.generateValidationTests(spec)
    };
  }
  
  generateMocks(spec: AgentSpecification): MockImplementation {
    return {
      mockAgent: this.generateMockAgent(spec),
      mockInterfaces: this.generateMockInterfaces(spec),
      mockBehaviors: this.generateMockBehaviors(spec)
    };
  }
  
  generateDocumentation(spec: AgentSpecification): Documentation {
    return {
      apiDocs: this.generateApiDocs(spec),
      userGuide: this.generateUserGuide(spec),
      technicalSpec: this.generateTechnicalSpec(spec),
      examples: this.generateExamples(spec)
    };
  }
  
  // ChangeControl Implementation
  
  impactAnalysis(change: SpecificationChange): ImpactAssessment {
    const breakingChanges = this.identifyBreakingChanges(change);
    const migrationRequired = breakingChanges.length > 0;
    
    return {
      severity: this.calculateSeverity(change),
      affectedAgents: [],
      breakingChanges,
      migrationRequired,
      estimatedEffort: this.estimateEffort(change)
    };
  }
  
  approvalWorkflow(change: SpecificationChange): ApprovalProcess {
    const approvers = this.determineApprovers(change);
    // Inline creation of approval steps
    const steps = approvers.map((approver, index) => ({
      step: index + 1,
      approver,
      role: approver,
      status: 'pending' as const
    }));
    return {
      steps,
      requiredApprovers: approvers,
      timeline: this.calculateTimeline(change),
      status: 'pending'
    };
  }
  
  rollbackStrategy(change: SpecificationChange): RollbackPlan {
    return {
      targetVersion: this.getPreviousVersion(change.target),
      steps: this.createRollbackSteps(change),
      validationChecks: this.createValidationChecks(change),
      estimatedDowntime: this.estimateDowntime(change)
    };
  }
  
  versioningStrategy(spec: AgentSpecification): VersioningPlan {
    const changes = this.getChangesForSpec(spec.id);
    const compatibility = this.determineCompatibility(changes);
    
    return {
      version: this.calculateNextVersion(spec.id),
      changes,
      compatibility,
      migrationGuide: compatibility === 'breaking' ? this.generateMigrationGuide(changes) : undefined
    };
  }
  
  // Private helper methods
  
  private initializeValidationRules(): void {
    this.validationRules = [
      {
        id: 'spec-001',
        name: 'Agent Specification Required',
        rule: 'Agent must have a complete specification',
        // Generic input data for validation - contains the specification to be validated
        validator: (input: unknown): ValidationResult => {
          const spec = input as AgentSpecification;
          return {
            result: !!spec && !!spec.id && !!spec.role,
            consensus: true,
            reason: !spec ? 'Agent specification is required' : undefined
          };
        },
        errorMessage: 'Agent specification is required and must be complete'
      }
    ];
  }
  
  /**
   * Detects circular dependencies among agent specifications.
   * Returns an array of agent IDs that are part of a cycle, or an empty array if no cycles are found.
   */
  private detectCircularDependencies(specs: AgentSpecification[]): string[] {
    const graph: Record<string, string[]> = {};
    for (const spec of specs) {
      graph[spec.id] = spec.dependencies || [];
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[] = [];

    function dfs(node: string): boolean {
      if (!visited.has(node)) {
        visited.add(node);
        recStack.add(node);
        for (const dep of graph[node] || []) {
          if (!visited.has(dep) && dfs(dep)) {
            cycles.push(dep);
            return true;
          } else if (recStack.has(dep)) {
            cycles.push(dep);
            return true;
          }
        }
      }
      recStack.delete(node);
      return false;
    }

    for (const node of Object.keys(graph)) {
      if (dfs(node)) {
        cycles.push(node);
        break;
      }
    }

    // Return unique agent IDs involved in the cycle
    return Array.from(new Set(cycles));
  }
  
  private generateAgentClass(spec: AgentSpecification): string {
    return `
export class ${spec.role}Agent implements AgentContract {
  readonly id = '${spec.id}';
  readonly role = '${spec.role}';
  readonly dependencies = ${JSON.stringify(spec.dependencies || [])};
  
  async initialize(): Promise<void> {
    // Generated initialization logic
  }
  
  async handleEvent(eventType: string, payload: unknown): Promise<void> {
    // Generated event handling logic
  }
  
  async shutdown(): Promise<void> {
    // Generated shutdown logic
  }
  
  emitTrace(event: TraceEvent): void {
    // Generated tracing logic
  }
  
  getStatus(): AgentStatus {
    // Generated status logic
    return { status: 'ready', uptime: 0 };
  }
}`;
  }
  
  private generateInterfaces(spec: AgentSpecification): string[] {
    return spec.interfaces.map(iface => {
      const methods = iface.methods.map(method => {
        const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
        return `  ${method.name}(${params}): ${method.returnType};`;
      }).join('\n');

      const events = iface.events.map(event => {
        const payloadTypes = event.payload.map(p => p.type).join(' & ');
        return `  on${event.name}(handler: (payload: ${payloadTypes}) => void): void;`;
      }).join('\n');

      return `export interface ${iface.name} {
${methods}
${events}
}`;
    }).map(s => s.trim());
  }
  
  private generateUnitTests(spec: AgentSpecification): string[] {
    return spec.capabilities.map(capability => `
describe('${capability.name}', () => {
  it('should handle ${capability.name} correctly', () => {
    // Generated test for ${capability.name}
  });
});`).map(s => s.trim());
  }
  
  private generateIntegrationTests(spec: AgentSpecification): string[] {
    return [`describe('${spec.role} Integration', () => {
  it('should integrate with other agents correctly', () => {
    // Generated integration test
  });
});`];
  }
  
  private generateBehaviorTests(spec: AgentSpecification): string[] {
    return spec.behaviors.map(behavior => `
describe('${behavior.name} Behavior', () => {
  it('should trigger ${behavior.name} on ${behavior.trigger.type}', () => {
    // Generated behavior test
  });
});`).map(s => s.trim());
  }
  
  private generateValidationTests(spec: AgentSpecification): string[] {
    return spec.validationRules.map(rule => `
describe('${rule.name}', () => {
  it('should validate ${rule.name}', () => {
    // Generated validation test
  });
});`).map(s => s.trim());
  }
  
  private generateMockAgent(spec: AgentSpecification): string {
    const capabilities = spec.capabilities.map(cap => 
      `  async ${cap.name}(${cap.inputs.map(i => `${i.name}: ${i.type}`).join(', ')}): Promise<${cap.outputs.map(o => o.type).join(' & ')}> {
    // Mock implementation for ${cap.name}
    return {} as ${cap.outputs.map(o => o.type).join(' & ')};
  }`
    ).join('\n\n');

    const behaviors = spec.behaviors.map(behavior => 
      `  async handle${behavior.name}Event(payload: unknown): Promise<void> {
    // Mock behavior implementation for ${behavior.name}
    console.log('Mock ${spec.role}Agent: Handling ${behavior.name} event', payload);
  }`
    ).join('\n\n');

    return `export class Mock${spec.role}Agent implements AgentContract {
  readonly id = 'mock-${spec.id}';
  readonly role = '${spec.role}';
  readonly dependencies = ${JSON.stringify(spec.dependencies || [])};
  
  private status: AgentStatus = { status: 'ready', uptime: Date.now() };
  private eventHandlers: Map<string, (payload: unknown) => void> = new Map();

  async initialize(): Promise<void> {
    this.status = { status: 'ready', uptime: Date.now() };
    console.log('Mock ${spec.role}Agent: Initialized');
  }

  async handleEvent(eventType: string, payload: unknown): Promise<void> {
    const handler = this.eventHandlers.get(eventType);
    if (handler) {
      await handler(payload);
    } else {
      console.log('Mock ${spec.role}Agent: Unhandled event', eventType, payload);
    }
  }

  async shutdown(): Promise<void> {
    this.status = { status: 'shutting-down', uptime: Date.now() - this.status.uptime };
    console.log('Mock ${spec.role}Agent: Shutting down');
  }

  emitTrace(event: TraceEvent): void {
    console.log('Mock ${spec.role}Agent: Trace event', event);
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  // Mock capabilities
${capabilities}

  // Mock behaviors
${behaviors}

  // Event handler registration
  on(eventType: string, handler: (payload: unknown) => void): void {
    this.eventHandlers.set(eventType, handler);
  }

  off(eventType: string): void {
    this.eventHandlers.delete(eventType);
  }
}`;
  }
  
  private generateMockInterfaces(spec: AgentSpecification): string[] {
    return spec.interfaces.map(iface => {
      const methods = iface.methods.map(method => {
        const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
        return `  ${method.name}(${params}): ${method.returnType} {
    // Mock implementation for ${method.name}
    console.log('Mock${iface.name}: ${method.name} called with', { ${method.parameters.map(p => p.name).join(', ')} });
    return {} as ${method.returnType};
  }`;
      }).join('\n\n');

      const events = iface.events.map(event => {
        const payloadTypes = event.payload.map(p => p.type).join(' & ');
        return `  on${event.name}(handler: (payload: ${payloadTypes}) => void): void {
    // Mock event handler registration for ${event.name}
    console.log('Mock${iface.name}: ${event.name} handler registered');
  }`;
      }).join('\n\n');

      return `export class Mock${iface.name} implements ${iface.name} {
${methods}
${events}
}`;
    }).map(s => s.trim());
  }
  
  private generateMockBehaviors(spec: AgentSpecification): string[] {
    return spec.behaviors.map(behavior => {
      const actions = behavior.actions.map(action => 
        `    // Mock action: ${action.type} -> ${action.target}
    console.log('Mock${behavior.name}Behavior: Executing ${action.type} action on ${action.target}', action.parameters);`
      ).join('\n');

      const conditions = behavior.conditions.map(condition => 
        `    // Mock condition: ${condition.expression}
    console.log('Mock${behavior.name}Behavior: Checking condition ${condition.id}', condition);`
      ).join('\n');

      return `export class Mock${behavior.name}Behavior {
  async execute(payload: unknown): Promise<void> {
    console.log('Mock${behavior.name}Behavior: Starting execution', payload);
    
    // Mock conditions check
${conditions}
    
    // Mock actions execution
${actions}
    
    console.log('Mock${behavior.name}Behavior: Execution completed');
  }
}`;
    }).map(s => s.trim());
  }
  
  private generateApiDocs(spec: AgentSpecification): string {
    return `# ${spec.role} Agent API Documentation

## Overview
${spec.designIntent?.purpose || 'No purpose defined'}

## Capabilities
${spec.capabilities.map(cap => `- ${cap.name}: ${cap.description}`).join('\n')}

## Interfaces
${spec.interfaces.map(iface => `### ${iface.name}
${iface.methods.map(method => `- ${method.name}(${method.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}): ${method.returnType}`).join('\n')}`).join('\n')}`;
  }
  
  private generateUserGuide(spec: AgentSpecification): string {
    return `# ${spec.role} Agent User Guide

## Purpose
${spec.designIntent?.purpose || 'No purpose defined'}

## User Goals
${spec.designIntent?.userGoals?.map(goal => `- ${goal}`).join('\n') || 'No user goals defined'}

## Usage Examples
${spec.behaviors.map(behavior => `### ${behavior.name}
${behavior.description || 'No description available'}`).join('\n')}`;
  }
  
  private generateTechnicalSpec(spec: AgentSpecification): string {
    return `# ${spec.role} Agent Technical Specification

## Architecture
- Role: ${spec.role}
- Dependencies: ${spec.dependencies?.join(', ') || 'None'}

## Capabilities
${spec.capabilities.map(cap => `### ${cap.name}
- Description: ${cap.description}
- Inputs: ${cap.inputs.map(i => `${i.name}: ${i.type}`).join(', ')}
- Outputs: ${cap.outputs.map(o => `${o.name}: ${o.type}`).join(', ')}`).join('\n')}`;
  }
  
  private generateExamples(spec: AgentSpecification): string[] {
    return spec.behaviors.map(behavior => `
// Example: ${behavior.name}
const agent = new ${spec.role}Agent('${spec.id}');
await agent.initialize();
await agent.handleEvent('${behavior.trigger.type}', { /* payload */ });`);
  }
  
  private extractDependencies(spec: AgentSpecification): string[] {
    return spec.dependencies || [];
  }
  
  // --- High-priority stub implementations ---
  private findAffectedAgents(change: SpecificationChange): string[] {
    // Enhanced dependency analysis with comprehensive impact assessment
    const affected: string[] = [];
    
    try {
      // Direct component impact
      if (change.affectedComponents && change.affectedComponents.length > 0) {
        affected.push(...change.affectedComponents);
      } else if (change.target) {
        affected.push(change.target);
      }
      
      // Dependency graph analysis
      for (const [id, spec] of this.specifications.entries()) {
        if (spec.dependencies && spec.dependencies.includes(change.target)) {
          affected.push(id);
        }
        
        // Check for indirect dependencies
        if (spec.dependencies) {
          for (const dep of spec.dependencies) {
            if (affected.includes(dep) && !affected.includes(id)) {
              affected.push(id);
            }
          }
        }
      }
      
      // Remove duplicates and sort
      return Array.from(new Set(affected)).sort();
    } catch (error) {
      console.error('[SpecificationEngine] Error in findAffectedAgents:', error);
      return change.target ? [change.target] : [];
    }
  }

  private identifyBreakingChanges(change: SpecificationChange): string[] {
    // Enhanced breaking change detection with comprehensive analysis
    const breaking: string[] = [];
    
    try {
      // Impact-based detection
      if (change.impact === 'critical' || change.impact === 'high') {
        breaking.push(change.target);
      }
      
      // Type-based detection
      if (change.type === 'remove' || change.type === 'deprecate') {
        breaking.push(change.target);
      }
      
      // Interface/contract analysis
      if (change.description && change.description.includes('interface')) {
        breaking.push('interface-change');
      }
      
      // API signature changes
      if (change.description && change.description.includes('signature')) {
        breaking.push('api-signature-change');
      }
      
      // Data structure changes
      if (change.description && change.description.includes('structure')) {
        breaking.push('data-structure-change');
      }
      
      // Configuration changes
      if (change.description && change.description.includes('config')) {
        breaking.push('configuration-change');
      }
      
      return Array.from(new Set(breaking));
    } catch (error) {
      console.error('[SpecificationEngine] Error in identifyBreakingChanges:', error);
      return change.target ? [change.target] : [];
    }
  }

  private calculateSeverity(change: SpecificationChange): 'low' | 'medium' | 'high' | 'critical' {
    // Enhanced severity calculation with comprehensive criteria
    try {
      // Direct impact assessment
      if (change.impact === 'critical') return 'critical';
      if (change.impact === 'high') return 'high';
      
      // Component count analysis
      if (change.affectedComponents && change.affectedComponents.length > 5) return 'high';
      if (change.affectedComponents && change.affectedComponents.length > 10) return 'critical';
      
      // Change type analysis
      if (change.type === 'remove' || change.type === 'deprecate') return 'high';
      
      // Description-based analysis
      if (change.description) {
        const criticalKeywords = ['security', 'authentication', 'authorization', 'encryption', 'compliance'];
        const highKeywords = ['performance', 'scalability', 'reliability', 'availability'];
        
        if (criticalKeywords.some(keyword => change.description.toLowerCase().includes(keyword))) {
          return 'critical';
        }
        if (highKeywords.some(keyword => change.description.toLowerCase().includes(keyword))) {
          return 'high';
        }
      }
      
      // Default severity
      if (change.impact === 'medium') return 'medium';
      return 'low';
    } catch (error) {
      console.error('[SpecificationEngine] Error in calculateSeverity:', error);
      return 'medium'; // Safe default
    }
  }

  private estimateEffort(change: SpecificationChange): number {
    // Enhanced effort estimation with detailed analysis
    try {
      let base = 4; // Base hours
      
      // Type-based effort
      switch (change.type) {
        case 'add': base = 2; break;
        case 'modify': base = 4; break;
        case 'remove': base = 6; break;
        case 'deprecate': base = 3; break;
      }
      
      // Impact multiplier
      if (change.impact === 'critical') base *= 3;
      else if (change.impact === 'high') base *= 2;
      else if (change.impact === 'medium') base *= 1.5;
      
      // Component complexity
      if (change.affectedComponents) {
        base += change.affectedComponents.length * 0.5;
      }
      
      // Description complexity analysis
      if (change.description) {
        const complexityKeywords = ['integration', 'migration', 'testing', 'documentation'];
        const complexityMultiplier = complexityKeywords.filter(keyword => 
          change.description.toLowerCase().includes(keyword)
        ).length * 0.5;
        base += complexityMultiplier;
      }
      
      return Math.ceil(Math.max(1, base));
    } catch (error) {
      console.error('[SpecificationEngine] Error in estimateEffort:', error);
      return 4; // Safe default
    }
  }

  private determineApprovers(change: SpecificationChange): string[] {
    // Enhanced approver determination with role-based analysis
    const approvers: string[] = ['tech-lead'];
    
    try {
      // Impact-based approvers
      if (change.impact === 'critical' || change.impact === 'high') {
        approvers.push('product-owner', 'compliance-officer');
      }
      
      // Type-based approvers
      if (change.type === 'remove' || change.type === 'deprecate') {
        approvers.push('architect');
      }
      
      // Security-related changes
      if (change.description && change.description.toLowerCase().includes('security')) {
        approvers.push('security-officer');
      }
      
      // Performance-related changes
      if (change.description && change.description.toLowerCase().includes('performance')) {
        approvers.push('performance-engineer');
      }
      
      // Data-related changes
      if (change.description && change.description.toLowerCase().includes('data')) {
        approvers.push('data-engineer');
      }
      
      // Infrastructure changes
      if (change.description && change.description.toLowerCase().includes('infrastructure')) {
        approvers.push('devops-engineer');
      }
      
      return Array.from(new Set(approvers));
    } catch (error) {
      console.error('[SpecificationEngine] Error in determineApprovers:', error);
      return ['tech-lead']; // Safe default
    }
  }

  private calculateTimeline(change: SpecificationChange): number {
    // Enhanced timeline calculation with realistic estimates
    try {
      const effort = this.estimateEffort(change);
      const severity = this.calculateSeverity(change);
      
      let multiplier = 1;
      switch (severity) {
        case 'critical': multiplier = 2.5; break;
        case 'high': multiplier = 1.8; break;
        case 'medium': multiplier = 1.3; break;
        default: multiplier = 1;
      }
      
      // Add buffer for testing and review
      const testingBuffer = effort * 0.3;
      const reviewBuffer = effort * 0.2;
      
      const totalEffort = effort * multiplier + testingBuffer + reviewBuffer;
      
      // Convert to days (assuming 6 productive hours per day)
      return Math.ceil(totalEffort / 6);
    } catch (error) {
      console.error('[SpecificationEngine] Error in calculateTimeline:', error);
      return 1; // Safe default
    }
  }

  private getPreviousVersion(target: string): string {
    // Enhanced version retrieval with proper versioning
    try {
      const changes = this.changeHistory.filter(c => c.target === target);
      if (changes.length === 0) return '1.0.0';
      if (changes.length === 1) return '1.0.1';
      
      // Calculate version based on change history
      const majorChanges = changes.filter(c => c.impact === 'critical').length;
      const minorChanges = changes.filter(c => c.impact === 'high').length;
      const patchChanges = changes.filter(c => c.impact === 'medium' || c.impact === 'low').length;
      
      return `${1 + majorChanges}.${minorChanges}.${patchChanges}`;
    } catch (error) {
      console.error('[SpecificationEngine] Error in getPreviousVersion:', error);
      return '1.0.0'; // Safe default
    }
  }

  private createRollbackSteps(change: SpecificationChange): RollbackStep[] {
    // Enhanced rollback plan with comprehensive steps
    const steps: RollbackStep[] = [];
    
    try {
      // Primary rollback step
      steps.push({
        step: 1,
        action: `Revert ${change.type} on ${change.target}`,
        validation: 'validateRevert',
        rollbackCondition: 'if error'
      });
      
      // Type-specific rollback steps
      if (change.type === 'add') {
        steps.push({
          step: 2,
          action: `Remove ${change.target}`,
          validation: 'validateRemoval',
          rollbackCondition: 'if revert fails'
        });
      } else if (change.type === 'remove') {
        steps.push({
          step: 2,
          action: `Restore ${change.target}`,
          validation: 'validateRestore',
          rollbackCondition: 'if revert fails'
        });
      } else if (change.type === 'modify') {
        steps.push({
          step: 2,
          action: `Restore previous version of ${change.target}`,
          validation: 'validateRestore',
          rollbackCondition: 'if revert fails'
        });
      }
      
      // Data consistency check
      steps.push({
        step: steps.length + 1,
        action: 'Verify data consistency',
        validation: 'validateDataConsistency',
        rollbackCondition: 'if data corruption detected'
      });
      
      // System health check
      steps.push({
        step: steps.length + 1,
        action: 'Verify system health',
        validation: 'validateSystemHealth',
        rollbackCondition: 'if system issues detected'
      });
      
      return steps;
    } catch (error) {
      console.error('[SpecificationEngine] Error in createRollbackSteps:', error);
      return [{
        step: 1,
        action: `Emergency rollback of ${change.target}`,
        validation: 'validateEmergencyRollback',
        rollbackCondition: 'if any error'
      }];
    }
  }

  private createValidationChecks(change: SpecificationChange): string[] {
    // Enhanced validation checks with comprehensive coverage
    const checks = ['syntax-check', 'semantic-check', 'completeness-check'];
    
    try {
      // Impact-based checks
      if (change.impact === 'critical' || change.impact === 'high') {
        checks.push('compliance-check', 'integration-check', 'security-check');
      }
      
      // Type-based checks
      if (change.type === 'remove' || change.type === 'deprecate') {
        checks.push('deprecation-check', 'dependency-check');
      }
      
      // Description-based checks
      if (change.description) {
        if (change.description.toLowerCase().includes('security')) {
          checks.push('security-audit', 'vulnerability-scan');
        }
        if (change.description.toLowerCase().includes('performance')) {
          checks.push('performance-test', 'load-test');
        }
        if (change.description.toLowerCase().includes('data')) {
          checks.push('data-integrity-check', 'backup-verification');
        }
      }
      
      // Standard validation checks
      checks.push('unit-test', 'integration-test', 'regression-test');
      
      return Array.from(new Set(checks));
    } catch (error) {
      console.error('[SpecificationEngine] Error in createValidationChecks:', error);
      return ['syntax-check', 'semantic-check']; // Safe defaults
    }
  }

  private estimateDowntime(_change: SpecificationChange): number {
    // Implementation for downtime estimation
    return 30; // minutes
  }
  
  private getChangesForSpec(_specId: string): SpecificationChange[] {
    return this.changeHistory.filter(change => change.target === _specId);
  }
  
  private determineCompatibility(changes: SpecificationChange[]): 'backward' | 'breaking' | 'new' {
    const hasBreakingChanges = changes.some(change => change.impact === 'critical');
    return hasBreakingChanges ? 'breaking' : 'backward';
  }
  
  private calculateNextVersion(_specId: string): string {
    // Implementation for version calculation
    return '1.1.0';
  }
  
  private generateMigrationGuide(changes: SpecificationChange[]): string {
    return `# Migration Guide

## Breaking Changes
${changes.filter(c => c.impact === 'critical').map(c => `- ${c.description}`).join('\n')}

## Migration Steps
1. Review breaking changes
2. Update dependent code
3. Test thoroughly
4. Deploy incrementally`;
  }

  /**
   * Generates mock return values for testing purposes.
   * Provides realistic mock data for various specification components.
   */
  // Generic component context - contains the context for component generation
  private mockReturnValue(componentType: string, _context?: Record<string, unknown>): unknown {
    // Generic mock generators - contains the functions that generate mock values
    const mockGenerators = new Map<string, () => unknown>();
    
    // Add mock generators for different component types
    mockGenerators.set('string', () => 'mock_string_value');
    mockGenerators.set('number', () => 42);
    mockGenerators.set('boolean', () => true);
    mockGenerators.set('object', () => ({ mock: 'object' }));
    mockGenerators.set('array', () => ['mock', 'array']);
    
    const generator = mockGenerators.get(componentType);
    return generator ? generator() : null;
  }

  // Agent interface methods for analyzer stub resolution
  async initialize(): Promise<void> {
    // Initialize validation rules, load specifications, and prepare state
    this.initializeValidationRules();
    console.log('[SpecificationEngine] Initialization complete. Validation rules loaded:', this.validationRules.length);
    // Simulate loading from persistent storage
    // (In production, load from DB or file)
    this.specifications = new Map();
    this.changeHistory = [];
  }

  // Generic event payload data - contains the event information
  async handleEvent(eventType: string, payload: EventPayload): Promise<void> {
    this.emitTrace({
      timestamp: new Date(),
      eventType,
      payload,
      metadata: {}
    });
    
    switch (eventType) {
      case 'specification.create':
        if (this.isAgentSpecification(payload)) {
          await this.handleSpecificationCreation(payload);
        }
        break;
      case 'specification.update':
        if (this.isAgentSpecification(payload)) {
          await this.handleSpecificationUpdate(payload);
        }
        break;
      case 'specification.delete':
        if (this.isSpecificationPayload(payload)) {
          await this.handleSpecificationDeletion(payload);
        }
        break;
      case 'specification.change':
        if (this.isSpecificationChange(payload)) {
          await this.handleSpecificationChange(payload);
        }
        break;
      default:
        await this.handleUnknownEvent(eventType, payload);
        break;
    }
  }

  /**
   * Type guard to check if payload is an agent specification
   */
  // Generic payload data - contains the payload to be checked
  private isAgentSpecification(payload: unknown): payload is AgentSpecification {
    return typeof payload === 'object' && 
           payload !== null && 
           'id' in payload && 
           'role' in payload;
  }

  /**
   * Type guard to check if payload is a specification payload
   */
  // Generic payload data - contains the payload to be checked
  private isSpecificationPayload(payload: unknown): payload is { id: string } {
    return typeof payload === 'object' && 
           payload !== null && 
           'id' in payload &&
           typeof (payload as { id: unknown }).id === 'string';
  }

  /**
   * Type guard to check if payload is a specification change
   */
  // Generic payload data - contains the payload to be checked
  private isSpecificationChange(payload: unknown): payload is SpecificationChange {
    return typeof payload === 'object' && 
           payload !== null && 
           'type' in payload && 
           'target' in payload;
  }

  /**
   * Handles specification creation events
   */
  private async handleSpecificationCreation(spec: AgentSpecification): Promise<void> {
    this.specifications.set(spec.id, spec);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'specification.created',
      payload: {
        timestamp: new Date(),
        specificationId: spec.id,
        action: 'create',
        specification: spec
      } as SpecificationEventPayload,
      metadata: {}
    });
  }

  /**
   * Handles specification update events
   */
  private async handleSpecificationUpdate(spec: AgentSpecification): Promise<void> {
    this.specifications.set(spec.id, spec);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'specification.updated',
      payload: {
        timestamp: new Date(),
        specificationId: spec.id,
        action: 'update',
        specification: spec
      } as SpecificationEventPayload,
      metadata: {}
    });
  }

  /**
   * Handles specification deletion events
   */
  private async handleSpecificationDeletion(payload: { id: string }): Promise<void> {
    this.specifications.delete(payload.id);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'specification.deleted',
      payload: {
        timestamp: new Date(),
        specificationId: payload.id,
        action: 'delete'
      } as SpecificationEventPayload,
      metadata: {}
    });
  }

  /**
   * Handles specification change events
   */
  private async handleSpecificationChange(change: SpecificationChange): Promise<void> {
    this.changeHistory.push(change);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'specification.changed',
      payload: {
        timestamp: new Date(),
        specificationId: change.target,
        action: 'update',
        change
      } as SpecificationEventPayload,
      metadata: {}
    });
  }

  /**
   * Handles unknown events
   */
  private async handleUnknownEvent(eventType: string, _payload: unknown): Promise<void> {
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'system.error',
      payload: {
        timestamp: new Date(),
        eventType: 'error',
        status: { status: 'error', uptime: Date.now() },
        error: new Error(`Unknown event type: ${eventType}`)
      } as SystemEventPayload,
      metadata: {}
    });
  }

  async shutdown(): Promise<void> {
    // Persist state and cleanup
    console.log('[SpecificationEngine] Shutting down. Persisting state...');
    // (In production, save to DB or file)
    this.specifications.clear();
    this.changeHistory = [];
    console.log('[SpecificationEngine] Shutdown complete. State cleared.');
  }

  emitTrace(event: TraceEvent): void {
    // Emit trace event for observability
    const trace = {
      engine: 'SpecificationEngine',
      eventType: event.eventType,
      timestamp: event.timestamp.toISOString(),
      payload: event.payload,
      metadata: event.metadata
    };
    console.log('[SpecificationEngine] Trace event:', trace);
  }
} 