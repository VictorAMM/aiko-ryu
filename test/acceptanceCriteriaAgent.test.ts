// test/acceptanceCriteriaAgent.test.ts
import { AcceptanceCriteriaAgent } from '../src/agents/AcceptanceCriteriaAgent';
import { AgentSpecification } from '../src/agents/AgentContract';

describe('AcceptanceCriteriaAgent', () => {
  let acceptanceCriteriaAgent: AcceptanceCriteriaAgent;

  beforeEach(() => {
    acceptanceCriteriaAgent = new AcceptanceCriteriaAgent('test-acceptance-criteria-agent');
  });

  afterEach(async () => {
    await acceptanceCriteriaAgent.shutdown();
  });

  describe('Agent Initialization', () => {
    it('should initialize acceptance criteria agent', async () => {
      await acceptanceCriteriaAgent.initialize();
      
      const status = acceptanceCriteriaAgent.getStatus();
      expect(status.status).toBe('running');
      expect(status.uptime).toBeGreaterThan(0);
    });

    it('should handle initialization events', async () => {
      const traceEvents: any[] = [];
      acceptanceCriteriaAgent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await acceptanceCriteriaAgent.initialize();
      
      expect(traceEvents.length).toBeGreaterThan(0);
      expect(traceEvents.some(e => e.eventType === 'agent.initialized')).toBe(true);
    });
  });

  describe('Acceptance Criteria Management', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should create acceptance criteria', async () => {
      const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'User Authentication',
        description: 'Users should be able to authenticate securely',
        type: 'functional',
        priority: 'high',
        status: 'pending',
        criteria: [
          'User can enter valid credentials',
          'User receives appropriate error for invalid credentials',
          'User session is maintained after successful login'
        ],
        testCases: [
          {
            id: 'test-001',
            name: 'Valid Login Test',
            description: 'Test successful login with valid credentials',
            type: 'unit',
            status: 'pending',
            steps: [
              {
                id: 'step-001',
                name: 'Enter valid credentials',
                action: 'Enter username and password',
                expectedOutcome: 'Credentials accepted',
                status: 'pending'
              }
            ],
            expectedResult: 'User is logged in successfully',
            metadata: {}
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 8
      });

      expect(criteria.id).toBeDefined();
      expect(criteria.name).toBe('User Authentication');
      expect(criteria.status).toBe('pending');
      expect(criteria.criteria.length).toBe(3);
      expect(criteria.testCases.length).toBe(1);
    });

    it('should validate acceptance criteria', async () => {
      const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'Data Validation',
        description: 'Input data should be validated properly',
        type: 'functional',
        priority: 'medium',
        status: 'pending',
        criteria: ['Input is validated', 'Error messages are clear'],
        testCases: [
          {
            id: 'test-002',
            name: 'Input Validation Test',
            description: 'Test input validation',
            type: 'unit',
            status: 'pending',
            steps: [
              {
                id: 'step-002',
                name: 'Enter invalid data',
                action: 'Enter invalid input',
                expectedOutcome: 'Validation error shown',
                status: 'pending'
              }
            ],
            expectedResult: 'Validation error is displayed',
            metadata: {}
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 4
      });

      const validation = await acceptanceCriteriaAgent.validateAcceptanceCriteria(criteria);
      
      expect(validation.result).toBe(true);
      expect(validation.consensus).toBe(true);
    });

    it('should execute acceptance criteria', async () => {
      const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'Performance Test',
        description: 'System should meet performance requirements',
        type: 'non-functional',
        priority: 'high',
        status: 'pending',
        criteria: ['Response time under 200ms', 'Throughput of 1000 requests/second'],
        testCases: [
          {
            id: 'test-003',
            name: 'Performance Test Case',
            description: 'Test system performance',
            type: 'performance',
            status: 'pending',
            steps: [
              {
                id: 'step-003',
                name: 'Measure response time',
                action: 'Send request and measure time',
                expectedOutcome: 'Response time < 200ms',
                status: 'pending'
              }
            ],
            expectedResult: 'Performance requirements met',
            metadata: {}
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 12
      });

      const result = await acceptanceCriteriaAgent.executeAcceptanceCriteria(criteria.id);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should update acceptance criteria', async () => {
      const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'Security Test',
        description: 'Security requirements should be met',
        type: 'security',
        priority: 'critical',
        status: 'pending',
        criteria: ['Authentication is secure', 'Data is encrypted'],
        testCases: [],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 16
      });

      const updatedCriteria = await acceptanceCriteriaAgent.updateAcceptanceCriteria(criteria.id, {
        status: 'in-progress',
        estimatedEffort: 20
      });

      expect(updatedCriteria.status).toBe('in-progress');
      expect(updatedCriteria.estimatedEffort).toBe(20);
    });
  });

  describe('Specification Fidelity', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should check specification fidelity', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-001',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-001',
            name: 'Data Processing',
            description: 'Process data efficiently',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [
          {
            id: 'iface-001',
            name: 'DataInterface',
            methods: [],
            events: [],
            properties: []
          }
        ],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Process data'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'req-001',
            description: 'Process data efficiently',
            priority: 'high',
            userStory: 'As a user, I want data to be processed efficiently',
            acceptanceCriteria: ['Data is processed within 1 second'],
            persona: 'Data Analyst'
          }
        ]
      };

      const checks = await acceptanceCriteriaAgent.checkSpecificationFidelity(specification);
      
      expect(checks.length).toBeGreaterThan(0);
      expect(checks.some(check => check.checkType === 'syntax')).toBe(true);
      expect(checks.some(check => check.checkType === 'semantics')).toBe(true);
    });

    it('should validate specification traceability', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-002',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Test functionality'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'req-002',
            description: 'Test requirement',
            priority: 'high',
            userStory: 'As a user, I want to test functionality',
            acceptanceCriteria: ['Test passes'],
            persona: 'Tester'
          }
        ]
      };

      const result = await acceptanceCriteriaAgent.validateSpecificationTraceability(specification);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should generate fidelity report', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-003',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Test functionality'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      // First check fidelity
      await acceptanceCriteriaAgent.checkSpecificationFidelity(specification);
      
      // Then generate report
      const report = await acceptanceCriteriaAgent.generateFidelityReport(specification.id);
      
      expect(report).toContain('Specification Fidelity Report');
      expect(report).toContain(specification.id);
    });
  });

  describe('Demo Testing', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should create demo test', async () => {
      const test = await acceptanceCriteriaAgent.createDemoTest({
        name: 'User Interface Demo',
        description: 'Demonstrate user interface functionality',
        type: 'interactive',
        participants: [
          {
            id: 'participant-001',
            name: 'John Doe',
            role: 'tester',
            availability: 'available',
            expertise: 'intermediate'
          }
        ],
        scenarios: [
          {
            id: 'scenario-001',
            name: 'Login Flow',
            description: 'Test user login process',
            type: 'happy-path',
            priority: 'high',
            steps: [
              {
                id: 'step-001',
                name: 'Enter credentials',
                action: 'Enter username and password',
                expectedResult: 'Login form accepts input',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['User can log in successfully'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-001',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(test.id).toBeDefined();
      expect(test.name).toBe('User Interface Demo');
      expect(test.status).toBe('scheduled');
      expect(test.scenarios.length).toBe(1);
    });

    it('should execute demo test', async () => {
      const test = await acceptanceCriteriaAgent.createDemoTest({
        name: 'API Demo',
        description: 'Demonstrate API functionality',
        type: 'automated',
        participants: [],
        scenarios: [
          {
            id: 'scenario-002',
            name: 'API Endpoint Test',
            description: 'Test API endpoint',
            type: 'happy-path',
            priority: 'high',
            steps: [
              {
                id: 'step-002',
                name: 'Send request',
                action: 'Send HTTP request',
                expectedResult: 'Response received',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['API responds correctly'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-002',
          name: 'API Test Environment',
          type: 'staging',
          url: 'https://api.test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const executedTest = await acceptanceCriteriaAgent.executeDemoTest(test.id);
      
      expect(executedTest.status).toBe('completed');
      expect(executedTest.metrics.totalScenarios).toBe(1);
      expect(executedTest.metrics.completedScenarios).toBe(1);
    });

    it('should collect demo feedback', async () => {
      const test = await acceptanceCriteriaAgent.createDemoTest({
        name: 'User Experience Demo',
        description: 'Test user experience',
        type: 'user-acceptance',
        participants: [
          {
            id: 'participant-002',
            name: 'Jane Smith',
            role: 'end-user',
            availability: 'available',
            expertise: 'beginner'
          }
        ],
        scenarios: [],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-003',
          name: 'UX Test Environment',
          type: 'staging',
          url: 'https://ux.test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const feedback = await acceptanceCriteriaAgent.collectDemoFeedback(test.id, {
        participantId: 'participant-002',
        participantName: 'Jane Smith',
        rating: 4,
        category: 'usability',
        comments: 'Interface is intuitive and easy to use'
      });

      expect(feedback.id).toBeDefined();
      expect(feedback.rating).toBe(4);
      expect(feedback.category).toBe('usability');
    });

    it('should generate demo report', async () => {
      const test = await acceptanceCriteriaAgent.createDemoTest({
        name: 'Comprehensive Demo',
        description: 'Comprehensive system demonstration',
        type: 'stakeholder',
        participants: [
          {
            id: 'participant-003',
            name: 'Stakeholder',
            role: 'stakeholder',
            availability: 'available',
            expertise: 'expert'
          }
        ],
        scenarios: [
          {
            id: 'scenario-003',
            name: 'Full System Demo',
            description: 'Demonstrate full system functionality',
            type: 'happy-path',
            priority: 'critical',
            steps: [
              {
                id: 'step-003',
                name: 'System startup',
                action: 'Start the system',
                expectedResult: 'System starts successfully',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['System functions correctly'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-004',
          name: 'Production Demo Environment',
          type: 'demo',
          url: 'https://demo.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const report = await acceptanceCriteriaAgent.generateDemoReport(test.id);
      
      expect(report).toContain('Demo Test Report');
      expect(report).toContain(test.id);
      expect(report).toContain(test.name);
    });
  });

  describe('Integrated Testing', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should run integrated tests', async () => {
      const result = await acceptanceCriteriaAgent.runIntegratedTests('test-spec-001');
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
    });

    it('should generate test report', async () => {
      const report = await acceptanceCriteriaAgent.generateTestReport('test-spec-001');
      
      expect(report).toContain('Integrated Test Report');
      expect(report).toContain('test-spec-001');
    });

    it('should validate code quality', async () => {
      const result = await acceptanceCriteriaAgent.validateCodeQuality('test-spec-001');
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should handle acceptance criteria creation events', async () => {
      const traceEvents: any[] = [];
      acceptanceCriteriaAgent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await acceptanceCriteriaAgent.handleEvent('acceptance_criteria.create', {
        criteria: {
          name: 'Test Criteria',
          description: 'Test description',
          type: 'functional',
          priority: 'medium',
          status: 'pending',
          criteria: ['Test criterion'],
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4
        }
      });

      expect(traceEvents.length).toBeGreaterThan(0);
    });

    it('should handle specification fidelity check events', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-004',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Test functionality'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      await acceptanceCriteriaAgent.handleEvent('specification.fidelity.check', {
        specification
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle demo test creation events', async () => {
      await acceptanceCriteriaAgent.handleEvent('demo_test.create', {
        test: {
          name: 'Test Demo',
          description: 'Test demo description',
          type: 'interactive',
          participants: [],
          scenarios: [],
          acceptanceCriteria: [],
          specifications: [],
          feedback: [],
          scheduledAt: new Date(),
          environment: {
            id: 'env-005',
            name: 'Test Environment',
            type: 'staging',
            url: 'https://test.example.com',
            configuration: {},
            status: 'available'
          }
        }
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle unknown events gracefully', async () => {
      await acceptanceCriteriaAgent.handleEvent('unknown_event', {
        data: 'test data'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should handle invalid acceptance criteria gracefully', async () => {
      try {
        await acceptanceCriteriaAgent.createAcceptanceCriteria({
          name: '', // Invalid: empty name
          description: 'Test description',
          type: 'functional',
          priority: 'medium',
          status: 'pending',
          criteria: [], // Invalid: empty criteria
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent acceptance criteria updates', async () => {
      try {
        await acceptanceCriteriaAgent.updateAcceptanceCriteria('non-existent-id', {
          status: 'completed'
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent demo test execution', async () => {
      try {
        await acceptanceCriteriaAgent.executeDemoTest('non-existent-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Performance and Scalability', () => {
    beforeEach(async () => {
      await acceptanceCriteriaAgent.initialize();
    });

    it('should handle multiple acceptance criteria efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 10 }, (_, i) => 
        acceptanceCriteriaAgent.createAcceptanceCriteria({
          name: `Test Criteria ${i}`,
          description: `Test description ${i}`,
          type: 'functional',
          priority: 'medium',
          status: 'pending',
          criteria: [`Criterion ${i}`],
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4
        })
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results.length).toBe(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple fidelity checks efficiently', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-005',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test purpose',
          userGoals: ['Test functionality'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const startTime = Date.now();
      
      const promises = Array.from({ length: 5 }, () => 
        acceptanceCriteriaAgent.checkSpecificationFidelity(specification)
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results.length).toBe(5);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });
}); 