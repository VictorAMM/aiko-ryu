import { AikoRyuOrchestrator, OrchestrationRequest, OrchestrationResponse } from './agents/AikoRyuOrchestrator';

export class AikoRyuEnterprise {
  private orchestrator: AikoRyuOrchestrator;
  
  constructor() {
    this.orchestrator = new AikoRyuOrchestrator();
  }
  
  /**
   * Initialize the enterprise system
   */
  async initialize(): Promise<void> {
    await this.orchestrator.initialize();
  }
  
  /**
   * Get knowledge about any topic
   */
  async getKnowledge(query: string, options: {
    domain?: string;
    confidence?: number;
    maxTokens?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  } = {}): Promise<{
    content: string;
    model: string;
    confidence: number;
    sources: any[];
  }> {
    const response = await this.orchestrator.orchestrate({
      type: 'knowledge',
      query,
      context: {
        domain: options.domain,
        confidenceThreshold: options.confidence,
        maxTokens: options.maxTokens
      },
      priority: options.priority || 'medium'
    });
    
    if (!response.success) {
      throw new Error(`Knowledge retrieval failed: ${response.metadata.recommendations.join(', ')}`);
    }
    
    return response.result;
  }
  
  /**
   * Generate responses with context
   */
  async generateResponse(prompt: string, options: {
    domain?: string;
    temperature?: number;
    maxTokens?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  } = {}): Promise<{
    text: string;
    model: string;
    confidence: number;
    tokens: number;
  }> {
    const response = await this.orchestrator.orchestrate({
      type: 'generation',
      prompt,
      context: {
        domain: options.domain,
        temperature: options.temperature,
        maxTokens: options.maxTokens
      },
      priority: options.priority || 'medium'
    });
    
    if (!response.success) {
      throw new Error(`Response generation failed: ${response.metadata.recommendations.join(', ')}`);
    }
    
    return response.result;
  }
  
  /**
   * Validate specifications
   */
  async validateSpecification(specification: any): Promise<{
    valid: boolean;
    consensus: boolean;
    reason: string;
    recommendations: string[];
  }> {
    const response = await this.orchestrator.orchestrate({
      type: 'validation',
      specification
    });
    
    if (!response.success) {
      throw new Error(`Validation failed: ${response.metadata.recommendations.join(', ')}`);
    }
    
    return response.result;
  }
  
  /**
   * Evolve the system for better performance
   */
  async evolveSystem(target: 'performance' | 'capability' | 'reliability' | 'scalability' = 'performance'): Promise<{
    target: string;
    plan: any;
    applied: boolean;
    currentMetrics: any;
    projectedMetrics: any;
  }> {
    const response = await this.orchestrator.orchestrate({
      type: 'evolution',
      evolutionTarget: target,
      priority: 'high'
    });
    
    if (!response.success) {
      throw new Error(`Evolution failed: ${response.metadata.recommendations.join(', ')}`);
    }
    
    return response.result;
  }
  
  /**
   * Optimize system performance
   */
  async optimizeSystem(): Promise<{
    currentStatus: any;
    optimizations: string[];
    priority: string;
    estimatedImpact: string;
  }> {
    const response = await this.orchestrator.orchestrate({
      type: 'optimization',
      priority: 'high'
    });
    
    if (!response.success) {
      throw new Error(`Optimization failed: ${response.metadata.recommendations.join(', ')}`);
    }
    
    return response.result;
  }
  
  /**
   * Get system metrics
   */
  async getMetrics(): Promise<{
    throughput: number;
    latency: number;
    accuracy: number;
    reliability: number;
    scalability: number;
    costEfficiency: number;
    userSatisfaction: number;
  }> {
    return await this.orchestrator.getSystemMetrics();
  }
  
  /**
   * Get evolution history
   */
  async getEvolutionHistory(): Promise<any[]> {
    return await this.orchestrator.getEvolutionHistory();
  }
  
  /**
   * Configure auto-evolution
   */
  setAutoEvolution(enabled: boolean): void {
    this.orchestrator.setAutoEvolution(enabled);
  }
  
  /**
   * Set evolution threshold
   */
  setEvolutionThreshold(threshold: number): void {
    this.orchestrator.setEvolutionThreshold(threshold);
  }
} 