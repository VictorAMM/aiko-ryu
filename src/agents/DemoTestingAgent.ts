// src/agents/DemoTestingAgent.ts
import { EventEmitter } from 'events';
import { 
  AgentContract, 
  TraceEvent, 
  AgentStatus, 
  AgentSpecification, 
  ValidationResult, 
  EventPayload,
  ValidationRule
} from './AgentContract';

export interface DemoTest {
  id: string;
  name: string;
  description: string;
  type: 'interactive' | 'automated' | 'user-acceptance' | 'stakeholder' | 'regression' | 'performance' | 'security';
  status: 'scheduled' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  participants: DemoParticipant[];
  scenarios: DemoScenario[];
  acceptanceCriteria: string[]; // IDs of related acceptance criteria
  specifications: string[]; // IDs of related specifications
  feedback: DemoFeedback[];
  metrics: DemoMetrics;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  environment: DemoEnvironment;
  artifacts: DemoArtifact[];
}

export interface DemoParticipant {
  id: string;
  name: string;
  role: 'tester' | 'stakeholder' | 'developer' | 'product-owner' | 'end-user';
  email?: string;
  availability: 'available' | 'busy' | 'unavailable';
  expertise: 'beginner' | 'intermediate' | 'expert';
  feedback?: DemoFeedback;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  type: 'happy-path' | 'edge-case' | 'error-handling' | 'performance' | 'security' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  steps: DemoStep[];
  expectedOutcomes: string[];
  actualOutcomes?: string[];
  acceptanceCriteria: string[]; // IDs of related acceptance criteria
  duration?: number;
  errorMessage?: string;
  screenshots?: string[];
  logs?: string[];
  metadata: Record<string, unknown>;
}

export interface DemoStep {
  id: string;
  name: string;
  description: string;
  action: string;
  expectedResult: string;
  actualResult?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  duration?: number;
  errorMessage?: string;
  notes?: string;
  evidence?: string; // Screenshot, log, etc.
  acceptanceCriteria?: string[]; // IDs of related acceptance criteria
}

export interface DemoFeedback {
  id: string;
  participantId: string;
  participantName: string;
  scenarioId?: string;
  stepId?: string;
  rating: number; // 1-5
  category: 'usability' | 'functionality' | 'performance' | 'design' | 'accessibility' | 'security' | 'overall';
  comments: string;
  suggestions?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface DemoMetrics {
  totalScenarios: number;
  completedScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  skippedScenarios: number;
  successRate: number;
  averageRating: number;
  totalDuration: number;
  participantSatisfaction: number;
  acceptanceCriteriaCoverage: number;
  specificationFidelityScore: number;
}

export interface DemoEnvironment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production' | 'demo';
  url: string;
  credentials?: Record<string, string>;
  configuration: Record<string, unknown>;
  status: 'available' | 'maintenance' | 'unavailable';
}

export interface DemoArtifact {
  id: string;
  name: string;
  type: 'screenshot' | 'video' | 'log' | 'report' | 'data' | 'configuration';
  url: string;
  size: number;
  format: string;
  createdAt: Date;
  description?: string;
}

export interface DemoTestResult {
  testId: string;
  status: 'passed' | 'failed' | 'partial';
  summary: string;
  details: DemoTestResultDetail[];
  recommendations: string[];
  nextSteps: string[];
  generatedAt: Date;
}

export interface DemoTestResultDetail {
  category: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  evidence?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface DemoTestingAgentContract {
  // Demo Test Management
  createDemoTest(test: Omit<DemoTest, 'id' | 'status' | 'metrics' | 'artifacts'>): Promise<DemoTest>;
  updateDemoTest(testId: string, updates: Partial<DemoTest>): Promise<DemoTest>;
  executeDemoTest(testId: string): Promise<DemoTest>;
  cancelDemoTest(testId: string): Promise<void>;
  
  // Scenario Management
  addDemoScenario(testId: string, scenario: Omit<DemoScenario, 'id' | 'status'>): Promise<DemoScenario>;
  executeDemoScenario(testId: string, scenarioId: string): Promise<DemoScenario>;
  
  // Feedback Collection
  collectDemoFeedback(testId: string, feedback: Omit<DemoFeedback, 'id' | 'timestamp'>): Promise<DemoFeedback>;
  analyzeDemoFeedback(testId: string): Promise<DemoFeedbackAnalysis>;
  
  // Integration with Acceptance Criteria
  validateAgainstAcceptanceCriteria(testId: string): Promise<ValidationResult>;
  generateAcceptanceCriteriaReport(testId: string): Promise<string>;
  
  // Integration with Specification Fidelity
  validateSpecificationFidelity(testId: string): Promise<ValidationResult>;
  generateFidelityReport(testId: string): Promise<string>;
  
  // Comprehensive Reporting
  generateComprehensiveDemoReport(testId: string): Promise<string>;
  generateDemoTestResult(testId: string): Promise<DemoTestResult>;
}

export interface DemoFeedbackAnalysis {
  testId: string;
  overallSatisfaction: number;
  categoryScores: Record<string, number>;
  commonIssues: string[];
  positiveFeedback: string[];
  improvementSuggestions: string[];
  participantEngagement: number;
}

export class DemoTestingAgent extends EventEmitter implements DemoTestingAgentContract {
  readonly id: string;
  readonly role = 'DemoTestingOrchestrator';
  readonly dependencies: string[] = ['AcceptanceCriteriaAgent', 'SpecificationFidelityAgent'];
  
  private status: AgentStatus = {
    status: 'initializing',
    uptime: 0
  };
  private startTime: number = Date.now();
  
  // State management
  private demoTests: Map<string, DemoTest> = new Map();
  private testResults: Map<string, DemoTestResult> = new Map();
  private feedbackAnalysis: Map<string, DemoFeedbackAnalysis> = new Map();
  
  // Validation rules
  private validationRules: ValidationRule[] = [];
  
  // Distributed tracing
  private traceEvents: TraceEvent[] = [];
  
  constructor(id: string) {
    super();
    this.id = id;
    this.initializeValidationRules();
  }
  
  async initialize(): Promise<void> {
    this.startTime = Date.now();
    this.status = {
      status: 'ready',
      uptime: 0
    };
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'agent.initialized',
      metadata: { sourceAgent: this.id }
    });
  }
  
  async handleEvent(eventType: string, payload: EventPayload): Promise<void> {
    this.emitTrace({
      timestamp: new Date(),
      eventType,
      payload,
      metadata: { sourceAgent: this.id }
    });
    
    switch (eventType) {
      case 'demo_test.create':
        if ('test' in payload) {
          await this.handleCreateDemoTest(payload.test as Omit<DemoTest, 'id' | 'status' | 'metrics' | 'artifacts'>);
        }
        break;
      case 'demo_test.execute':
        if ('testId' in payload) {
          await this.handleExecuteDemoTest(payload.testId as string);
        }
        break;
      case 'demo_test.cancel':
        if ('testId' in payload) {
          await this.handleCancelDemoTest(payload.testId as string);
        }
        break;
      case 'demo_feedback.collect':
        if ('testId' in payload && 'feedback' in payload) {
          await this.handleCollectDemoFeedback(payload.testId as string, payload.feedback as Omit<DemoFeedback, 'id' | 'timestamp'>);
        }
        break;
      case 'demo_test.validate_acceptance_criteria':
        if ('testId' in payload) {
          await this.handleValidateAgainstAcceptanceCriteria(payload.testId as string);
        }
        break;
      case 'demo_test.validate_fidelity':
        if ('testId' in payload) {
          await this.handleValidateSpecificationFidelity(payload.testId as string);
        }
        break;
      default:
        await this.handleUnknownEvent(eventType, payload);
    }
  }
  
  async shutdown(): Promise<void> {
    this.status = {
      status: 'shutting-down',
      uptime: Date.now() - this.startTime
    };
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'agent.shutdown',
      metadata: { sourceAgent: this.id }
    });
  }
  
  getStatus(): AgentStatus {
    return {
      ...this.status,
      uptime: Date.now() - this.startTime
    };
  }
  
  emitTrace(event: TraceEvent): void {
    this.traceEvents.push(event);
    this.emit('trace', event);
  }
  
  // Demo Test Management
  
  async createDemoTest(test: Omit<DemoTest, 'id' | 'status' | 'metrics' | 'artifacts'>): Promise<DemoTest> {
    const id = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const demoTest: DemoTest = {
      ...test,
      id,
      status: 'scheduled',
      metrics: {
        totalScenarios: test.scenarios.length,
        completedScenarios: 0,
        passedScenarios: 0,
        failedScenarios: 0,
        skippedScenarios: 0,
        successRate: 0,
        averageRating: 0,
        totalDuration: 0,
        participantSatisfaction: 0,
        acceptanceCriteriaCoverage: 0,
        specificationFidelityScore: 0
      },
      artifacts: []
    };
    
    this.demoTests.set(id, demoTest);
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_test.created',
      metadata: { sourceAgent: this.id }
    });
    
    return demoTest;
  }
  
  async updateDemoTest(testId: string, updates: Partial<DemoTest>): Promise<DemoTest> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    const updatedTest: DemoTest = {
      ...test,
      ...updates
    };
    
    this.demoTests.set(testId, updatedTest);
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_test.updated',
      metadata: { sourceAgent: this.id }
    });
    
    return updatedTest;
  }
  
  async executeDemoTest(testId: string): Promise<DemoTest> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    test.status = 'running';
    test.startedAt = new Date();
    const startTime = Date.now();
    
    // Execute all scenarios
    for (const scenario of test.scenarios) {
      await this.executeDemoScenario(testId, scenario.id);
    }
    
    // Update test metrics
    const completedScenarios = test.scenarios.filter(s => s.status === 'completed').length;
    const passedScenarios = test.scenarios.filter(s => s.status === 'completed' && !s.errorMessage).length;
    const failedScenarios = test.scenarios.filter(s => s.status === 'failed').length;
    const skippedScenarios = test.scenarios.filter(s => s.status === 'skipped').length;
    const successRate = completedScenarios > 0 ? (passedScenarios / completedScenarios) * 100 : 0;
    const totalDuration = Date.now() - startTime;
    
    test.metrics = {
      totalScenarios: test.scenarios.length,
      completedScenarios,
      passedScenarios,
      failedScenarios,
      skippedScenarios,
      successRate,
      averageRating: test.feedback.length > 0 
        ? test.feedback.reduce((sum, f) => sum + f.rating, 0) / test.feedback.length 
        : 0,
      totalDuration,
      participantSatisfaction: test.feedback.length > 0 
        ? test.feedback.filter(f => f.rating >= 4).length / test.feedback.length * 100 
        : 0,
      acceptanceCriteriaCoverage: this.calculateAcceptanceCriteriaCoverage(test),
      specificationFidelityScore: this.calculateSpecificationFidelityScore(test)
    };
    
    test.status = successRate >= 80 ? 'completed' : 'failed';
    test.completedAt = new Date();
    test.duration = totalDuration;
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_test.completed',
      metadata: { sourceAgent: this.id }
    });
    
    return test;
  }
  
  async cancelDemoTest(testId: string): Promise<void> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    test.status = 'cancelled';
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_test.cancelled',
      metadata: { sourceAgent: this.id }
    });
  }
  
  // Scenario Management
  
  async addDemoScenario(testId: string, scenario: Omit<DemoScenario, 'id' | 'status'>): Promise<DemoScenario> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    const scenarioId = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const demoScenario: DemoScenario = {
      ...scenario,
      id: scenarioId,
      status: 'pending'
    };
    
    test.scenarios.push(demoScenario);
    
    // Update metrics
    test.metrics.totalScenarios = test.scenarios.length;
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_scenario.added',
      metadata: { sourceAgent: this.id }
    });
    
    return demoScenario;
  }
  
  async executeDemoScenario(testId: string, scenarioId: string): Promise<DemoScenario> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    const scenario = test.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Demo scenario not found: ${scenarioId}`);
    }
    
    scenario.status = 'running';
    const startTime = Date.now();
    
    try {
      // Execute all steps in the scenario
      for (const step of scenario.steps) {
        step.status = 'running';
        
        try {
          await this.executeDemoStep(step);
          step.status = 'completed';
        } catch (error) {
          step.status = 'failed';
          step.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        }
      }
      
      // Determine scenario status
      const allStepsCompleted = scenario.steps.every(s => s.status === 'completed');
      scenario.status = allStepsCompleted ? 'completed' : 'failed';
      scenario.duration = Date.now() - startTime;
      
      if (scenario.status === 'failed') {
        scenario.errorMessage = 'Some steps failed during execution';
      }
      
    } catch (error) {
      scenario.status = 'failed';
      scenario.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      scenario.duration = Date.now() - startTime;
    }
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_scenario.completed',
      metadata: { sourceAgent: this.id }
    });
    
    return scenario;
  }
  
  // Feedback Collection
  
  async collectDemoFeedback(testId: string, feedback: Omit<DemoFeedback, 'id' | 'timestamp'>): Promise<DemoFeedback> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    const feedbackId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const demoFeedback: DemoFeedback = {
      ...feedback,
      id: feedbackId,
      timestamp: new Date()
    };
    
    test.feedback.push(demoFeedback);
    
    // Update metrics
    test.metrics.averageRating = test.feedback.reduce((sum, f) => sum + f.rating, 0) / test.feedback.length;
    test.metrics.participantSatisfaction = test.feedback.filter(f => f.rating >= 4).length / test.feedback.length * 100;
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'demo_feedback.collected',
      metadata: { sourceAgent: this.id }
    });
    
    return demoFeedback;
  }
  
  async analyzeDemoFeedback(testId: string): Promise<DemoFeedbackAnalysis> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    if (test.feedback.length === 0) {
      return {
        testId,
        overallSatisfaction: 0,
        categoryScores: {},
        commonIssues: [],
        positiveFeedback: [],
        improvementSuggestions: [],
        participantEngagement: 0
      };
    }
    
    // Calculate overall satisfaction
    const overallSatisfaction = test.feedback.reduce((sum, f) => sum + f.rating, 0) / test.feedback.length;
    
    // Calculate category scores
    const categoryScores: Record<string, number> = {};
    const categoryRatings: Record<string, number[]> = {};
    
    for (const feedback of test.feedback) {
      if (!categoryRatings[feedback.category]) {
        categoryRatings[feedback.category] = [];
      }
      categoryRatings[feedback.category].push(feedback.rating);
    }
    
    for (const [category, ratings] of Object.entries(categoryRatings)) {
      categoryScores[category] = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    }
    
    // Analyze common issues and positive feedback
    const commonIssues: string[] = [];
    const positiveFeedback: string[] = [];
    
    for (const feedback of test.feedback) {
      if (feedback.rating <= 2) {
        commonIssues.push(feedback.comments);
      } else if (feedback.rating >= 4) {
        positiveFeedback.push(feedback.comments);
      }
    }
    
    // Generate improvement suggestions
    const improvementSuggestions: string[] = [];
    
    if (categoryScores['usability'] && categoryScores['usability'] < 3) {
      improvementSuggestions.push('Improve user interface and user experience');
    }
    
    if (categoryScores['performance'] && categoryScores['performance'] < 3) {
      improvementSuggestions.push('Optimize performance and response times');
    }
    
    if (categoryScores['functionality'] && categoryScores['functionality'] < 3) {
      improvementSuggestions.push('Enhance core functionality and features');
    }
    
    // Calculate participant engagement
    const participantEngagement = (test.feedback.length / test.participants.length) * 100;
    
    const analysis: DemoFeedbackAnalysis = {
      testId,
      overallSatisfaction,
      categoryScores,
      commonIssues,
      positiveFeedback,
      improvementSuggestions,
      participantEngagement
    };
    
    this.feedbackAnalysis.set(testId, analysis);
    
    return analysis;
  }
  
  // Integration with Acceptance Criteria
  
  async validateAgainstAcceptanceCriteria(testId: string): Promise<ValidationResult> {
    const test = this.demoTests.get(testId);
    if (!test) {
      return {
        result: false,
        consensus: false,
        reason: `Demo test not found: ${testId}`
      };
    }
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate that all acceptance criteria are covered
    if (test.acceptanceCriteria.length === 0) {
      warnings.push('No acceptance criteria linked to this demo test');
    }
    
    // Validate scenario coverage
    for (const scenario of test.scenarios) {
      if (scenario.acceptanceCriteria.length === 0) {
        warnings.push(`Scenario ${scenario.name} has no linked acceptance criteria`);
      }
    }
    
    // Validate step coverage
    for (const scenario of test.scenarios) {
      for (const step of scenario.steps) {
        if (step.acceptanceCriteria && step.acceptanceCriteria.length === 0) {
          warnings.push(`Step ${step.name} in scenario ${scenario.name} has no linked acceptance criteria`);
        }
      }
    }
    
    // Check if all scenarios passed
    const failedScenarios = test.scenarios.filter(s => s.status === 'failed');
    if (failedScenarios.length > 0) {
      errors.push(`${failedScenarios.length} scenarios failed during demo test`);
    }
    
    const isValid = errors.length === 0;
    const hasWarnings = warnings.length > 0;
    
    return {
      result: isValid,
      consensus: isValid && !hasWarnings,
      reason: isValid 
        ? (hasWarnings ? `Valid with warnings: ${warnings.join(', ')}` : 'All acceptance criteria validated')
        : `Validation failed: ${errors.join(', ')}`
    };
  }
  
  async generateAcceptanceCriteriaReport(testId: string): Promise<string> {
    const test = this.demoTests.get(testId);
    if (!test) {
      return 'Demo test not found';
    }
    
    let report = `# Acceptance Criteria Demo Test Report\n\n`;
    report += `**Test ID:** ${test.id}\n`;
    report += `**Name:** ${test.name}\n`;
    report += `**Status:** ${test.status}\n`;
    report += `**Coverage:** ${test.metrics.acceptanceCriteriaCoverage.toFixed(1)}%\n\n`;
    
    report += `## Acceptance Criteria Coverage\n\n`;
    report += `- **Total Acceptance Criteria:** ${test.acceptanceCriteria.length}\n`;
    report += `- **Covered in Scenarios:** ${test.scenarios.filter(s => s.acceptanceCriteria.length > 0).length}\n`;
    report += `- **Covered in Steps:** ${test.scenarios.reduce((sum, s) => sum + s.steps.filter(st => st.acceptanceCriteria && st.acceptanceCriteria.length > 0).length, 0)}\n\n`;
    
    report += `## Scenario Analysis\n\n`;
    for (const scenario of test.scenarios) {
      report += `### ${scenario.name}\n\n`;
      report += `- **Status:** ${scenario.status}\n`;
      report += `- **Acceptance Criteria:** ${scenario.acceptanceCriteria.length}\n`;
      report += `- **Steps with Criteria:** ${scenario.steps.filter(s => s.acceptanceCriteria && s.acceptanceCriteria.length > 0).length}/${scenario.steps.length}\n`;
      
      if (scenario.actualOutcomes && scenario.actualOutcomes.length > 0) {
        report += `- **Actual Outcomes:**\n`;
        for (const outcome of scenario.actualOutcomes) {
          report += `  - ${outcome}\n`;
        }
      }
      
      report += `\n`;
    }
    
    return report;
  }
  
  // Integration with Specification Fidelity
  
  async validateSpecificationFidelity(testId: string): Promise<ValidationResult> {
    const test = this.demoTests.get(testId);
    if (!test) {
      return {
        result: false,
        consensus: false,
        reason: `Demo test not found: ${testId}`
      };
    }
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate specification coverage
    if (test.specifications.length === 0) {
      warnings.push('No specifications linked to this demo test');
    }
    
    // Validate fidelity score
    if (test.metrics.specificationFidelityScore < 80) {
      errors.push(`Specification fidelity score below threshold: ${test.metrics.specificationFidelityScore.toFixed(1)}%`);
    }
    
    // Validate that scenarios align with specifications
    for (const scenario of test.scenarios) {
      if (scenario.type === 'happy-path' && scenario.status === 'failed') {
        errors.push(`Happy path scenario failed: ${scenario.name}`);
      }
    }
    
    const isValid = errors.length === 0;
    const hasWarnings = warnings.length > 0;
    
    return {
      result: isValid,
      consensus: isValid && !hasWarnings,
      reason: isValid 
        ? (hasWarnings ? `Valid with warnings: ${warnings.join(', ')}` : 'Specification fidelity validated')
        : `Fidelity validation failed: ${errors.join(', ')}`
    };
  }
  
  async generateFidelityReport(testId: string): Promise<string> {
    const test = this.demoTests.get(testId);
    if (!test) {
      return 'Demo test not found';
    }
    
    let report = `# Specification Fidelity Demo Test Report\n\n`;
    report += `**Test ID:** ${test.id}\n`;
    report += `**Name:** ${test.name}\n`;
    report += `**Fidelity Score:** ${test.metrics.specificationFidelityScore.toFixed(1)}%\n\n`;
    
    report += `## Specification Coverage\n\n`;
    report += `- **Linked Specifications:** ${test.specifications.length}\n`;
    report += `- **Scenarios Aligned:** ${test.scenarios.filter(s => s.status === 'completed').length}/${test.scenarios.length}\n`;
    report += `- **Steps Aligned:** ${test.scenarios.reduce((sum, s) => sum + s.steps.filter(st => st.status === 'completed').length, 0)}/${test.scenarios.reduce((sum, s) => sum + s.steps.length, 0)}\n\n`;
    
    report += `## Scenario Fidelity Analysis\n\n`;
    for (const scenario of test.scenarios) {
      report += `### ${scenario.name}\n\n`;
      report += `- **Type:** ${scenario.type}\n`;
      report += `- **Status:** ${scenario.status}\n`;
      report += `- **Steps Completed:** ${scenario.steps.filter(s => s.status === 'completed').length}/${scenario.steps.length}\n`;
      
      if (scenario.actualOutcomes && scenario.actualOutcomes.length > 0) {
        report += `- **Actual vs Expected:**\n`;
        for (let i = 0; i < Math.max(scenario.expectedOutcomes.length, scenario.actualOutcomes.length); i++) {
          const expected = scenario.expectedOutcomes[i] || 'Not specified';
          const actual = scenario.actualOutcomes[i] || 'Not achieved';
          const match = expected === actual ? '✅' : '❌';
          report += `  - ${match} Expected: ${expected} | Actual: ${actual}\n`;
        }
      }
      
      report += `\n`;
    }
    
    return report;
  }
  
  // Comprehensive Reporting
  
  async generateComprehensiveDemoReport(testId: string): Promise<string> {
    const test = this.demoTests.get(testId);
    if (!test) {
      return 'Demo test not found';
    }
    
    let report = `# Comprehensive Demo Test Report\n\n`;
    report += `**Test ID:** ${test.id}\n`;
    report += `**Name:** ${test.name}\n`;
    report += `**Description:** ${test.description}\n`;
    report += `**Type:** ${test.type}\n`;
    report += `**Status:** ${test.status}\n`;
    report += `**Priority:** ${test.priority}\n`;
    report += `**Scheduled:** ${test.scheduledAt.toISOString()}\n`;
    
    if (test.startedAt) {
      report += `**Started:** ${test.startedAt.toISOString()}\n`;
    }
    
    if (test.completedAt) {
      report += `**Completed:** ${test.completedAt.toISOString()}\n`;
    }
    
    if (test.duration) {
      report += `**Duration:** ${test.duration}ms\n`;
    }
    
    report += `\n## Metrics Summary\n\n`;
    report += `- **Total Scenarios:** ${test.metrics.totalScenarios}\n`;
    report += `- **Completed Scenarios:** ${test.metrics.completedScenarios}\n`;
    report += `- **Success Rate:** ${test.metrics.successRate.toFixed(1)}%\n`;
    report += `- **Average Rating:** ${test.metrics.averageRating.toFixed(1)}/5\n`;
    report += `- **Participant Satisfaction:** ${test.metrics.participantSatisfaction.toFixed(1)}%\n`;
    report += `- **Acceptance Criteria Coverage:** ${test.metrics.acceptanceCriteriaCoverage.toFixed(1)}%\n`;
    report += `- **Specification Fidelity Score:** ${test.metrics.specificationFidelityScore.toFixed(1)}%\n\n`;
    
    // Participants
    report += `## Participants\n\n`;
    for (const participant of test.participants) {
      report += `- **${participant.name}** (${participant.role}) - ${participant.expertise} level\n`;
    }
    report += `\n`;
    
    // Scenarios
    report += `## Scenarios\n\n`;
    for (const scenario of test.scenarios) {
      report += `### ${scenario.name}\n\n`;
      report += `- **Type:** ${scenario.type}\n`;
      report += `- **Priority:** ${scenario.priority}\n`;
      report += `- **Status:** ${scenario.status}\n`;
      report += `- **Steps:** ${scenario.steps.length}\n`;
      report += `- **Duration:** ${scenario.duration || 0}ms\n`;
      
      if (scenario.errorMessage) {
        report += `- **Error:** ${scenario.errorMessage}\n`;
      }
      
      report += `\n`;
    }
    
    // Feedback Analysis
    if (test.feedback.length > 0) {
      const analysis = await this.analyzeDemoFeedback(testId);
      
      report += `## Feedback Analysis\n\n`;
      report += `- **Overall Satisfaction:** ${analysis.overallSatisfaction.toFixed(1)}/5\n`;
      report += `- **Participant Engagement:** ${analysis.participantEngagement.toFixed(1)}%\n\n`;
      
      if (Object.keys(analysis.categoryScores).length > 0) {
        report += `### Category Scores\n\n`;
        for (const [category, score] of Object.entries(analysis.categoryScores)) {
          report += `- **${category}:** ${score.toFixed(1)}/5\n`;
        }
        report += `\n`;
      }
      
      if (analysis.improvementSuggestions.length > 0) {
        report += `### Improvement Suggestions\n\n`;
        for (const suggestion of analysis.improvementSuggestions) {
          report += `- ${suggestion}\n`;
        }
        report += `\n`;
      }
    }
    
    return report;
  }
  
  async generateDemoTestResult(testId: string): Promise<DemoTestResult> {
    const test = this.demoTests.get(testId);
    if (!test) {
      throw new Error(`Demo test not found: ${testId}`);
    }
    
    const details: DemoTestResultDetail[] = [];
    
    // Analyze scenario results
    const failedScenarios = test.scenarios.filter(s => s.status === 'failed');
    if (failedScenarios.length > 0) {
      details.push({
        category: 'Scenario Execution',
        status: 'failed',
        message: `${failedScenarios.length} scenarios failed`,
        impact: failedScenarios.length > test.scenarios.length / 2 ? 'high' : 'medium'
      });
    }
    
    // Analyze feedback
    if (test.metrics.averageRating < 3) {
      details.push({
        category: 'User Satisfaction',
        status: 'failed',
        message: `Low user satisfaction: ${test.metrics.averageRating.toFixed(1)}/5`,
        impact: 'high'
      });
    }
    
    // Analyze acceptance criteria coverage
    if (test.metrics.acceptanceCriteriaCoverage < 80) {
      details.push({
        category: 'Acceptance Criteria',
        status: 'warning',
        message: `Low acceptance criteria coverage: ${test.metrics.acceptanceCriteriaCoverage.toFixed(1)}%`,
        impact: 'medium'
      });
    }
    
    // Analyze specification fidelity
    if (test.metrics.specificationFidelityScore < 80) {
      details.push({
        category: 'Specification Fidelity',
        status: 'warning',
        message: `Low specification fidelity: ${test.metrics.specificationFidelityScore.toFixed(1)}%`,
        impact: 'medium'
      });
    }
    
    const status: DemoTestResult['status'] = 
      test.metrics.successRate >= 80 && test.metrics.averageRating >= 4 ? 'passed' :
      test.metrics.successRate >= 60 && test.metrics.averageRating >= 3 ? 'partial' : 'failed';
    
    const summary = status === 'passed' ? 'Demo test passed all criteria' :
                   status === 'partial' ? 'Demo test partially passed' :
                   'Demo test failed to meet criteria';
    
    const recommendations = this.generateRecommendations(test);
    const nextSteps = this.generateNextSteps(test, status);
    
    const result: DemoTestResult = {
      testId,
      status,
      summary,
      details,
      recommendations,
      nextSteps,
      generatedAt: new Date()
    };
    
    this.testResults.set(testId, result);
    
    return result;
  }
  
  // Private helper methods
  
  private initializeValidationRules(): void {
    this.validationRules = [
      {
        id: 'demo-rule-001',
        name: 'Demo Test Completeness',
        rule: 'All demo tests must have at least one scenario',
        validator: (input: unknown) => {
          const test = input as DemoTest;
          return {
            result: test.scenarios && test.scenarios.length > 0,
            consensus: true
          };
        },
        errorMessage: 'Demo test must have at least one scenario'
      },
      {
        id: 'demo-rule-002',
        name: 'Scenario Completeness',
        rule: 'All scenarios must have at least one step',
        validator: (input: unknown) => {
          const scenario = input as DemoScenario;
          return {
            result: scenario.steps && scenario.steps.length > 0,
            consensus: true
          };
        },
        errorMessage: 'Scenario must have at least one step'
      }
    ];
  }
  
  private async executeDemoStep(step: DemoStep): Promise<void> {
    const startTime = Date.now();
    
    // Simulate step execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    
    // Simulate success/failure based on step name
    if (step.name.toLowerCase().includes('fail') || step.name.toLowerCase().includes('error')) {
      throw new Error(`Step failed: ${step.name}`);
    }
    
    step.duration = Date.now() - startTime;
    step.actualResult = step.expectedResult; // Simulate successful outcome
  }
  
  private calculateAcceptanceCriteriaCoverage(test: DemoTest): number {
    if (test.acceptanceCriteria.length === 0) {
      return 0;
    }
    
    const coveredCriteria = new Set<string>();
    
    // Count criteria covered in scenarios
    for (const scenario of test.scenarios) {
      for (const criteriaId of scenario.acceptanceCriteria) {
        coveredCriteria.add(criteriaId);
      }
    }
    
    // Count criteria covered in steps
    for (const scenario of test.scenarios) {
      for (const step of scenario.steps) {
        if (step.acceptanceCriteria) {
          for (const criteriaId of step.acceptanceCriteria) {
            coveredCriteria.add(criteriaId);
          }
        }
      }
    }
    
    return (coveredCriteria.size / test.acceptanceCriteria.length) * 100;
  }
  
  private calculateSpecificationFidelityScore(test: DemoTest): number {
    if (test.specifications.length === 0) {
      return 0;
    }
    
    let score = 100;
    
    // Deduct points for failed scenarios
    const failedScenarios = test.scenarios.filter(s => s.status === 'failed');
    score -= (failedScenarios.length / test.scenarios.length) * 30;
    
    // Deduct points for low participant satisfaction
    if (test.metrics.participantSatisfaction < 80) {
      score -= (80 - test.metrics.participantSatisfaction) * 0.5;
    }
    
    return Math.max(0, score);
  }
  
  private generateRecommendations(test: DemoTest): string[] {
    const recommendations: string[] = [];
    
    if (test.metrics.successRate < 80) {
      recommendations.push('Improve scenario success rate by addressing failed scenarios');
    }
    
    if (test.metrics.averageRating < 4) {
      recommendations.push('Enhance user experience based on feedback');
    }
    
    if (test.metrics.acceptanceCriteriaCoverage < 80) {
      recommendations.push('Increase acceptance criteria coverage in demo scenarios');
    }
    
    if (test.metrics.specificationFidelityScore < 80) {
      recommendations.push('Improve alignment between demo scenarios and specifications');
    }
    
    return recommendations;
  }
  
  private generateNextSteps(test: DemoTest, status: DemoTestResult['status']): string[] {
    const nextSteps: string[] = [];
    
    if (status === 'passed') {
      nextSteps.push('Proceed with production deployment');
      nextSteps.push('Document successful demo patterns');
      nextSteps.push('Share positive feedback with stakeholders');
    } else if (status === 'partial') {
      nextSteps.push('Address identified issues before proceeding');
      nextSteps.push('Schedule follow-up demo with improvements');
      nextSteps.push('Review and update acceptance criteria');
    } else {
      nextSteps.push('Conduct root cause analysis of failures');
      nextSteps.push('Revise demo scenarios based on feedback');
      nextSteps.push('Re-evaluate acceptance criteria');
      nextSteps.push('Schedule comprehensive re-testing');
    }
    
    return nextSteps;
  }
  
  private async handleCreateDemoTest(test: Omit<DemoTest, 'id' | 'status' | 'metrics' | 'artifacts'>): Promise<void> {
    try {
      await this.createDemoTest(test);
    } catch (error) {
      console.error('Failed to create demo test:', error);
    }
  }
  
  private async handleExecuteDemoTest(testId: string): Promise<void> {
    try {
      await this.executeDemoTest(testId);
    } catch (error) {
      console.error('Failed to execute demo test:', error);
    }
  }
  
  private async handleCancelDemoTest(testId: string): Promise<void> {
    try {
      await this.cancelDemoTest(testId);
    } catch (error) {
      console.error('Failed to cancel demo test:', error);
    }
  }
  
  private async handleCollectDemoFeedback(testId: string, feedback: Omit<DemoFeedback, 'id' | 'timestamp'>): Promise<void> {
    try {
      await this.collectDemoFeedback(testId, feedback);
    } catch (error) {
      console.error('Failed to collect demo feedback:', error);
    }
  }
  
  private async handleValidateAgainstAcceptanceCriteria(testId: string): Promise<void> {
    try {
      await this.validateAgainstAcceptanceCriteria(testId);
    } catch (error) {
      console.error('Failed to validate against acceptance criteria:', error);
    }
  }
  
  private async handleValidateSpecificationFidelity(testId: string): Promise<void> {
    try {
      await this.validateSpecificationFidelity(testId);
    } catch (error) {
      console.error('Failed to validate specification fidelity:', error);
    }
  }
  
  private async handleUnknownEvent(eventType: string, payload: unknown): Promise<void> {
    console.warn(`Unknown event type: ${eventType}`, payload);
  }
} 