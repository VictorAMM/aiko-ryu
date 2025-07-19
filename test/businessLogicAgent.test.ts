import { BusinessLogicAgent } from '../src/agents/BusinessLogicAgent';
import { ValidationEventPayload, AgentStatus } from '../src/agents/AgentContract';

describe('BusinessLogicAgent - Business Rule Engine', () => {
  let businessLogic: BusinessLogicAgent;
  
  beforeEach(() => {
    businessLogic = new BusinessLogicAgent({});
  });
  
  describe('Initialization', () => {
    it('should have correct role and dependencies', () => {
      expect(businessLogic.role).toBe('Business Rule Engine');
      expect(businessLogic.dependencies).toEqual(['aiko', 'ryu', 'alex']);
    });
    
    it('should have correct id', () => {
      expect(businessLogic.id).toBe('business-logic');
    });
  });
  
  describe('Business Rule Management', () => {
    it('should add business rules', async () => {
      await businessLogic.initialize();
      
      const rule = {
        id: 'test-rule',
        name: 'Test Business Rule',
        description: 'A test business rule',
        condition: 'amount > 1000',
        action: 'require_approval',
        priority: 1,
        category: 'validation',
        enabled: true,
        metadata: { version: '1.0.0' }
      };
      
      const result = await businessLogic.addBusinessRule(rule);
      expect(result).toBe(true);
    });
    
    it('should execute business rules', async () => {
      await businessLogic.initialize();
      
      const rule = {
        id: 'test-rule',
        name: 'Test Business Rule',
        description: 'A test business rule',
        condition: 'amount > 1000',
        action: 'require_approval',
        priority: 1,
        category: 'validation',
        enabled: true,
        metadata: { version: '1.0.0' }
      };
      
      await businessLogic.addBusinessRule(rule);
      
      const context = {
        id: 'test-context',
        timestamp: new Date(),
        data: { amount: 1500, customer: 'test-customer' },
        user: 'test-user',
        session: 'test-session',
        environment: 'test',
        metadata: {}
      };
      
      const result = await businessLogic.executeBusinessRule(rule, context);
      expect(result.success).toBe(true);
      expect(result.ruleId).toBe('test-rule');
    });
    
    it('should validate business rules', async () => {
      await businessLogic.initialize();
      
      const rule = {
        id: 'test-rule',
        name: 'Test Business Rule',
        description: 'A test business rule',
        condition: 'amount > 1000',
        action: 'require_approval',
        priority: 1,
        category: 'validation',
        enabled: true,
        metadata: { version: '1.0.0' }
      };
      
      const result = businessLogic.validateBusinessRule(rule);
      expect(result.result).toBe(true);
    });
  });
  
  describe('Decision Making', () => {
    it('should evaluate decisions', async () => {
      await businessLogic.initialize();
      
      const decision = {
        id: 'test-decision',
        name: 'Test Decision',
        type: 'approval' as const,
        criteria: [
          {
            id: 'criteria-1',
            name: 'Amount Check',
            condition: 'amount > 1000',
            weight: 0.8,
            required: true
          }
        ],
        options: [
          {
            id: 'approve',
            name: 'Approve',
            value: 'approved',
            score: 0.9,
            metadata: {}
          },
          {
            id: 'reject',
            name: 'Reject',
            value: 'rejected',
            score: 0.1,
            metadata: {}
          }
        ],
        defaultOption: 'reject',
        metadata: {}
      };
      
      const context = {
        id: 'test-context',
        timestamp: new Date(),
        data: { amount: 1500, customer: 'test-customer' },
        user: 'test-user',
        session: 'test-session',
        environment: 'test',
        metadata: {}
      };
      

      
      const result = await businessLogic.evaluateDecision(decision, context);
      expect(result.success).toBe(true);
      expect(result.decisionId).toBe('test-decision');
      expect(result.selectedOption).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });
    
    it('should create decisions', async () => {
      await businessLogic.initialize();
      
      const decision = {
        id: 'test-decision',
        name: 'Test Decision',
        type: 'approval' as const,
        criteria: [
          {
            id: 'criteria-1',
            name: 'Amount Check',
            condition: 'amount > 1000',
            weight: 0.8,
            required: true
          }
        ],
        options: [
          {
            id: 'approve',
            name: 'Approve',
            value: 'approved',
            score: 0.9,
            metadata: {}
          }
        ],
        defaultOption: 'approve',
        metadata: {}
      };
      
      const decisionId = await businessLogic.createDecision(decision);
      expect(decisionId).toBeDefined();
    });
  });
  
  describe('Workflow Processing', () => {
    it('should process business workflows', async () => {
      await businessLogic.initialize();
      
      const workflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        description: 'A test workflow',
        steps: [
          {
            id: 'step-1',
            name: 'Validation Step',
            type: 'validation' as const,
            parameters: { field: 'amount', operator: 'greater_than', value: 1000 },
            dependencies: [],
            timeout: 30000,
            metadata: {}
          }
        ],
        rules: ['test-rule'],
        decisions: ['test-decision'],
        timeout: 300000,
        metadata: {}
      };
      
      const result = await businessLogic.processWorkflow(workflow);
      expect(result.success).toBeDefined();
      expect(result.workflowId).toBe('test-workflow');
      expect(result.status).toBeDefined();
    });
  });
  
  describe('Rule Engine', () => {
    it('should execute rule engine', async () => {
      await businessLogic.initialize();
      
      const rules = [
        {
          id: 'rule-1',
          name: 'Test Rule 1',
          description: 'First test rule',
          condition: 'amount > 1000',
          action: 'flag_high_amount',
          priority: 1,
          category: 'validation',
          enabled: true,
          metadata: {}
        },
        {
          id: 'rule-2',
          name: 'Test Rule 2',
          description: 'Second test rule',
          condition: 'customer_type == "premium"',
          action: 'apply_discount',
          priority: 2,
          category: 'pricing',
          enabled: true,
          metadata: {}
        }
      ];
      
      const context = {
        id: 'test-context',
        timestamp: new Date(),
        data: { amount: 1500, customer_type: 'premium' },
        user: 'test-user',
        session: 'test-session',
        environment: 'test',
        metadata: {}
      };
      
      const result = await businessLogic.executeRuleEngine(rules, context);
      expect(result.success).toBe(true);
      expect(result.rulesExecuted).toBeDefined();
      expect(result.rulesTriggered).toBeDefined();
    });
    
    it('should validate rule consistency', async () => {
      await businessLogic.initialize();
      
      const rules = [
        {
          id: 'rule-1',
          name: 'Test Rule 1',
          description: 'First test rule',
          condition: 'amount > 1000',
          action: 'flag_high_amount',
          priority: 1,
          category: 'validation',
          enabled: true,
          metadata: {}
        },
        {
          id: 'rule-2',
          name: 'Test Rule 2',
          description: 'Second test rule',
          condition: 'amount < 1000',
          action: 'flag_low_amount',
          priority: 1,
          category: 'validation',
          enabled: true,
          metadata: {}
        }
      ];
      
      const result = await businessLogic.validateRuleConsistency(rules);
      expect(result.result).toBeDefined();
    });
  });
  
  describe('Business Metrics and Analytics', () => {
    it('should track business metrics', async () => {
      await businessLogic.initialize();
      
      const metrics = {
        timestamp: new Date(),
        metrics: [
          {
            id: 'metric-1',
            name: 'Approval Rate',
            value: 85.5,
            unit: 'percentage',
            category: 'performance',
            trend: 'up' as const
          }
        ],
        overallPerformance: 85.5,
        successRate: 0.855,
        throughput: 100
      };
      
      await expect(businessLogic.trackBusinessMetrics(metrics)).resolves.not.toThrow();
    });
    
    it('should generate business insights', async () => {
      await businessLogic.initialize();
      
      const insights = await businessLogic.generateBusinessInsights();
      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });
    
    it('should calculate business value', async () => {
      await businessLogic.initialize();
      
      const context = {
        id: 'test-context',
        timestamp: new Date(),
        data: { revenue: 100000, costs: 80000 },
        user: 'test-user',
        session: 'test-session',
        environment: 'test',
        metadata: {}
      };
      
      const result = await businessLogic.calculateBusinessValue(context);
      expect(result.monetaryValue).toBeDefined();
      expect(result.currency).toBeDefined();
      expect(result.roi).toBeDefined();
    });
  });
  
  describe('Event Handling', () => {
    it('should handle rule execution events', async () => {
      await businessLogic.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'rule-execution',
        input: {
          rule: {
            id: 'test-rule',
            name: 'Test Rule',
            description: 'Test description',
            condition: 'amount > 1000',
            action: 'require_approval',
            priority: 1,
            category: 'validation',
            enabled: true,
            metadata: {}
          },
          context: {
            id: 'test-context',
            timestamp: new Date(),
            data: { amount: 1500 },
            user: 'test-user',
            session: 'test-session',
            environment: 'test',
            metadata: {}
          }
        },
        result: { result: true, consensus: true },
        context: 'rule-execution'
      };
      
      await expect(businessLogic.handleEvent('rule.execute', payload)).resolves.not.toThrow();
    });
    
    it('should handle decision evaluation events', async () => {
      await businessLogic.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'decision-evaluation',
        input: {
          decision: {
            id: 'test-decision',
            name: 'Test Decision',
            type: 'approval',
            criteria: [],
            options: [],
            defaultOption: 'approve',
            metadata: {}
          },
          context: {
            id: 'test-context',
            timestamp: new Date(),
            data: { amount: 1500 },
            user: 'test-user',
            session: 'test-session',
            environment: 'test',
            metadata: {}
          }
        },
        result: { result: true, consensus: true },
        context: 'decision-evaluation'
      };
      
      await expect(businessLogic.handleEvent('decision.evaluate', payload)).resolves.not.toThrow();
    });
    
    it('should handle workflow processing events', async () => {
      await businessLogic.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'workflow-processing',
        input: {
          workflow: {
            id: 'test-workflow',
            name: 'Test Workflow',
            description: 'Test workflow',
            steps: [],
            rules: [],
            decisions: [],
            timeout: 300000,
            metadata: {}
          }
        },
        result: { result: true, consensus: true },
        context: 'workflow-processing'
      };
      
      await expect(businessLogic.handleEvent('workflow.process', payload)).resolves.not.toThrow();
    });
    
    it('should handle unknown events gracefully', async () => {
      await businessLogic.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'unknown-event',
        input: {},
        result: { result: true, consensus: true },
        context: 'unknown-event'
      };
      
      await expect(businessLogic.handleEvent('unknown.event', payload)).resolves.not.toThrow();
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should initialize correctly', async () => {
      await businessLogic.initialize();
      const status = businessLogic.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should shutdown gracefully', async () => {
      await businessLogic.initialize();
      await businessLogic.shutdown();
      const status = businessLogic.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should maintain uptime tracking', async () => {
      await businessLogic.initialize();
      const status = businessLogic.getStatus();
      expect(status.uptime).toBeGreaterThan(0);
    });
  });
  
  describe('Specification and Design', () => {
    it('should validate specifications', async () => {
      await businessLogic.initialize();
      
      const spec = {
        id: 'test-spec',
        role: 'test-role',
        dependencies: [],
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        designIntent: {
          purpose: 'test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [],
        name: 'Test Specification',
        description: 'Test description',
        version: '1.0.0',
        schema: 'test-schema'
      };
      
      const result = businessLogic.validateSpecification(spec);
      expect(result.result).toBe(true);
    });
    
    it('should generate design artifacts', async () => {
      await businessLogic.initialize();
      
      const artifacts = businessLogic.generateDesignArtifacts();
      expect(artifacts).toBeDefined();
      expect(artifacts.length).toBeGreaterThan(0);
      expect(artifacts[0].id).toBe('business-logic-engine');
    });
    
    it('should track user interactions', async () => {
      await businessLogic.initialize();
      
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'test-action',
        context: { test: 'data' },
        timestamp: new Date(),
        outcome: 'success' as const
      };
      
      expect(() => businessLogic.trackUserInteraction(interaction)).not.toThrow();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle invalid rule addition gracefully', async () => {
      await businessLogic.initialize();
      
      const invalidRule = {
        id: '',
        name: '',
        description: '',
        condition: '',
        action: '',
        priority: -1,
        category: '',
        enabled: true,
        metadata: {}
      };
      
      const result = await businessLogic.addBusinessRule(invalidRule);
      expect(result).toBe(false);
    });
    
    it('should handle rule execution errors gracefully', async () => {
      await businessLogic.initialize();
      
      const rule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test rule',
        condition: 'invalid_condition',
        action: 'invalid_action',
        priority: 1,
        category: 'validation',
        enabled: true,
        metadata: {}
      };
      
      const context = {
        id: 'test-context',
        timestamp: new Date(),
        data: {},
        user: 'test-user',
        session: 'test-session',
        environment: 'test',
        metadata: {}
      };
      
      const result = await businessLogic.executeBusinessRule(rule, context);
      expect(result.success).toBe(false);
    });
    
    it('should handle decision evaluation errors gracefully', async () => {
      await businessLogic.initialize();
      
      const decision = {
        id: 'test-decision',
        name: 'Test Decision',
        type: 'approval' as const,
        criteria: [],
        options: [],
        defaultOption: 'approve',
        metadata: {}
      };
      
      const context = {
        id: 'test-context',
        timestamp: new Date(),
        data: {},
        user: 'test-user',
        session: 'test-session',
        environment: 'test',
        metadata: {}
      };
      
      const result = await businessLogic.evaluateDecision(decision, context);
      expect(result.success).toBe(true);
      expect(result.selectedOption).toBeDefined();
    });
  });
}); 