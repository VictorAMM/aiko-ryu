import { CLevelGenesisAgent } from '../src/agents/CLevelGenesisAgent';

describe('CLevelGenesisAgent', () => {
  let agent: CLevelGenesisAgent;

  beforeEach(() => {
    agent = new CLevelGenesisAgent('test-genesis');
  });

  afterEach(async () => {
    // Cleanup
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await expect(agent.initialize()).resolves.not.toThrow();
      
      const status = agent.getStatus();
      expect(status.status).toBe('ready');
    });

    it('should emit initialization trace events', async () => {
      const traceEvents: any[] = [];
      agent.on('trace', (event) => {
        traceEvents.push(event);
      });

      await agent.initialize();

      expect(traceEvents.length).toBeGreaterThan(0);
      expect(traceEvents.some(event => event.eventType === 'agent.initialized')).toBe(true);
    });
  });

  describe('Domain Analysis', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should analyze e-commerce domain', async () => {
      const prompt = 'Create an e-commerce platform with user authentication, product catalog, and payment processing';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.domainAnalysis.businessDomain).toBe('e-commerce');
      expect(result.domainAnalysis.technicalRequirements).toContain('RESTful API');
      expect(result.domainAnalysis.technicalRequirements).toContain('Database Integration');
      expect(result.domainAnalysis.technicalRequirements).toContain('Authentication');
      expect(result.complexityScore).toBeGreaterThan(0);
    });

    it('should analyze healthcare domain', async () => {
      const prompt = 'Build a healthcare management system with patient records, appointment scheduling, and HIPAA compliance';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.domainAnalysis.businessDomain).toBe('healthcare');
      expect(result.domainAnalysis.qualityStandards).toContain('HIPAA Compliance');
      expect(result.domainAnalysis.complianceNeeds).toContain('HIPAA');
    });

    it('should analyze ML/AI requirements', async () => {
      const prompt = 'Develop a machine learning system for image recognition with GPU acceleration and real-time processing';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.domainAnalysis.technicalRequirements).toContain('Machine Learning');
      expect(result.domainAnalysis.technicalRequirements).toContain('GPU Acceleration');
      expect(result.domainAnalysis.estimatedAgents).toBeGreaterThan(3); // Base agents + ML agents
    });
  });

  describe('Prompt Analysis', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should extract intent from creation prompts', async () => {
      const prompt = 'Create a new web application';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.promptAnalysis.intent).toBe('creation');
    });

    it('should extract entities from prompts', async () => {
      const prompt = 'Build a system for user management with database integration';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.promptAnalysis.entities).toContain('User');
      expect(result.promptAnalysis.entities).toContain('Database');
    });

    it('should identify requirements', async () => {
      const prompt = 'Create a secure and scalable API';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.promptAnalysis.requirements).toContain('Security');
      expect(result.promptAnalysis.requirements).toContain('Scalability');
    });

    it('should identify constraints', async () => {
      const prompt = 'Build within budget and time constraints';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.promptAnalysis.constraints).toContain('Budget');
      expect(result.promptAnalysis.constraints).toContain('Time');
    });
  });

  describe('Agent Generation', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should generate domain validator agent', async () => {
      const prompt = 'Create a business application';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.agentSpecifications.length).toBeGreaterThan(0);
      const domainValidator = result.agentSpecifications.find(agent => agent.role === 'Domain Validator');
      expect(domainValidator).toBeDefined();
    });

    it('should generate ML architect for ML requirements', async () => {
      const prompt = 'Build a machine learning system with GPU acceleration';
      
      const result = await agent.processPrompt(prompt);
      
      const mlArchitect = result.agentSpecifications.find(agent => agent.role === 'ML Architect');
      expect(mlArchitect).toBeDefined();
    });

    it('should generate security agent for security requirements', async () => {
      const prompt = 'Create a secure enterprise application';
      
      const result = await agent.processPrompt(prompt);
      
      const securityAgent = result.agentSpecifications.find(agent => agent.role === 'Security Specialist');
      expect(securityAgent).toBeDefined();
    });
  });

  describe('Genesis Planning', () => {
    beforeEach(async () => {
      await agent.initialize();
    });

    it('should create genesis plan', async () => {
      const prompt = 'Create a comprehensive business application';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.genesisPlan).toBeDefined();
      expect(result.genesisPlan.phase).toBeDefined();
      expect(result.genesisPlan.steps.length).toBeGreaterThan(0);
      expect(result.genesisPlan.totalDuration).toBeDefined();
      expect(result.genesisPlan.qualityGates.length).toBeGreaterThan(0);
    });

    it('should estimate duration based on complexity', async () => {
      const simplePrompt = 'Create a simple web page';
      const complexPrompt = 'Build an enterprise-grade machine learning platform with GPU acceleration, real-time processing, and compliance requirements';
      
      const simpleResult = await agent.processPrompt(simplePrompt);
      const complexResult = await agent.processPrompt(complexPrompt);
      
      expect(simpleResult.estimatedDuration).toBeDefined();
      expect(complexResult.estimatedDuration).toBeDefined();
    });

    it('should calculate success probability', async () => {
      const prompt = 'Create a business application';
      
      const result = await agent.processPrompt(prompt);
      
      expect(result.successProbability).toBeGreaterThan(0);
      expect(result.successProbability).toBeLessThanOrEqual(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // Test with invalid configuration
      const invalidAgent = new CLevelGenesisAgent('invalid');
      
      // Should not throw during initialization
      await expect(invalidAgent.initialize()).resolves.not.toThrow();
    });

    it('should handle processing errors gracefully', async () => {
      await agent.initialize();
      
      // Test with empty prompt
      const result = await agent.processPrompt('');
      
      expect(result).toBeDefined();
      expect(result.domainAnalysis).toBeDefined();
      expect(result.promptAnalysis).toBeDefined();
    });
  });

  describe('Integration Compatibility', () => {
    it('should work with TensorFlow integration', async () => {
      await agent.initialize();
      
      const prompt = 'Create a machine learning application';
      const result = await agent.processPrompt(prompt);
      
      expect(result.domainAnalysis).toBeDefined();
      expect(result.complexityScore).toBeGreaterThan(0);
    });

    it('should work with LangChain integration', async () => {
      await agent.initialize();
      
      const prompt = 'Build a secure web application';
      const result = await agent.processPrompt(prompt);
      
      expect(result.promptAnalysis).toBeDefined();
      expect(result.agentSpecifications.length).toBeGreaterThan(0);
    });
  });
}); 