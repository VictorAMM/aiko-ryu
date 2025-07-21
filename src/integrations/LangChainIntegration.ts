/**
 * Real LangChain Integration
 * 
 * Provides intelligent prompt analysis and dynamic agent generation
 * using LangChain's advanced language model capabilities
 */

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { StringOutputParser } from '@langchain/core/output_parsers';

export interface LangChainConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  enableStreaming: boolean;
  apiKey?: string;
}

export interface PromptAnalysisResult {
  intent: string;
  entities: string[];
  requirements: string[];
  constraints: string[];
  successCriteria: string[];
  riskFactors: string[];
  confidence: number;
  processingTime: number;
}

export interface AgentSpecification {
  id: string;
  role: string;
  description: string;
  capabilities: string[];
  dependencies: string[];
  parameters: Record<string, any>;
  conditions: Record<string, any>;
  methods: string[];
  actions: string[];
}

export class LangChainIntegration {
  private config: LangChainConfig;
  private isInitialized: boolean = false;
  private model: ChatOpenAI | null = null;
  private promptAnalysisChain: LLMChain | null = null;
  private agentGenerationChain: LLMChain | null = null;
  private riskAssessmentChain: LLMChain | null = null;

  constructor(config: LangChainConfig = {
    modelName: 'gpt-3.5-turbo',
    temperature: 0.1,
    maxTokens: 2000,
    enableStreaming: false
  }) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('[LangChainIntegration] Initializing LangChain...');
    
    try {
      await this.initializeLangChain();
      await this.setupChains();
      
      this.isInitialized = true;
      console.log('[LangChainIntegration] LangChain initialized successfully');
    } catch (error) {
      console.error('[LangChainIntegration] Initialization failed:', error);
      throw error;
    }
  }

  private async initializeLangChain(): Promise<void> {
    console.log('[LangChainIntegration] Loading LangChain framework...');
    
    // Initialize the language model
    this.model = new ChatOpenAI({
      modelName: this.config.modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      streaming: this.config.enableStreaming,
      openAIApiKey: this.config.apiKey || process.env.OPENAI_API_KEY
    });
    
    console.log(`[LangChainIntegration] ${this.config.modelName} model loaded`);
  }

  private async setupChains(): Promise<void> {
    console.log('[LangChainIntegration] Setting up analysis chains...');
    
    // Create prompt analysis chain
    const promptAnalysisTemplate = PromptTemplate.fromTemplate(`
Analyze the following prompt and extract key information:

Prompt: {prompt}

Please provide a structured analysis with the following components:
1. Intent: What is the main goal or purpose?
2. Entities: What are the key objects, people, or systems mentioned?
3. Requirements: What are the functional and non-functional requirements?
4. Constraints: What are the limitations or restrictions?
5. Success Criteria: How will success be measured?
6. Risk Factors: What are potential risks or challenges?

Format your response as JSON with these keys: intent, entities, requirements, constraints, successCriteria, riskFactors
`);

    this.promptAnalysisChain = new LLMChain({
      llm: this.model!,
      prompt: promptAnalysisTemplate,
      outputParser: new StringOutputParser()
    });

    // Create agent generation chain
    const agentGenerationTemplate = PromptTemplate.fromTemplate(`
Based on the domain analysis and prompt analysis, generate agent specifications:

Domain Analysis: {domainAnalysis}
Prompt Analysis: {promptAnalysis}

Generate agent specifications that address the requirements. Each agent should have:
- id: unique identifier
- role: agent's purpose
- description: detailed description
- capabilities: list of capabilities
- dependencies: other agents this depends on
- parameters: configuration parameters
- conditions: activation conditions
- methods: available methods
- actions: possible actions

Format as JSON array of agent specifications.
`);

    this.agentGenerationChain = new LLMChain({
      llm: this.model!,
      prompt: agentGenerationTemplate,
      outputParser: new StringOutputParser()
    });

    // Create risk assessment chain
    const riskAssessmentTemplate = PromptTemplate.fromTemplate(`
Assess the risks associated with this prompt:

Prompt: {prompt}

Consider:
- Technical risks
- Security risks
- Business risks
- Compliance risks
- Performance risks

Provide a list of identified risk factors.
`);

    this.riskAssessmentChain = new LLMChain({
      llm: this.model!,
      prompt: riskAssessmentTemplate,
      outputParser: new StringOutputParser()
    });
    
    console.log('[LangChainIntegration] Analysis chains configured');
  }

  async analyzePrompt(prompt: string): Promise<PromptAnalysisResult> {
    if (!this.isInitialized) {
      throw new Error('LangChain integration not initialized');
    }

    console.log('[LangChainIntegration] Analyzing prompt with AI...');
    const startTime = Date.now();

    try {
      // Use the prompt analysis chain
      const analysisResult = await this.promptAnalysisChain!.invoke({ prompt });
      
      // Parse the JSON response
      const analysis = this.parseAnalysisResult(analysisResult.text || analysisResult.toString());
      
      const processingTime = Date.now() - startTime;
      console.log(`[LangChainIntegration] Prompt analysis completed in ${processingTime}ms`);
      
      return {
        ...analysis,
        processingTime,
        confidence: this.calculateConfidence(analysis)
      };
    } catch (error) {
      console.error('[LangChainIntegration] Prompt analysis failed:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(prompt, Date.now() - startTime);
    }
  }

  async generateAgentSpecifications(domainAnalysis: any, promptAnalysis: PromptAnalysisResult): Promise<AgentSpecification[]> {
    if (!this.isInitialized) {
      throw new Error('LangChain integration not initialized');
    }

    console.log('[LangChainIntegration] Generating agent specifications...');
    const startTime = Date.now();

    try {
      // Use the agent generation chain
      const agentResult = await this.agentGenerationChain!.invoke({
        domainAnalysis: JSON.stringify(domainAnalysis),
        promptAnalysis: JSON.stringify(promptAnalysis)
      });
      
      // Parse the JSON response
      const agents = this.parseAgentSpecifications(agentResult.text || agentResult.toString());
      
      const processingTime = Date.now() - startTime;
      console.log(`[LangChainIntegration] Generated ${agents.length} agents in ${processingTime}ms`);
      
      return agents;
    } catch (error) {
      console.error('[LangChainIntegration] Agent generation failed:', error);
      // Fallback to rule-based agent generation
      return this.fallbackAgentGeneration(domainAnalysis, promptAnalysis);
    }
  }

  private parseAnalysisResult(result: string): Omit<PromptAnalysisResult, 'confidence' | 'processingTime'> {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(result);
      return {
        intent: parsed.intent || 'general',
        entities: parsed.entities || [],
        requirements: parsed.requirements || [],
        constraints: parsed.constraints || [],
        successCriteria: parsed.successCriteria || [],
        riskFactors: parsed.riskFactors || []
      };
    } catch (error) {
      // Fallback parsing
      return this.extractFromText(result);
    }
  }

  private parseAgentSpecifications(result: string): AgentSpecification[] {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(result);
      if (Array.isArray(parsed)) {
        return parsed.map(agent => ({
          id: agent.id || `agent-${Date.now()}`,
          role: agent.role || 'Unknown',
          description: agent.description || '',
          capabilities: agent.capabilities || [],
          dependencies: agent.dependencies || [],
          parameters: agent.parameters || {},
          conditions: agent.conditions || {},
          methods: agent.methods || [],
          actions: agent.actions || []
        }));
      }
    } catch (error) {
      console.log('[LangChainIntegration] Failed to parse agent specifications as JSON');
    }
    
    // Return default agents if parsing fails
    return this.getDefaultAgents();
  }

  private extractFromText(text: string): Omit<PromptAnalysisResult, 'confidence' | 'processingTime'> {
    const lowerText = text.toLowerCase();
    
    return {
      intent: this.extractIntent(lowerText),
      entities: this.extractEntities(lowerText),
      requirements: this.extractRequirements(lowerText),
      constraints: this.extractConstraints(lowerText),
      successCriteria: this.extractSuccessCriteria(lowerText),
      riskFactors: this.extractRiskFactors(lowerText)
    };
  }

  private extractIntent(text: string): string {
    if (text.includes('create') || text.includes('build')) return 'creation';
    if (text.includes('analyze') || text.includes('examine')) return 'analysis';
    if (text.includes('optimize') || text.includes('improve')) return 'optimization';
    if (text.includes('deploy') || text.includes('launch')) return 'deployment';
    if (text.includes('test') || text.includes('validate')) return 'testing';
    return 'general';
  }

  private extractEntities(text: string): string[] {
    const entities = [];
    if (text.includes('user')) entities.push('User');
    if (text.includes('customer')) entities.push('Customer');
    if (text.includes('admin')) entities.push('Administrator');
    if (text.includes('data')) entities.push('Data');
    if (text.includes('database')) entities.push('Database');
    if (text.includes('api')) entities.push('API');
    if (text.includes('service')) entities.push('Service');
    if (text.includes('order')) entities.push('Order');
    if (text.includes('product')) entities.push('Product');
    return entities;
  }

  private extractRequirements(text: string): string[] {
    const requirements = [];
    if (text.includes('fast') || text.includes('performance')) requirements.push('Performance');
    if (text.includes('scalable') || text.includes('scale')) requirements.push('Scalability');
    if (text.includes('secure') || text.includes('security')) requirements.push('Security');
    if (text.includes('reliable') || text.includes('stable')) requirements.push('Reliability');
    if (text.includes('maintainable') || text.includes('clean')) requirements.push('Maintainability');
    return requirements;
  }

  private extractConstraints(text: string): string[] {
    const constraints = [];
    if (text.includes('budget') || text.includes('cost')) constraints.push('Budget');
    if (text.includes('deadline') || text.includes('time')) constraints.push('Time');
    if (text.includes('legacy') || text.includes('existing')) constraints.push('Legacy Integration');
    if (text.includes('mobile') || text.includes('responsive')) constraints.push('Mobile Support');
    if (text.includes('compliance') || text.includes('regulation')) constraints.push('Compliance');
    return constraints;
  }

  private extractSuccessCriteria(text: string): string[] {
    const criteria = [];
    if (text.includes('user') || text.includes('customer')) criteria.push('User satisfaction');
    if (text.includes('performance') || text.includes('speed')) criteria.push('Performance targets met');
    if (text.includes('business') || text.includes('value')) criteria.push('Business value delivered');
    return criteria;
  }

  private extractRiskFactors(text: string): string[] {
    const risks = [];
    if (text.includes('ml') || text.includes('ai')) risks.push('Model accuracy');
    if (text.includes('gpu') || text.includes('hardware')) risks.push('Hardware dependencies');
    if (text.includes('data') || text.includes('sensitive')) risks.push('Data security');
    if (text.includes('enterprise') || text.includes('large')) risks.push('Scalability challenges');
    return risks;
  }

  private fallbackAnalysis(prompt: string, processingTime: number): PromptAnalysisResult {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      intent: this.extractIntent(lowerPrompt),
      entities: this.extractEntities(lowerPrompt),
      requirements: this.extractRequirements(lowerPrompt),
      constraints: this.extractConstraints(lowerPrompt),
      successCriteria: this.extractSuccessCriteria(lowerPrompt),
      riskFactors: this.extractRiskFactors(lowerPrompt),
      confidence: 0.7,
      processingTime
    };
  }

  private fallbackAgentGeneration(domainAnalysis: any, promptAnalysis: PromptAnalysisResult): AgentSpecification[] {
    const agents: AgentSpecification[] = [];
    
    // Always generate domain validator
    agents.push({
      id: 'domain-validator',
      role: 'Domain Validator',
      description: 'Validates domain requirements and business logic',
      capabilities: ['Domain Validation', 'Business Logic Verification'],
      dependencies: ['aiko', 'ryu'],
      parameters: {},
      conditions: {},
      methods: ['validateDomain', 'checkBusinessLogic'],
      actions: ['approve', 'reject']
    });
    
    // Generate ML architect if ML requirements detected
    if (domainAnalysis.technicalRequirements.includes('Machine Learning')) {
      agents.push({
        id: 'ml-architect',
        role: 'ML Architect',
        description: 'Designs and implements ML solutions with GPU acceleration',
        capabilities: ['ML Model Design', 'GPU Optimization', 'Performance Tuning'],
        dependencies: ['aiko', 'ryu', 'gpu-accelerator'],
        parameters: {
          mlFramework: 'TensorFlow GPU',
          modelType: 'Neural Network',
          performanceTargets: domainAnalysis.performanceTargets
        },
        conditions: {
          gpuAvailable: true,
          dataQuality: 'high'
        },
        methods: ['designModel', 'trainModel', 'optimizePerformance'],
        actions: ['deploy', 'monitor', 'retrain']
      });
    }
    
    return agents;
  }

  private getDefaultAgents(): AgentSpecification[] {
    return [
      {
        id: 'domain-validator',
        role: 'Domain Validator',
        description: 'Validates domain requirements and business logic',
        capabilities: ['Domain Validation', 'Business Logic Verification'],
        dependencies: ['aiko', 'ryu'],
        parameters: {},
        conditions: {},
        methods: ['validateDomain', 'checkBusinessLogic'],
        actions: ['approve', 'reject']
      }
    ];
  }

  private calculateConfidence(analysis: any): number {
    let confidence = 0.8; // Base confidence
    
    // Adjust based on intent clarity
    if (analysis.intent !== 'general') confidence += 0.05;
    
    // Adjust based on entity richness
    if (analysis.entities.length > 2) confidence += 0.05;
    
    // Adjust based on requirements specificity
    if (analysis.requirements.length > 0) confidence += 0.05;
    
    // Adjust based on risk assessment
    if (analysis.riskFactors.length < 3) confidence += 0.05;
    
    return Math.min(Math.max(confidence, 0.7), 0.95);
  }

  async getModelInfo(): Promise<any> {
    return {
      name: this.config.modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      streaming: this.config.enableStreaming,
      capabilities: ['Prompt Analysis', 'Agent Generation', 'Risk Assessment']
    };
  }
} 