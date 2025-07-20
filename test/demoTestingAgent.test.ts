// test/demoTestingAgent.test.ts
import { DemoTestingAgent } from '../src/agents/DemoTestingAgent';

describe('DemoTestingAgent', () => {
  let demoTestingAgent: DemoTestingAgent;

  beforeEach(() => {
    demoTestingAgent = new DemoTestingAgent('test-demo-testing-agent');
  });

  afterEach(async () => {
    await demoTestingAgent.shutdown();
  });

  describe('Agent Initialization', () => {
    it('should initialize demo testing agent', async () => {
      await demoTestingAgent.initialize();
      
      const status = demoTestingAgent.getStatus();
      expect(status.status).toBe('running');
      expect(status.uptime).toBeGreaterThan(0);
    });

    it('should handle initialization events', async () => {
      const traceEvents: any[] = [];
      demoTestingAgent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await demoTestingAgent.initialize();
      
      expect(traceEvents.length).toBeGreaterThan(0);
      expect(traceEvents.some(e => e.eventType === 'agent.initialized')).toBe(true);
    });
  });

  describe('Demo Test Management', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should create demo test', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'User Interface Demo',
        description: 'Demonstrate user interface functionality',
        type: 'interactive',
        priority: 'high',
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
            status: 'pending',
            steps: [
              {
                id: 'step-001',
                name: 'Enter credentials',
                description: 'Enter username and password for login',
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
      expect(test.participants.length).toBe(1);
    });

    it('should update demo test', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'API Demo',
        description: 'Demonstrate API functionality',
        type: 'automated',
        priority: 'medium',
        participants: [],
        scenarios: [],
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

      const updatedTest = await demoTestingAgent.updateDemoTest(test.id, {
        status: 'running',
        priority: 'critical'
      });

      expect(updatedTest.status).toBe('running');
      expect(updatedTest.priority).toBe('critical');
    });

    it('should execute demo test', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Performance Demo',
        description: 'Demonstrate system performance',
        type: 'performance',
        priority: 'high',
        participants: [],
        scenarios: [
          {
            id: 'scenario-002',
            name: 'Load Test',
            description: 'Test system under load',
            type: 'performance',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-002',
                name: 'Send requests',
                description: 'Send multiple concurrent requests',
                action: 'Send multiple concurrent requests',
                expectedResult: 'System handles load',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['System maintains performance'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-003',
          name: 'Performance Test Environment',
          type: 'staging',
          url: 'https://perf.test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const executedTest = await demoTestingAgent.executeDemoTest(test.id);
      
      expect(executedTest.status).toBe('completed');
      expect(executedTest.metrics.totalScenarios).toBe(1);
      expect(executedTest.metrics.completedScenarios).toBe(1);
      expect(executedTest.metrics.successRate).toBeGreaterThan(0);
    });

    it('should cancel demo test', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Cancelled Demo',
        description: 'Demo that will be cancelled',
        type: 'interactive',
        priority: 'low',
        participants: [],
        scenarios: [],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-004',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      await demoTestingAgent.cancelDemoTest(test.id);
      
      // Should not throw any errors
      expect(true).toBe(true);
    });
  });

  describe('Scenario Management', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should add demo scenario', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Scenario Test Demo',
        description: 'Test scenario management',
        type: 'interactive',
        priority: 'medium',
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
      });

      const scenario = await demoTestingAgent.addDemoScenario(test.id, {
        name: 'New Scenario',
        description: 'A new test scenario',
        type: 'happy-path',
        priority: 'medium',
        steps: [
          {
            id: 'step-003',
            name: 'Test step',
            description: 'Perform test action',
            action: 'Perform test action',
            expectedResult: 'Expected outcome',
            status: 'pending'
          }
        ],
        expectedOutcomes: ['Scenario completes successfully'],
        acceptanceCriteria: [],
        metadata: {}
      });

      expect(scenario.id).toBeDefined();
      expect(scenario.name).toBe('New Scenario');
      expect(scenario.status).toBe('pending');
    });

    it('should execute demo scenario', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Scenario Execution Demo',
        description: 'Test scenario execution',
        type: 'automated',
        priority: 'high',
        participants: [],
        scenarios: [
          {
            id: 'scenario-003',
            name: 'Test Scenario',
            description: 'A test scenario',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-004',
                name: 'Execute step',
                description: 'Execute test action',
                action: 'Execute test action',
                expectedResult: 'Step completes',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Scenario succeeds'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-006',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const scenario = test.scenarios[0];
      const executedScenario = await demoTestingAgent.executeDemoScenario(test.id, scenario.id);
      
      expect(executedScenario.status).toBe('completed');
      expect(executedScenario.duration).toBeGreaterThan(0);
    });
  });

  describe('Feedback Collection', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should collect demo feedback', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Feedback Demo',
        description: 'Test feedback collection',
        type: 'user-acceptance',
        priority: 'medium',
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
          id: 'env-007',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const feedback = await demoTestingAgent.collectDemoFeedback(test.id, {
        participantId: 'participant-002',
        participantName: 'Jane Smith',
        rating: 4,
        category: 'usability',
        comments: 'Interface is intuitive and easy to use'
      });

      expect(feedback.id).toBeDefined();
      expect(feedback.rating).toBe(4);
      expect(feedback.category).toBe('usability');
      expect(feedback.comments).toBe('Interface is intuitive and easy to use');
    });

    it('should analyze demo feedback', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Feedback Analysis Demo',
        description: 'Test feedback analysis',
        type: 'stakeholder',
        priority: 'high',
        participants: [
          {
            id: 'participant-003',
            name: 'Stakeholder',
            role: 'stakeholder',
            availability: 'available',
            expertise: 'expert'
          }
        ],
        scenarios: [],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-008',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      // Add some feedback first
      await demoTestingAgent.collectDemoFeedback(test.id, {
        participantId: 'participant-003',
        participantName: 'Stakeholder',
        rating: 5,
        category: 'functionality',
        comments: 'Excellent functionality'
      });

      await demoTestingAgent.collectDemoFeedback(test.id, {
        participantId: 'participant-003',
        participantName: 'Stakeholder',
        rating: 4,
        category: 'usability',
        comments: 'Good user experience'
      });

      const analysis = await demoTestingAgent.analyzeDemoFeedback(test.id);
      
      expect(analysis.testId).toBe(test.id);
      expect(analysis.overallSatisfaction).toBeGreaterThan(0);
      expect(analysis.overallSatisfaction).toBeLessThanOrEqual(5);
      expect(Object.keys(analysis.categoryScores).length).toBeGreaterThan(0);
      expect(Array.isArray(analysis.improvementSuggestions)).toBe(true);
      expect(analysis.participantEngagement).toBeGreaterThan(0);
    });
  });

  describe('Integration with Acceptance Criteria', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should validate against acceptance criteria', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Acceptance Criteria Demo',
        description: 'Test acceptance criteria validation',
        type: 'user-acceptance',
        priority: 'high',
        participants: [],
        scenarios: [
          {
            id: 'scenario-004',
            name: 'Acceptance Test',
            description: 'Test acceptance criteria',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-005',
                name: 'Test acceptance',
                description: 'Test acceptance criteria',
                action: 'Test acceptance criteria',
                expectedResult: 'Criteria met',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Acceptance criteria satisfied'],
            acceptanceCriteria: ['ac-001', 'ac-002'],
            metadata: {}
          }
        ],
        acceptanceCriteria: ['ac-001', 'ac-002'],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-009',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const result = await demoTestingAgent.validateAgainstAcceptanceCriteria(test.id);
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
    });

    it('should generate acceptance criteria report', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Acceptance Report Demo',
        description: 'Test acceptance criteria reporting',
        type: 'user-acceptance',
        priority: 'medium',
        participants: [],
        scenarios: [
          {
            id: 'scenario-005',
            name: 'Report Test',
            description: 'Test reporting',
            type: 'happy-path',
            priority: 'medium',
            status: 'pending',
            steps: [
              {
                id: 'step-006',
                name: 'Generate report',
                description: 'Generate acceptance report',
                action: 'Generate acceptance report',
                expectedResult: 'Report generated',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Report created successfully'],
            acceptanceCriteria: ['ac-003'],
            metadata: {}
          }
        ],
        acceptanceCriteria: ['ac-003'],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-010',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const report = await demoTestingAgent.generateAcceptanceCriteriaReport(test.id);
      
      expect(report).toContain('Acceptance Criteria Demo Test Report');
      expect(report).toContain(test.id);
      expect(report).toContain('Acceptance Criteria Coverage');
    });
  });

  describe('Integration with Specification Fidelity', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should validate specification fidelity', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Fidelity Demo',
        description: 'Test specification fidelity validation',
        type: 'automated',
        priority: 'high',
        participants: [],
        scenarios: [],
        acceptanceCriteria: [],
        specifications: ['spec-001', 'spec-002'],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-011',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const result = await demoTestingAgent.validateSpecificationFidelity(test.id);
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
    });

    it('should generate fidelity report', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Fidelity Report Demo',
        description: 'Test fidelity reporting',
        type: 'automated',
        priority: 'medium',
        participants: [],
        scenarios: [
          {
            id: 'scenario-006',
            name: 'Fidelity Test',
            description: 'Test fidelity',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-007',
                name: 'Test fidelity',
                description: 'Test specification fidelity',
                action: 'Test specification fidelity',
                expectedResult: 'Fidelity validated',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Fidelity requirements met'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: ['spec-003'],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-012',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const report = await demoTestingAgent.generateFidelityReport(test.id);
      
      expect(report).toContain('Specification Fidelity Demo Test Report');
      expect(report).toContain(test.id);
      expect(report).toContain('Fidelity Score');
    });
  });

  describe('Comprehensive Reporting', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should generate comprehensive demo report', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Comprehensive Demo',
        description: 'Comprehensive system demonstration',
        type: 'stakeholder',
        priority: 'critical',
        participants: [
          {
            id: 'participant-004',
            name: 'Stakeholder',
            role: 'stakeholder',
            availability: 'available',
            expertise: 'expert'
          }
        ],
        scenarios: [
          {
            id: 'scenario-007',
            name: 'Full System Demo',
            description: 'Demonstrate full system functionality',
            type: 'happy-path',
            priority: 'critical',
            status: 'pending',
            steps: [
              {
                id: 'step-008',
                name: 'System startup',
                description: 'Start the system',
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
        acceptanceCriteria: ['ac-004'],
        specifications: ['spec-004'],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-013',
          name: 'Production Demo Environment',
          type: 'demo',
          url: 'https://demo.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const report = await demoTestingAgent.generateComprehensiveDemoReport(test.id);
      
      expect(report).toContain('Comprehensive Demo Test Report');
      expect(report).toContain(test.id);
      expect(report).toContain(test.name);
      expect(report).toContain('Metrics Summary');
      expect(report).toContain('Participants');
      expect(report).toContain('Scenarios');
    });

    it('should generate demo test result', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Test Result Demo',
        description: 'Test result generation',
        type: 'automated',
        priority: 'high',
        participants: [],
        scenarios: [
          {
            id: 'scenario-008',
            name: 'Result Test',
            description: 'Test result generation',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-009',
                name: 'Generate result',
                description: 'Generate test result',
                action: 'Generate test result',
                expectedResult: 'Result generated',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Test result created'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-014',
          name: 'Test Environment',
          type: 'staging',
          url: 'https://test.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const result = await demoTestingAgent.generateDemoTestResult(test.id);
      
      expect(result.testId).toBe(test.id);
      expect(['passed', 'failed', 'partial']).toContain(result.status);
      expect(result.summary).toBeDefined();
      expect(Array.isArray(result.details)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.nextSteps)).toBe(true);
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should handle demo test creation events', async () => {
      const traceEvents: any[] = [];
      demoTestingAgent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await demoTestingAgent.handleEvent('demo_test.create', {
        test: {
          name: 'Event Test Demo',
          description: 'Test event handling',
          type: 'interactive',
          priority: 'medium',
          participants: [],
          scenarios: [],
          acceptanceCriteria: [],
          specifications: [],
          feedback: [],
          scheduledAt: new Date(),
          environment: {
            id: 'env-015',
            name: 'Test Environment',
            type: 'staging',
            url: 'https://test.example.com',
            configuration: {},
            status: 'available'
          }
        }
      });

      expect(traceEvents.length).toBeGreaterThan(0);
    });

    it('should handle demo test execution events', async () => {
      await demoTestingAgent.handleEvent('demo_test.execute', {
        testId: 'test-001'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle demo test cancellation events', async () => {
      await demoTestingAgent.handleEvent('demo_test.cancel', {
        testId: 'test-002'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle demo feedback collection events', async () => {
      await demoTestingAgent.handleEvent('demo_feedback.collect', {
        testId: 'test-003',
        feedback: {
          participantId: 'participant-005',
          participantName: 'Test User',
          rating: 4,
          category: 'usability',
          comments: 'Good user experience'
        }
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle acceptance criteria validation events', async () => {
      await demoTestingAgent.handleEvent('demo_test.validate_acceptance_criteria', {
        testId: 'test-004'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle fidelity validation events', async () => {
      await demoTestingAgent.handleEvent('demo_test.validate_fidelity', {
        testId: 'test-005'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle unknown events gracefully', async () => {
      await demoTestingAgent.handleEvent('unknown_event', {
        data: 'test data'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should handle non-existent demo test updates', async () => {
      try {
        await demoTestingAgent.updateDemoTest('non-existent-id', {
          status: 'completed'
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent demo test execution', async () => {
      try {
        await demoTestingAgent.executeDemoTest('non-existent-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent demo test cancellation', async () => {
      try {
        await demoTestingAgent.cancelDemoTest('non-existent-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent scenario execution', async () => {
      try {
        await demoTestingAgent.executeDemoScenario('non-existent-test', 'non-existent-scenario');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent feedback collection', async () => {
      try {
        await demoTestingAgent.collectDemoFeedback('non-existent-id', {
          participantId: 'participant-006',
          participantName: 'Test User',
          rating: 3,
          category: 'functionality',
          comments: 'Test comment'
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Performance and Scalability', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should handle multiple demo test creations efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 10 }, (_, i) => 
        demoTestingAgent.createDemoTest({
          name: `Test Demo ${i}`,
          description: `Test demo ${i}`,
          type: 'interactive',
          priority: 'medium',
          participants: [],
          scenarios: [],
          acceptanceCriteria: [],
          specifications: [],
          feedback: [],
          scheduledAt: new Date(),
          environment: {
            id: `env-${i}`,
            name: `Test Environment ${i}`,
            type: 'staging',
            url: `https://test${i}.example.com`,
            configuration: {},
            status: 'available'
          }
        })
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results.length).toBe(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple demo test executions efficiently', async () => {
      // First create multiple tests
      const tests = await Promise.all(Array.from({ length: 5 }, (_, i) => 
        demoTestingAgent.createDemoTest({
          name: `Execution Test ${i}`,
          description: `Test execution ${i}`,
          type: 'automated',
          priority: 'medium',
          participants: [],
          scenarios: [
            {
              id: `scenario-${i}`,
              name: `Test Scenario ${i}`,
              description: `Test scenario ${i}`,
              type: 'happy-path',
              priority: 'medium',
              status: 'pending',
              steps: [
                {
                  id: `step-${i}`,
                  name: `Test Step ${i}`,
                  description: `Test action ${i}`,
                  action: `Test action ${i}`,
                  expectedResult: `Expected result ${i}`,
                  status: 'pending'
                }
              ],
              expectedOutcomes: [`Scenario ${i} succeeds`],
              acceptanceCriteria: [],
              metadata: {}
            }
          ],
          acceptanceCriteria: [],
          specifications: [],
          feedback: [],
          scheduledAt: new Date(),
          environment: {
            id: `env-exec-${i}`,
            name: `Execution Environment ${i}`,
            type: 'staging',
            url: `https://exec${i}.example.com`,
            configuration: {},
            status: 'available'
          }
        })
      ));

      const startTime = Date.now();
      
      const executionPromises = tests.map(test => 
        demoTestingAgent.executeDemoTest(test.id)
      );

      const results = await Promise.all(executionPromises);
      const endTime = Date.now();

      expect(results.length).toBe(5);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
      
      // All tests should be completed
      results.forEach(result => {
        expect(['completed', 'failed']).toContain(result.status);
      });
    });
  });

  describe('Demo Test Types', () => {
    beforeEach(async () => {
      await demoTestingAgent.initialize();
    });

    it('should handle interactive demo tests', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Interactive Demo',
        description: 'Interactive user demonstration',
        type: 'interactive',
        priority: 'high',
        participants: [
          {
            id: 'participant-007',
            name: 'Interactive User',
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
          id: 'env-interactive',
          name: 'Interactive Environment',
          type: 'staging',
          url: 'https://interactive.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(test.type).toBe('interactive');
      expect(test.participants.length).toBe(1);
    });

    it('should handle automated demo tests', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Automated Demo',
        description: 'Automated system demonstration',
        type: 'automated',
        priority: 'medium',
        participants: [],
        scenarios: [
          {
            id: 'scenario-auto',
            name: 'Automated Scenario',
            description: 'Automated test scenario',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-auto',
                name: 'Automated step',
                description: 'Automated action',
                action: 'Automated action',
                expectedResult: 'Automated result',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Automated success'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-automated',
          name: 'Automated Environment',
          type: 'staging',
          url: 'https://automated.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(test.type).toBe('automated');
      expect(test.scenarios.length).toBe(1);
    });

    it('should handle user acceptance demo tests', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'UAT Demo',
        description: 'User acceptance testing demonstration',
        type: 'user-acceptance',
        priority: 'high',
        participants: [
          {
            id: 'participant-008',
            name: 'UAT User',
            role: 'end-user',
            availability: 'available',
            expertise: 'intermediate'
          }
        ],
        scenarios: [],
        acceptanceCriteria: ['uat-001', 'uat-002'],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-uat',
          name: 'UAT Environment',
          type: 'staging',
          url: 'https://uat.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(test.type).toBe('user-acceptance');
      expect(test.acceptanceCriteria.length).toBe(2);
    });

    it('should handle stakeholder demo tests', async () => {
      const test = await demoTestingAgent.createDemoTest({
        name: 'Stakeholder Demo',
        description: 'Stakeholder demonstration',
        type: 'stakeholder',
        priority: 'critical',
        participants: [
          {
            id: 'participant-009',
            name: 'Stakeholder',
            role: 'stakeholder',
            availability: 'available',
            expertise: 'expert'
          }
        ],
        scenarios: [],
        acceptanceCriteria: [],
        specifications: ['spec-stakeholder'],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-stakeholder',
          name: 'Stakeholder Environment',
          type: 'demo',
          url: 'https://stakeholder.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(test.type).toBe('stakeholder');
      expect(test.specifications.length).toBe(1);
    });
  });
}); 