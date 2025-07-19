// complianceAgent.test.ts - Comprehensive tests for ComplianceAgent

import { ComplianceAgent } from '../src/agents/ComplianceAgent';

describe('ComplianceAgent', () => {
  let complianceAgent: ComplianceAgent;

  beforeEach(() => {
    complianceAgent = new ComplianceAgent('test-compliance-agent');
  });

  afterEach(async () => {
    await complianceAgent.shutdown();
  });

  describe('Agent Initialization', () => {
    it('should initialize compliance agent', async () => {
      await complianceAgent.initialize();
      
      const status = complianceAgent.getStatus();
      expect(status.status).toBe('running');
      expect(status.uptime).toBeGreaterThan(0);
    });

    it('should validate specifications correctly', () => {
      const spec = {
        id: 'test-agent',
        role: 'Test Agent',
        dependencies: [],
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        designIntent: {
          purpose: 'Test compliance validation',
          userGoals: ['Ensure compliance'],
          successMetrics: [],
          designPrinciples: ['Compliance first'],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'req-001',
            description: 'Must validate compliance',
            priority: 'high' as const,
            userStory: 'As a compliance officer, I want to validate specifications',
            acceptanceCriteria: ['Specification is validated'],
            persona: 'Compliance Officer'
          }
        ]
      };

      const result = complianceAgent.validateSpecification(spec);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });
  });

  describe('Event Handling', () => {
    it('should handle compliance events', async () => {
      await complianceAgent.initialize();
      
      const payload = {
        timestamp: new Date(),
        correlationId: 'test-compliance',
        sourceAgent: 'test-agent',
        operation: 'check',
        data: {
          required: true,
          value: 'test-value'
        }
      };

      await complianceAgent.handleEvent('compliance.check', payload);
      
      const status = complianceAgent.getStatus();
      expect(status.lastEvent).toBe('compliance.check');
    });
  });
}); 