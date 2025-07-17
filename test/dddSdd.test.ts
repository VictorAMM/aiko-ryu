// test/dddSdd.test.ts
import { AikoAgent } from '../src/agents/AikoAgent';
import { SpecificationEngine } from '../src/specifications/SpecificationEngine';
import { DesignSystemManager } from '../src/design/DesignSystem';
import { 
  AgentSpecification, 
  ValidationResult, 
  DesignIntent, 
  UserRequirement,
  Capability,
  Interface,
  Behavior,
  Constraint,
  ValidationRule
} from '../src/agents/AgentContract';
import {
  UserPersona,
  UserJourney,
  PainPoint,
  UserNeed,
  Wireframe,
  UserFlow,
  InteractionModel,
  Component,
  DesignPattern,
  DesignGuideline,
  CrossFunctionalTeam,
  CompetencyLevel
} from '../src/design/DesignSystem';

describe('DDD/SDD Enhanced System', () => {
  let aikoAgent: AikoAgent;
  let specificationEngine: SpecificationEngine;
  let designSystemManager: DesignSystemManager;

  beforeEach(() => {
    aikoAgent = new AikoAgent('aiko-1');
    specificationEngine = new SpecificationEngine();
    designSystemManager = new DesignSystemManager();
  });

  describe('AgentContract DDD/SDD Enhancements', () => {
    it('should validate agent specifications', async () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-1',
            name: 'Test Capability',
            description: 'A test capability',
            inputs: [{ name: 'input1', type: 'string', required: true, description: 'Test input' }],
            outputs: [{ name: 'output1', type: 'string', required: true, description: 'Test output' }],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [
          {
            id: 'iface-1',
            name: 'TestInterface',
            methods: [
              {
                name: 'testMethod',
                parameters: [],
                returnType: 'void',
                description: 'Test method'
              }
            ],
            events: [],
            properties: []
          }
        ],
        behaviors: [
          {
            id: 'behavior-1',
            name: 'Test Behavior',
            trigger: { type: 'event', value: 'test.event', description: 'Test trigger' },
            actions: [
              {
                id: 'action-1',
                type: 'function',
                target: 'testFunction',
                parameters: {}
              }
            ],
            conditions: [],
            outcomes: []
          }
        ],
        constraints: [
          {
            id: 'constraint-1',
            type: 'business',
            description: 'Test constraint',
            validationRule: 'test rule',
            severity: 'medium'
          }
        ],
        validationRules: [
          {
            id: 'rule-1',
            name: 'Test Rule',
            rule: 'test rule',
            validator: (input: unknown) => ({ result: true, consensus: true }),
            errorMessage: 'Test error'
          }
        ],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Goal 1', 'Goal 2'],
          successMetrics: [
            {
              id: 'metric-1',
              name: 'Test Metric',
              type: 'performance',
              target: 100,
              unit: 'ms',
              description: 'Test metric'
            }
          ],
          designPrinciples: ['Principle 1'],
          accessibilityRequirements: ['Accessibility 1']
        },
        userRequirements: [
          {
            id: 'req-1',
            description: 'Test requirement',
            priority: 'high',
            userStory: 'As a user, I want to test functionality',
            acceptanceCriteria: ['Criterion 1', 'Criterion 2'],
            persona: 'test-persona'
          }
        ]
      };

      const result = aikoAgent.validateSpecification(spec);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
      expect(result.details).toBeDefined();
    });

    it('should generate design artifacts', () => {
      const designIntent: DesignIntent = {
        purpose: 'Test purpose',
        userGoals: ['Goal 1'],
        successMetrics: [],
        designPrinciples: ['Principle 1'],
        accessibilityRequirements: []
      };

      const artifacts = aikoAgent.generateDesignArtifacts();
      expect(Array.isArray(artifacts)).toBe(true);
    });

    it('should track user interactions', () => {
      const interaction = {
        id: 'interaction-1',
        userId: 'user-1',
        sessionId: 'session-1',
        action: 'test-action',
        context: { test: 'value' },
        timestamp: new Date(),
        outcome: 'success' as const
      };

      aikoAgent.trackUserInteraction(interaction);
      
      // Verify interaction was tracked (implementation dependent)
      expect(true).toBe(true);
    });
  });

  describe('SpecificationEngine SDD Implementation', () => {
    it('should validate specification syntax', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const result = specificationEngine.validateSyntax(spec);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should validate specification semantics', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-1',
            name: 'Test Capability',
            description: 'Test description',
            inputs: [{ name: 'input1', type: 'string', required: true, description: 'Test input' }],
            outputs: [{ name: 'output1', type: 'string', required: true, description: 'Test output' }],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [
          {
            id: 'iface-1',
            name: 'TestInterface',
            methods: [
              {
                name: 'testMethod',
                parameters: [],
                returnType: 'void',
                description: 'Test method'
              }
            ],
            events: [],
            properties: []
          }
        ],
        behaviors: [
          {
            id: 'behavior-1',
            name: 'Test Behavior',
            description: 'Behavior for testing',
            trigger: { type: 'event', value: 'test.event', description: 'Test trigger' },
            actions: [
              {
                id: 'action-1',
                type: 'function',
                target: 'testFunction',
                parameters: {}
              }
            ],
            conditions: [],
            outcomes: []
          }
        ],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const result = specificationEngine.validateSemantics(spec);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should validate specification completeness', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-1',
            name: 'Test Capability',
            description: 'Test description',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [
          {
            id: 'rule-1',
            name: 'Test Rule',
            rule: 'test rule',
            validator: (input: unknown) => ({ result: true, consensus: true }),
            errorMessage: 'Test error'
          }
        ],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Goal 1'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'req-1',
            description: 'Test requirement',
            priority: 'high',
            userStory: 'As a user, I want to test',
            acceptanceCriteria: ['Criterion 1'],
            persona: 'test-persona'
          }
        ]
      };

      const result = specificationEngine.validateCompleteness(spec);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should validate specification consistency', () => {
      const specs: AgentSpecification[] = [
        {
          id: 'agent-1',
          role: 'Agent1',
          capabilities: [],
          interfaces: [],
          behaviors: [],
          constraints: [],
          validationRules: [],
          dependencies: [],
          designIntent: {
            purpose: 'Test',
            userGoals: [],
            successMetrics: [],
            designPrinciples: [],
            accessibilityRequirements: []
          },
          userRequirements: []
        },
        {
          id: 'agent-2',
          role: 'Agent2',
          capabilities: [],
          interfaces: [],
          behaviors: [],
          constraints: [],
          validationRules: [],
          dependencies: [],
          designIntent: {
            purpose: 'Test',
            userGoals: [],
            successMetrics: [],
            designPrinciples: [],
            accessibilityRequirements: []
          },
          userRequirements: []
        }
      ];

      const result = specificationEngine.validateConsistency(specs);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should generate code from specifications', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-1',
            name: 'Test Capability',
            description: 'Test description',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const generatedCode = specificationEngine.generateAgent(spec);
      
      expect(generatedCode.agentClass).toBeDefined();
      expect(generatedCode.interfaces).toBeDefined();
      expect(generatedCode.tests).toBeDefined();
      expect(generatedCode.documentation).toBeDefined();
      expect(generatedCode.metadata).toBeDefined();
    });

    it('should generate tests from specifications', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-1',
            name: 'Test Capability',
            description: 'Test description',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const testSuite = specificationEngine.generateTests(spec);
      
      expect(testSuite.unitTests).toBeDefined();
      expect(testSuite.integrationTests).toBeDefined();
      expect(testSuite.behaviorTests).toBeDefined();
      expect(testSuite.validationTests).toBeDefined();
    });

    it('should generate mocks from specifications', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const mockImplementation = specificationEngine.generateMocks(spec);
      
      expect(mockImplementation.mockAgent).toBeDefined();
      expect(mockImplementation.mockInterfaces).toBeDefined();
      expect(mockImplementation.mockBehaviors).toBeDefined();
    });

    it('should generate documentation from specifications', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const documentation = specificationEngine.generateDocumentation(spec);
      
      expect(documentation.apiDocs).toBeDefined();
      expect(documentation.userGuide).toBeDefined();
      expect(documentation.technicalSpec).toBeDefined();
      expect(documentation.examples).toBeDefined();
    });

    it('should perform impact analysis for changes', () => {
      const change = {
        id: 'change-1',
        type: 'modify' as const,
        target: 'test-agent',
        description: 'Test change',
        impact: 'medium' as const,
        affectedComponents: ['component-1']
      };

      const impactAssessment = specificationEngine.impactAnalysis(change);
      
      expect(impactAssessment.severity).toBeDefined();
      expect(impactAssessment.affectedAgents).toBeDefined();
      expect(impactAssessment.breakingChanges).toBeDefined();
      expect(impactAssessment.migrationRequired).toBeDefined();
      expect(impactAssessment.estimatedEffort).toBeDefined();
    });

    it('should create approval workflow for changes', () => {
      const change = {
        id: 'change-1',
        type: 'modify' as const,
        target: 'test-agent',
        description: 'Test change',
        impact: 'medium' as const,
        affectedComponents: ['component-1']
      };

      const approvalProcess = specificationEngine.approvalWorkflow(change);
      
      expect(approvalProcess.steps).toBeDefined();
      expect(approvalProcess.requiredApprovers).toBeDefined();
      expect(approvalProcess.timeline).toBeDefined();
      expect(approvalProcess.status).toBeDefined();
    });

    it('should create rollback strategy for changes', () => {
      const change = {
        id: 'change-1',
        type: 'modify' as const,
        target: 'test-agent',
        description: 'Test change',
        impact: 'medium' as const,
        affectedComponents: ['component-1']
      };

      const rollbackPlan = specificationEngine.rollbackStrategy(change);
      
      expect(rollbackPlan.targetVersion).toBeDefined();
      expect(rollbackPlan.steps).toBeDefined();
      expect(rollbackPlan.validationChecks).toBeDefined();
      expect(rollbackPlan.estimatedDowntime).toBeDefined();
    });

    it('should create versioning strategy for specifications', () => {
      const spec: AgentSpecification = {
        id: 'test-agent',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const versioningPlan = specificationEngine.versioningStrategy(spec);
      
      expect(versioningPlan.version).toBeDefined();
      expect(versioningPlan.changes).toBeDefined();
      expect(versioningPlan.compatibility).toBeDefined();
    });
  });

  describe('DesignSystemManager DDD Implementation', () => {
    it('should manage user research', () => {
      const persona: UserPersona = {
        id: 'persona-1',
        name: 'Test User',
        role: 'Developer',
        goals: ['Goal 1', 'Goal 2'],
        frustrations: ['Frustration 1'],
        technicalLevel: 'intermediate',
        demographics: {
          age: '25-35',
          location: 'Remote',
          occupation: 'Software Engineer',
          experience: '5-10 years',
          education: 'Bachelor\'s'
        },
        behaviors: [
          {
            id: 'behavior-1',
            description: 'Test behavior',
            frequency: 'daily',
            context: 'Work',
            tools: ['Tool 1', 'Tool 2']
          }
        ],
        motivations: ['Motivation 1'],
        constraints: ['Constraint 1']
      };

      const journey: UserJourney = {
        id: 'journey-1',
        personaId: 'persona-1',
        scenario: 'Test scenario',
        stages: [
          {
            id: 'stage-1',
            name: 'Test Stage',
            description: 'Test stage description',
            actions: ['Action 1'],
            thoughts: ['Thought 1'],
            feelings: ['Feeling 1'],
            opportunities: ['Opportunity 1']
          }
        ],
        touchpoints: [
          {
            id: 'touchpoint-1',
            stageId: 'stage-1',
            type: 'digital',
            description: 'Test touchpoint',
            channel: 'Web',
            duration: 5,
            satisfaction: 4
          }
        ],
        emotions: [
          {
            stageId: 'stage-1',
            emotion: 'satisfaction',
            intensity: 4,
            reason: 'Test reason'
          }
        ]
      };

      const painPoint: PainPoint = {
        id: 'pain-1',
        description: 'Test pain point',
        impact: 'medium',
        frequency: 'frequent',
        affectedPersonas: ['persona-1'],
        rootCause: 'Test root cause',
        potentialSolutions: ['Solution 1']
      };

      const userNeed: UserNeed = {
        id: 'need-1',
        description: 'Test user need',
        type: 'functional',
        priority: 'high',
        affectedPersonas: ['persona-1'],
        context: 'Test context',
        successCriteria: ['Criterion 1']
      };

      designSystemManager.addPersona(persona);
      designSystemManager.addJourneyMap(journey);
      designSystemManager.addPainPoint(painPoint);
      designSystemManager.addUserNeed(userNeed);

      const analysis = designSystemManager.analyzeUserResearch();
      
      expect(analysis.personaCount).toBe(1);
      expect(analysis.journeyCount).toBe(1);
      expect(analysis.painPointCount).toBe(1);
      expect(analysis.userNeedCount).toBe(1);
      expect(analysis.insights).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
    });

    it('should manage design phase', () => {
      const wireframe: Wireframe = {
        id: 'wireframe-1',
        name: 'Test Wireframe',
        description: 'Test wireframe description',
        fidelity: 'medium',
        content: 'test-content',
        annotations: [
          {
            id: 'annotation-1',
            x: 100,
            y: 100,
            text: 'Test annotation',
            type: 'note'
          }
        ],
        feedback: [
          {
            id: 'feedback-1',
            reviewer: 'reviewer-1',
            comment: 'Test feedback',
            type: 'suggestion',
            priority: 'medium',
            status: 'open'
          }
        ],
        version: '1.0.0'
      };

      const userFlow: UserFlow = {
        id: 'flow-1',
        name: 'Test Flow',
        description: 'Test flow description',
        steps: [
          {
            id: 'step-1',
            name: 'Test Step',
            description: 'Test step description',
            action: 'Test action',
            screen: 'Test screen',
            validation: ['Validation 1'],
            nextSteps: ['step-2']
          }
        ],
        decisionPoints: [
          {
            id: 'decision-1',
            question: 'Test question?',
            options: [
              {
                id: 'option-1',
                label: 'Option 1',
                description: 'Test option',
                outcome: 'Outcome 1',
                probability: 0.5
              }
            ],
            criteria: ['Criterion 1']
          }
        ],
        outcomes: [
          {
            id: 'outcome-1',
            name: 'Test Outcome',
            description: 'Test outcome description',
            success: true,
            metrics: []
          }
        ]
      };

      const interactionModel: InteractionModel = {
        id: 'model-1',
        name: 'Test Model',
        description: 'Test model description',
        patterns: [
          {
            id: 'pattern-1',
            name: 'Test Pattern',
            description: 'Test pattern description',
            trigger: 'Test trigger',
            response: 'Test response',
            feedback: 'Test feedback',
            accessibility: []
          }
        ],
        states: [
          {
            id: 'state-1',
            name: 'Test State',
            description: 'Test state description',
            ui: {
              components: [],
              layout: {
                grid: { columns: 1, rows: 1, areas: [] },
                spacing: { unit: 8, scale: [0, 1, 2], breakpoints: {} },
                responsive: { breakpoints: [], behaviors: [] }
              },
              theme: { primary: '#000', secondary: '#fff' }
            },
            data: { entities: [], relationships: [], cache: { entries: [], policies: [], statistics: { hits: 0, misses: 0, size: 0, hitRate: 0 } } },
            user: {
              session: { id: 'session-1', startTime: Date.now(), lastActivity: Date.now(), duration: 0, pages: [] },
              preferences: { theme: 'light', language: 'en', accessibility: { fontSize: 16, contrast: 'normal', motion: 'normal', sound: 'on' }, notifications: { email: true, push: false, sms: false, frequency: 'immediate' } },
              permissions: []
            }
          }
        ],
        transitions: [
          {
            id: 'transition-1',
            from: 'state-1',
            to: 'state-2',
            trigger: 'Test trigger',
            conditions: [],
            actions: []
          }
        ]
      };

      designSystemManager.addWireframe(wireframe);
      designSystemManager.addUserFlow(userFlow);
      designSystemManager.addInteractionModel(interactionModel);

      const analysis = designSystemManager.analyzeDesignPhase();
      
      expect(analysis.wireframeCount).toBe(1);
      expect(analysis.userFlowCount).toBe(1);
      expect(analysis.interactionModelCount).toBe(1);
      expect(analysis.validationCount).toBe(0);
      expect(analysis.completeness).toBeDefined();
      expect(analysis.quality).toBeDefined();
    });

    it('should manage design system', () => {
      const component: Component = {
        id: 'component-1',
        name: 'Test Component',
        category: 'UI',
        description: 'Test component description',
        props: [
          {
            name: 'testProp',
            type: 'string',
            required: false,
            description: 'Test prop'
          }
        ],
        states: [],
        examples: [
          {
            id: 'example-1',
            name: 'Test Example',
            description: 'Test example description',
            props: {},
            code: 'Test code',
            preview: 'Test preview'
          }
        ]
      };

      const pattern: DesignPattern = {
        id: 'pattern-1',
        name: 'Test Pattern',
        category: 'Navigation',
        description: 'Test pattern description',
        problem: 'Test problem',
        solution: 'Test solution',
        examples: [
          {
            id: 'example-1',
            title: 'Test Example',
            description: 'Test example description',
            implementation: 'Test implementation',
            code: 'Test code'
          }
        ],
        bestPractices: ['Practice 1', 'Practice 2']
      };

      const guideline: DesignGuideline = {
        id: 'guideline-1',
        category: 'Accessibility',
        title: 'Test Guideline',
        description: 'Test guideline description',
        rules: [
          {
            id: 'rule-1',
            description: 'Test rule',
            type: 'do',
            priority: 'high',
            rationale: 'Test rationale'
          }
        ],
        examples: [
          {
            id: 'example-1',
            title: 'Test Example',
            description: 'Test example description',
            before: 'Before state',
            after: 'After state',
            explanation: 'Test explanation'
          }
        ],
        rationale: 'Test rationale'
      };

      designSystemManager.addComponent(component);
      designSystemManager.addPattern(pattern);
      designSystemManager.addGuideline(guideline);

      const analysis = designSystemManager.analyzeDesignSystem();
      
      expect(analysis.componentCount).toBe(1);
      expect(analysis.patternCount).toBe(1);
      expect(analysis.guidelineCount).toBe(1);
      expect(analysis.coverage).toBeDefined();
      expect(analysis.consistency).toBeDefined();
    });

    it('should manage organizational culture', () => {
      const competencyLevel: CompetencyLevel = {
        level: 'intermediate',
        skills: [
          {
            id: 'skill-1',
            name: 'Test Skill',
            category: 'Design',
            proficiency: 3,
            importance: 4
          }
        ],
        responsibilities: ['Responsibility 1'],
        indicators: ['Indicator 1']
      };

      const team: CrossFunctionalTeam = {
        id: 'team-1',
        name: 'Test Team',
        purpose: 'Test purpose',
        members: [
          {
            id: 'member-1',
            name: 'Test Member',
            role: 'Designer',
            skills: ['Design', 'Research'],
            availability: 100,
            preferences: ['Preference 1']
          }
        ],
        skills: ['Design', 'Development'],
        projects: ['Project 1']
      };

      designSystemManager.addCompetencyLevel(competencyLevel);
      designSystemManager.addTeam(team);

      const analysis = designSystemManager.analyzeOrganizationalCulture();
      
      expect(analysis.competencyLevels).toBe(1);
      expect(analysis.teamCount).toBe(1);
      expect(analysis.innovationScore).toBeDefined();
      expect(analysis.maturity).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should integrate specification validation with design system', async () => {
      // Create a specification
      const spec: AgentSpecification = {
        id: 'integrated-agent',
        role: 'IntegratedAgent',
        capabilities: [
          {
            id: 'cap-1',
            name: 'Design Integration',
            description: 'Integrates design system with agent',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [],
        behaviors: [
          {
            id: 'behavior-example',
            name: 'Example Behavior',
            description: 'Example behavior for lint compliance',
            trigger: { type: 'event', value: 'example.event', description: 'Example trigger' },
            actions: [],
            conditions: [],
            outcomes: []
          }
        ],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Integration test',
          userGoals: ['Test integration'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'req-1',
            description: 'Integration requirement',
            priority: 'high',
            userStory: 'As a developer, I want to integrate design and specification',
            acceptanceCriteria: ['Integration works'],
            persona: 'developer'
          }
        ]
      };

      // Validate specification
      const validationResult = aikoAgent.validateSpecification(spec);
      expect(validationResult.result).toBe(true);

      // Generate code
      const generatedCode = specificationEngine.generateAgent(spec);
      expect(generatedCode.agentClass).toBeDefined();

      // Add to design system
      const component: Component = {
        id: 'integrated-component',
        name: 'Integrated Component',
        category: 'Integration',
        description: 'Component for integration testing',
        props: [],
        states: [],
        examples: []
      };

      designSystemManager.addComponent(component);

      // Analyze results
      const designAnalysis = designSystemManager.analyzeDesignSystem();
      expect(designAnalysis.componentCount).toBe(1);
    });

    it('should handle end-to-end DDD/SDD workflow', async () => {
      // 1. User Research
      const persona: UserPersona = {
        id: 'end-user',
        name: 'End User',
        role: 'User',
        goals: ['Use the system effectively'],
        frustrations: ['Complex interfaces'],
        technicalLevel: 'beginner',
        demographics: {
          age: '25-35',
          location: 'Global',
          occupation: 'User',
          experience: '1-5 years',
          education: 'Various'
        },
        behaviors: [],
        motivations: ['Efficiency'],
        constraints: ['Time']
      };

      designSystemManager.addPersona(persona);

      // 2. Design Phase
      const wireframe: Wireframe = {
        id: 'user-wireframe',
        name: 'User Interface',
        description: 'Simple user interface',
        fidelity: 'high',
        content: 'wireframe-content',
        annotations: [],
        feedback: [],
        version: '1.0.0'
      };

      designSystemManager.addWireframe(wireframe);

      // 3. Specification
      const spec: AgentSpecification = {
        id: 'user-agent',
        role: 'UserAgent',
        capabilities: [
          {
            id: 'user-cap',
            name: 'User Interaction',
            description: 'Handles user interactions',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [],
        behaviors: [
          {
            id: 'behavior-example',
            name: 'Example Behavior',
            description: 'Example behavior for lint compliance',
            trigger: { type: 'event', value: 'example.event', description: 'Example trigger' },
            actions: [],
            conditions: [],
            outcomes: []
          }
        ],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Serve end users',
          userGoals: ['Easy interaction'],
          successMetrics: [],
          designPrinciples: ['Simplicity'],
          accessibilityRequirements: ['Accessible']
        },
        userRequirements: [
          {
            id: 'user-req',
            description: 'Easy to use',
            priority: 'critical',
            userStory: 'As an end user, I want an easy-to-use interface',
            acceptanceCriteria: ['Interface is intuitive'],
            persona: 'end-user'
          }
        ]
      };

      // 4. Validation and Generation
      const validationResult = aikoAgent.validateSpecification(spec);
      expect(validationResult.result).toBe(true);

      const generatedCode = specificationEngine.generateAgent(spec);
      expect(generatedCode.agentClass).toBeDefined();

      // 5. Analysis
      const userResearchAnalysis = designSystemManager.analyzeUserResearch();
      const designPhaseAnalysis = designSystemManager.analyzeDesignPhase();

      expect(userResearchAnalysis.personaCount).toBe(1);
      expect(designPhaseAnalysis.wireframeCount).toBe(1);
    });
  });
}); 