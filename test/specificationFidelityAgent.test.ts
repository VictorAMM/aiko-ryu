// test/specificationFidelityAgent.test.ts
import { SpecificationFidelityAgent } from '../src/agents/SpecificationFidelityAgent';
import { AgentSpecification } from '../src/agents/AgentContract';

describe('SpecificationFidelityAgent', () => {
  let specificationFidelityAgent: SpecificationFidelityAgent;

  beforeEach(() => {
    specificationFidelityAgent = new SpecificationFidelityAgent('test-specification-fidelity-agent');
  });

  afterEach(async () => {
    await specificationFidelityAgent.shutdown();
  });

  describe('Agent Initialization', () => {
    it('should initialize specification fidelity agent', async () => {
      await specificationFidelityAgent.initialize();
      
      const status = specificationFidelityAgent.getStatus();
      expect(status.status).toBe('running');
      expect(status.uptime).toBeGreaterThan(0);
    });

    it('should handle initialization events', async () => {
      const traceEvents: any[] = [];
      specificationFidelityAgent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await specificationFidelityAgent.initialize();
      
      expect(traceEvents.length).toBeGreaterThan(0);
      expect(traceEvents.some(e => e.eventType === 'agent.initialized')).toBe(true);
    });
  });

  describe('Specification Fidelity Validation', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should validate specification fidelity', async () => {
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

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      
      expect(checks.length).toBeGreaterThan(0);
      expect(checks.some(check => check.checkType === 'syntax')).toBe(true);
      expect(checks.some(check => check.checkType === 'semantics')).toBe(true);
      expect(checks.some(check => check.checkType === 'completeness')).toBe(true);
      expect(checks.some(check => check.checkType === 'consistency')).toBe(true);
      expect(checks.some(check => check.checkType === 'traceability')).toBe(true);
      expect(checks.some(check => check.checkType === 'code-quality')).toBe(true);
      expect(checks.some(check => check.checkType === 'performance')).toBe(true);
      expect(checks.some(check => check.checkType === 'security')).toBe(true);
    });

    it('should handle incomplete specifications', async () => {
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
        userRequirements: []
      };

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      
      expect(checks.length).toBeGreaterThan(0);
      
      // Should have some failed or warning checks
      const failedChecks = checks.filter(check => check.status === 'failed' || check.status === 'warning');
      expect(failedChecks.length).toBeGreaterThan(0);
    });

    it('should validate specification traceability', async () => {
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

      const result = await specificationFidelityAgent.validateSpecificationTraceability(specification);
      
      expect(result.result).toBe(true);
      expect(typeof result.consensus).toBe('boolean');
    });

    it('should generate fidelity report', async () => {
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

      // First check fidelity
      await specificationFidelityAgent.validateSpecificationFidelity(specification);
      
      // Then generate report
      const report = await specificationFidelityAgent.generateFidelityReport(specification.id);
      
      expect(report).toContain('Specification Fidelity Report');
      expect(report).toContain(specification.id);
      expect(report).toContain('Overall Fidelity Score');
    });
  });

  describe('Code Quality Validation', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should validate code quality', async () => {
      const metrics = await specificationFidelityAgent.validateCodeQuality('test-spec-001');
      
      expect(metrics.cyclomaticComplexity).toBeGreaterThan(0);
      expect(metrics.maintainabilityIndex).toBeGreaterThan(0);
      expect(metrics.technicalDebtRatio).toBeGreaterThanOrEqual(0);
      expect(metrics.codeDuplication).toBeGreaterThanOrEqual(0);
      expect(metrics.testCoverage).toBeGreaterThan(0);
      expect(metrics.documentationCoverage).toBeGreaterThan(0);
      expect(metrics.securityScore).toBeGreaterThan(0);
      expect(metrics.performanceScore).toBeGreaterThan(0);
    });

    it('should handle multiple code quality validations', async () => {
      const promises = Array.from({ length: 5 }, (_, i) => 
        specificationFidelityAgent.validateCodeQuality(`test-spec-${i}`)
      );

      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      results.forEach(metrics => {
        expect(metrics.cyclomaticComplexity).toBeGreaterThan(0);
        expect(metrics.maintainabilityIndex).toBeGreaterThan(0);
      });
    });
  });

  describe('Specification Compliance', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should validate specification compliance', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-005',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-002',
            name: 'Test Capability',
            description: 'Test capability description',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [
          {
            id: 'iface-002',
            name: 'TestInterface',
            methods: [],
            events: [],
            properties: []
          }
        ],
        behaviors: [],
        constraints: [],
        validationRules: [
          {
            id: 'rule-001',
            name: 'Test Rule',
            rule: 'Test validation rule',
            validator: () => ({ result: true, consensus: true }),
            errorMessage: 'Test error'
          }
        ],
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
            id: 'req-003',
            description: 'Test requirement',
            priority: 'high',
            userStory: 'As a user, I want to test functionality',
            acceptanceCriteria: ['Test passes'],
            persona: 'Tester'
          }
        ]
      };

      const compliance = await specificationFidelityAgent.validateSpecificationCompliance(specification);
      
      expect(compliance.specificationId).toBe(specification.id);
      expect(compliance.complianceScore).toBeGreaterThanOrEqual(0);
      expect(compliance.complianceScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(compliance.missingRequirements)).toBe(true);
      expect(Array.isArray(compliance.incompleteImplementations)).toBe(true);
      expect(Array.isArray(compliance.validationFailures)).toBe(true);
      expect(Array.isArray(compliance.recommendations)).toBe(true);
    });

    it('should handle non-compliant specifications', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-006',
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
        userRequirements: [] // Missing requirements
      };

      const compliance = await specificationFidelityAgent.validateSpecificationCompliance(specification);
      
      expect(compliance.complianceScore).toBeLessThan(100);
      expect(compliance.missingRequirements.length).toBeGreaterThan(0);
    });
  });

  describe('Continuous Monitoring', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should start fidelity monitoring', async () => {
      await specificationFidelityAgent.startFidelityMonitoring('test-spec-001');
      
      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should stop fidelity monitoring', async () => {
      await specificationFidelityAgent.startFidelityMonitoring('test-spec-002');
      await specificationFidelityAgent.stopFidelityMonitoring('test-spec-002');
      
      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should get fidelity metrics', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-007',
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
      await specificationFidelityAgent.validateSpecificationFidelity(specification);
      
      // Then get metrics
      const metrics = await specificationFidelityAgent.getFidelityMetrics(specification.id);
      
      expect(metrics.specificationId).toBe(specification.id);
      expect(metrics.overallScore).toBeGreaterThanOrEqual(0);
      expect(metrics.overallScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(metrics.checks)).toBe(true);
      expect(metrics.codeQuality).toBeDefined();
      expect(metrics.compliance).toBeDefined();
      expect(Array.isArray(metrics.recommendations)).toBe(true);
    });
  });

  describe('Integration with Acceptance Criteria', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should validate against acceptance criteria', async () => {
      const result = await specificationFidelityAgent.validateAgainstAcceptanceCriteria('test-spec-001', ['ac-001', 'ac-002']);
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
    });

    it('should generate comprehensive report', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-008',
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
      await specificationFidelityAgent.validateSpecificationFidelity(specification);
      
      // Then generate comprehensive report
      const report = await specificationFidelityAgent.generateComprehensiveReport(specification.id);
      
      expect(report).toContain('Comprehensive Specification Fidelity Report');
      expect(report).toContain(specification.id);
      expect(report).toContain('Overall Score');
      expect(report).toContain('Fidelity Checks');
      expect(report).toContain('Code Quality Metrics');
      expect(report).toContain('Compliance Report');
      expect(report).toContain('Recommendations');
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should handle specification fidelity validation events', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-009',
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

      const traceEvents: any[] = [];
      specificationFidelityAgent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await specificationFidelityAgent.handleEvent('specification.fidelity.validate', {
        specification
      });

      expect(traceEvents.length).toBeGreaterThan(0);
    });

    it('should handle fidelity monitoring start events', async () => {
      await specificationFidelityAgent.handleEvent('specification.fidelity.monitor.start', {
        specificationId: 'test-spec-010'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle fidelity monitoring stop events', async () => {
      await specificationFidelityAgent.handleEvent('specification.fidelity.monitor.stop', {
        specificationId: 'test-spec-011'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle fidelity report generation events', async () => {
      await specificationFidelityAgent.handleEvent('specification.fidelity.report.generate', {
        specificationId: 'test-spec-012'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle specification compliance validation events', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-013',
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

      await specificationFidelityAgent.handleEvent('specification.compliance.validate', {
        specification
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });

    it('should handle unknown events gracefully', async () => {
      await specificationFidelityAgent.handleEvent('unknown_event', {
        data: 'test data'
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should handle non-existent specification fidelity checks', async () => {
      const checks = await specificationFidelityAgent.validateSpecificationFidelity({ id: 'non-existent' } as AgentSpecification);
      
      expect(checks.length).toBeGreaterThan(0);
      // Should have some failed checks for non-existent specification
      const failedChecks = checks.filter(check => check.status === 'failed');
      expect(failedChecks.length).toBeGreaterThan(0);
    });

    it('should handle non-existent fidelity report generation', async () => {
      const report = await specificationFidelityAgent.generateFidelityReport('non-existent-spec');
      
      expect(report).toContain('No fidelity checks found');
    });

    it('should handle non-existent code quality validation', async () => {
      const metrics = await specificationFidelityAgent.validateCodeQuality('non-existent-spec');
      
      expect(metrics.cyclomaticComplexity).toBeGreaterThan(0);
      expect(metrics.maintainabilityIndex).toBeGreaterThan(0);
    });
  });

  describe('Performance and Scalability', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should handle multiple fidelity validations efficiently', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-014',
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
      
      const promises = Array.from({ length: 10 }, () => 
        specificationFidelityAgent.validateSpecificationFidelity(specification)
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results.length).toBe(10);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });

    it('should handle multiple code quality validations efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 20 }, (_, i) => 
        specificationFidelityAgent.validateCodeQuality(`test-spec-${i}`)
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results.length).toBe(20);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple compliance validations efficiently', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-015',
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
        specificationFidelityAgent.validateSpecificationCompliance(specification)
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results.length).toBe(5);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });

  describe('Fidelity Check Types', () => {
    beforeEach(async () => {
      await specificationFidelityAgent.initialize();
    });

    it('should perform syntax checks correctly', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-016',
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

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      const syntaxCheck = checks.find(check => check.checkType === 'syntax');
      
      expect(syntaxCheck).toBeDefined();
      expect(syntaxCheck?.score).toBeGreaterThanOrEqual(0);
      expect(syntaxCheck?.score).toBeLessThanOrEqual(100);
    });

    it('should perform semantics checks correctly', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-017',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-003',
            name: 'Test Capability',
            description: 'Test capability description',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [
          {
            id: 'iface-003',
            name: 'TestInterface',
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
          userGoals: ['Test functionality'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      const semanticsCheck = checks.find(check => check.checkType === 'semantics');
      
      expect(semanticsCheck).toBeDefined();
      expect(semanticsCheck?.score).toBeGreaterThanOrEqual(0);
      expect(semanticsCheck?.score).toBeLessThanOrEqual(100);
    });

    it('should perform completeness checks correctly', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-018',
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
            id: 'req-004',
            description: 'Test requirement',
            priority: 'high',
            userStory: 'As a user, I want to test functionality',
            acceptanceCriteria: ['Test passes'],
            persona: 'Tester'
          }
        ]
      };

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      const completenessCheck = checks.find(check => check.checkType === 'completeness');
      
      expect(completenessCheck).toBeDefined();
      expect(completenessCheck?.score).toBeGreaterThanOrEqual(0);
      expect(completenessCheck?.score).toBeLessThanOrEqual(100);
    });

    it('should perform consistency checks correctly', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-019',
        role: 'TestAgent',
        capabilities: [
          {
            id: 'cap-004',
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
            id: 'iface-004',
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
          userGoals: ['Test functionality'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      const consistencyCheck = checks.find(check => check.checkType === 'consistency');
      
      expect(consistencyCheck).toBeDefined();
      expect(consistencyCheck?.score).toBeGreaterThanOrEqual(0);
      expect(consistencyCheck?.score).toBeLessThanOrEqual(100);
    });

    it('should perform traceability checks correctly', async () => {
      const specification: AgentSpecification = {
        id: 'test-spec-020',
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
            id: 'req-005',
            description: 'Test requirement',
            priority: 'high',
            userStory: 'As a user, I want to test functionality',
            acceptanceCriteria: ['Test passes'],
            persona: 'Tester'
          }
        ]
      };

      const checks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      const traceabilityCheck = checks.find(check => check.checkType === 'traceability');
      
      expect(traceabilityCheck).toBeDefined();
      expect(traceabilityCheck?.score).toBeGreaterThanOrEqual(0);
      expect(traceabilityCheck?.score).toBeLessThanOrEqual(100);
    });
  });
}); 