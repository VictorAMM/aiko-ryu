import { EventEmitter } from 'events';
import { AGENT_REGISTRY } from '../index';
import { AikoAgent } from './AikoAgent';
import { SarahAgent } from './SarahAgent';
import { AlexAgent } from './AlexAgent';
import { MayaAgent } from './MayaAgent';
import { RyuAgent } from './RyuAgent';

export interface OrchestrationRequest {
  type: 'knowledge' | 'generation' | 'validation' | 'evolution' | 'optimization';
  query?: string;
  prompt?: string;
  specification?: any;
  context?: Record<string, unknown>;
  evolutionTarget?: 'performance' | 'capability' | 'reliability' | 'scalability';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface OrchestrationResponse {
  success: boolean;
  result: any;
  metadata: {
    orchestratorVersion: string;
    executionTime: number;
    agentsUsed: string[];
    confidence: number;
    evolutionApplied: boolean;
    recommendations: string[];
  };
}

export interface SystemEvolution {
  type: 'performance' | 'capability' | 'reliability' | 'scalability';
  changes: string[];
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  applied: boolean;
  timestamp: number;
}

export interface EnterpriseMetrics {
  throughput: number;
  latency: number;
  accuracy: number;
  reliability: number;
  scalability: number;
  costEfficiency: number;
  userSatisfaction: number;
}

export class AikoRyuOrchestrator extends EventEmitter {
  readonly id = 'aikoryu-orchestrator';
  readonly role = 'Enterprise Orchestrator';
  readonly version = '1.0.0';
  
  private agents: typeof AGENT_REGISTRY;
  private evolutionHistory: SystemEvolution[] = [];
  private performanceMetrics: EnterpriseMetrics;
  private autoEvolutionEnabled: boolean = true;
  private evolutionThreshold: number = 0.8;
  private lastEvolutionTime: number = 0;
  private evolutionCooldown: number = 300000; // 5 minutes
  private cachedMetrics: EnterpriseMetrics | null = null;
  private metricsCacheTime: number = 0;
  private metricsCacheDuration: number = 60000; // 1 minute cache
  
  constructor() {
    super();
    this.agents = AGENT_REGISTRY;
    this.performanceMetrics = this.initializeMetrics();
  }
  
  async initialize(): Promise<void> {
    console.log('🚀 Initializing AikoRyu Enterprise Orchestrator...');
    
    // Initialize all agents
    await this.ensureAgentsReady();
    
    // Start auto-evolution monitoring
    if (this.autoEvolutionEnabled) {
      this.startAutoEvolution();
    }
    
    console.log('✅ AikoRyu Orchestrator ready for enterprise usage');
  }
  
  /**
   * Simple Enterprise Interface - Single method for all operations
   */
  async orchestrate(request: OrchestrationRequest): Promise<OrchestrationResponse> {
    const startTime = Date.now();
    const agentsUsed: string[] = [];
    
    console.log(`🎯 Orchestrating request: ${request.type}`, {
      priority: request.priority,
      hasQuery: !!request.query,
      hasPrompt: !!request.prompt,
      hasSpecification: !!request.specification
    });
    
    try {
      let result: any;
      
      switch (request.type) {
        case 'knowledge':
          console.log('📚 Handling knowledge request...');
          result = await this.handleKnowledgeRequest(request);
          agentsUsed.push('sarah');
          console.log('✅ Knowledge request completed');
          break;
          
        case 'generation':
          console.log('💬 Handling generation request...');
          result = await this.handleGenerationRequest(request);
          agentsUsed.push('sarah');
          console.log('✅ Generation request completed');
          break;
          
        case 'validation':
          console.log('🔍 Handling validation request...');
          result = await this.handleValidationRequest(request);
          agentsUsed.push('aiko');
          console.log('✅ Validation request completed');
          break;
          
        case 'evolution':
          console.log('🔄 Handling evolution request...');
          result = await this.handleEvolutionRequest(request);
          agentsUsed.push('alex', 'ryu', 'maya');
          console.log('✅ Evolution request completed');
          break;
          
        case 'optimization':
          console.log('⚡ Handling optimization request...');
          result = await this.handleOptimizationRequest(request);
          agentsUsed.push('alex', 'ryu');
          console.log('✅ Optimization request completed');
          break;
          
        default:
          throw new Error(`Unknown request type: ${request.type}`);
      }
      
      // Track interaction
      console.log('📊 Tracking interaction...');
      await this.trackInteraction(request, result);
      
      // Check for auto-evolution opportunities
      console.log('🔍 Checking auto-evolution...');
      const evolutionApplied = await this.checkAutoEvolution(request, result);
      
      const executionTime = Date.now() - startTime;
      console.log(`⏱️ Request completed in ${executionTime}ms`);
      
      const response: OrchestrationResponse = {
        success: true,
        result,
        metadata: {
          orchestratorVersion: this.version,
          executionTime,
          agentsUsed,
          confidence: this.calculateConfidence(result),
          evolutionApplied,
          recommendations: this.generateRecommendations(request, result)
        }
      };
      
      return response;
      
    } catch (error) {
      console.error('❌ Orchestration failed:', error);
      return {
        success: false,
        result: null,
        metadata: {
          orchestratorVersion: this.version,
          executionTime: Date.now() - startTime,
          agentsUsed: [],
          confidence: 0,
          evolutionApplied: false,
          recommendations: [`Error: ${error instanceof Error ? error.message : String(error)}`]
        }
      };
    }
  }
  
  /**
   * Enterprise Knowledge Retrieval
   */
  private async handleKnowledgeRequest(request: OrchestrationRequest): Promise<any> {
    const sarah = this.agents.sarah;
    
    const knowledge = await sarah.retrieveKnowledge(request.query!, {
      domain: request.context?.domain as string,
      confidenceThreshold: request.context?.confidenceThreshold as number || 0.8,
      maxTokens: request.context?.maxTokens as number || 1000
    });
    
    return {
      content: knowledge.content,
      model: knowledge.modelUsed,
      confidence: knowledge.confidence,
      sources: knowledge.sources
    };
  }
  
  /**
   * Enterprise Response Generation
   */
  private async handleGenerationRequest(request: OrchestrationRequest): Promise<any> {
    const sarah = this.agents.sarah;
    
    const response = await sarah.generateResponse(request.prompt!, {
      domain: request.context?.domain as string,
      temperature: request.context?.temperature as number || 0.7,
      maxTokens: request.context?.maxTokens as number || 500
    });
    
    return {
      text: response.text,
      model: response.model,
      confidence: response.confidence,
      tokens: response.tokens
    };
  }
  
  /**
   * Enterprise Specification Validation
   */
  private async handleValidationRequest(request: OrchestrationRequest): Promise<any> {
    const aiko = this.agents.aiko;
    
    const validation = aiko.validateSpecification(request.specification!);
    
    return {
      valid: validation.result,
      consensus: validation.consensus,
      reason: validation.reason,
      recommendations: this.generateValidationRecommendations(validation)
    };
  }
  
  /**
   * Enterprise System Evolution
   */
  private async handleEvolutionRequest(request: OrchestrationRequest): Promise<any> {
    const evolutionTarget = request.evolutionTarget || 'performance';
    
    // Analyze current system state
    const currentMetrics = await this.analyzeSystemState();
    
    // Generate evolution plan
    const evolutionPlan = await this.generateEvolutionPlan(evolutionTarget, currentMetrics);
    
    // Apply evolution if confidence is high enough
    if (evolutionPlan.confidence >= this.evolutionThreshold) {
      await this.applyEvolution(evolutionPlan);
    }
    
    return {
      target: evolutionTarget,
      plan: evolutionPlan,
      applied: evolutionPlan.confidence >= this.evolutionThreshold,
      currentMetrics,
      projectedMetrics: this.projectMetrics(currentMetrics, evolutionPlan)
    };
  }
  
  /**
   * Enterprise System Optimization
   */
  private async handleOptimizationRequest(request: OrchestrationRequest): Promise<any> {
    const alex = this.agents.alex;
    const ryu = this.agents.ryu;
    
    // Get current system status
    const systemStatus = ryu.getStatus();
    
    // Generate optimization recommendations
    const optimizations = await this.generateOptimizations(systemStatus);
    
    return {
      currentStatus: systemStatus,
      optimizations,
      priority: request.priority || 'medium',
      estimatedImpact: this.estimateOptimizationImpact(optimizations)
    };
  }
  
  /**
   * Auto-Evolution Monitoring
   */
  private startAutoEvolution(): void {
    console.log('🔄 Starting auto-evolution monitoring...');
    
    setInterval(async () => {
      try {
        console.log('📊 Checking system state for evolution...');
        const metrics = await this.analyzeSystemState();
        
        console.log('📈 Current metrics:', {
          throughput: metrics.throughput.toFixed(2),
          latency: metrics.latency.toFixed(0),
          accuracy: metrics.accuracy.toFixed(2),
          reliability: metrics.reliability.toFixed(2)
        });
        
        // Check if evolution is needed
        if (this.shouldEvolve(metrics)) {
          console.log('🔄 Evolution needed, triggering...');
          const evolution = await this.handleEvolutionRequest({
            type: 'evolution',
            evolutionTarget: this.determineEvolutionTarget(metrics) as 'performance' | 'capability' | 'reliability' | 'scalability',
            priority: 'medium'
          });
          
          if (evolution.applied) {
            console.log('✅ Auto-evolution applied:', evolution.plan.changes);
            // Add delay to prevent rapid evolution cycles
            await new Promise(resolve => setTimeout(resolve, 300)); // 30 second cooldown
          } else {
            console.log('⏸️ Evolution not applied (confidence too low)');
          }
        } else {
          console.log('✅ System performing well, no evolution needed');
        }
      } catch (error) {
        console.error('❌ Auto-evolution error:', error);
      }
    }, 300000); // Check every 5 minutes
  }
  
  /**
   * System State Analysis
   */
  private async analyzeSystemState(): Promise<EnterpriseMetrics> {
    // Check cache first
    const now = Date.now();
    if (this.cachedMetrics && (now - this.metricsCacheTime) < this.metricsCacheDuration) {
      console.log('📊 Using cached metrics...');
      return this.cachedMetrics;
    }
    
    console.log('📊 Analyzing system state...');
    
    const sarah = this.agents.sarah;
    const ryu = this.agents.ryu;
    
    // Measure throughput
    console.log('🚀 Measuring throughput...');
    const startTime = Date.now();
    const testKnowledge = await sarah.retrieveKnowledge('test query');
    const throughput = 1000 / (Date.now() - startTime); // requests per second
    
    console.log('⏱️ Measuring latency...');
    const latency = testKnowledge.responseTime;
    
    console.log('🎯 Measuring accuracy...');
    const accuracy = testKnowledge.confidence;
    
    // Get system health
    console.log('💚 Checking system health...');
    const systemStatus = ryu.getStatus();
    const reliability = (systemStatus as any).health === 'healthy' ? 0.95 : 0.7;
    
    // Estimate scalability (based on available models and system resources)
    console.log('📈 Estimating scalability...');
    const models = await sarah.listAvailableModels();
    const scalability = Math.min(models.length / 10, 1.0); // Normalize to 0-1
    
    // Calculate cost efficiency (tokens per second)
    const costEfficiency = testKnowledge.tokensUsed / (latency / 1000);
    
    // Estimate user satisfaction (based on response quality)
    const userSatisfaction = accuracy * reliability;
    
    const metrics = {
      throughput,
      latency,
      accuracy,
      reliability,
      scalability,
      costEfficiency,
      userSatisfaction
    };
    
    // Cache the metrics
    this.cachedMetrics = metrics;
    this.metricsCacheTime = now;
    
    console.log('📊 System metrics calculated:', {
      throughput: throughput.toFixed(2),
      latency: latency.toFixed(0),
      accuracy: accuracy.toFixed(2),
      reliability: reliability.toFixed(2),
      scalability: scalability.toFixed(2),
      costEfficiency: costEfficiency.toFixed(2),
      userSatisfaction: userSatisfaction.toFixed(2)
    });
    
    return metrics;
  }
  
  /**
   * Evolution Plan Generation
   */
  private async generateEvolutionPlan(target: string, currentMetrics: EnterpriseMetrics): Promise<SystemEvolution> {
    const changes: string[] = [];
    let confidence = 0.5;
    
    switch (target) {
      case 'performance':
        if (currentMetrics.throughput < 10) {
          changes.push('Optimize model loading and caching');
          changes.push('Implement response streaming');
          confidence = 0.8;
        }
        if (currentMetrics.latency > 5000) {
          changes.push('Enable GPU acceleration');
          changes.push('Optimize prompt processing');
          confidence = 0.9;
        }
        break;
        
      case 'capability':
        if (currentMetrics.accuracy < 0.8) {
          changes.push('Switch to higher quality model');
          changes.push('Implement ensemble responses');
          confidence = 0.7;
        }
        break;
        
      case 'reliability':
        if (currentMetrics.reliability < 0.9) {
          changes.push('Implement circuit breakers');
          changes.push('Add retry mechanisms');
          confidence = 0.8;
        }
        break;
        
      case 'scalability':
        if (currentMetrics.scalability < 0.8) {
          changes.push('Add model load balancing');
          changes.push('Implement horizontal scaling');
          confidence = 0.6;
        }
        break;
    }
    
    return {
      type: target as any,
      changes,
      impact: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
      confidence,
      applied: false,
      timestamp: Date.now()
    };
  }
  
  /**
   * Apply Evolution Changes
   */
  private async applyEvolution(evolution: SystemEvolution): Promise<void> {
    console.log(`🔄 Applying evolution: ${evolution.type}`);
    
    for (const change of evolution.changes) {
      console.log(`  - ${change}`);
      // Here you would implement the actual changes
      // For now, we'll just track them
    }
    
    evolution.applied = true;
    this.lastEvolutionTime = Date.now();
    this.evolutionHistory.push(evolution);
    
    // Emit evolution event
    this.emit('evolution.applied', evolution);
  }
  
  /**
   * Generate Optimizations
   */
  private async generateOptimizations(systemStatus: any): Promise<string[]> {
    const optimizations: string[] = [];
    
    if (systemStatus.health !== 'healthy') {
      optimizations.push('Restart unhealthy agents');
    }
    
    if (systemStatus.security !== 'secure') {
      optimizations.push('Enhance security measures');
    }
    
    if (systemStatus.compliance !== 'compliant') {
      optimizations.push('Update compliance protocols');
    }
    
    return optimizations;
  }
  
  /**
   * Helper Methods
   */
  private async ensureAgentsReady(): Promise<void> {
    // Ensure all agents are initialized
    const agents = Object.values(this.agents);
    for (const agent of agents) {
      if (agent.initialize) {
        await agent.initialize();
      }
    }
  }
  
  private async trackInteraction(request: OrchestrationRequest, result: any): Promise<void> {
    const maya = this.agents.maya;
    await maya.trackUserInteraction({
      id: `interaction-${Date.now()}`,
      userId: 'enterprise-user',
      sessionId: 'enterprise-session',
      action: `orchestration-${request.type}`,
      outcome: 'success',
      timestamp: new Date(),
      context: { requestType: request.type, resultType: typeof result }
    });
  }
  
  private async checkAutoEvolution(request: OrchestrationRequest, result: any): Promise<boolean> {
    console.log('🔍 Checking auto-evolution for request:', request.type);
    
    if (!this.autoEvolutionEnabled) {
      console.log('⏸️ Auto-evolution disabled');
      return false;
    }
    
    // Check if this request indicates need for evolution
    console.log('📊 Analyzing metrics for auto-evolution...');
    const metrics = await this.analyzeSystemState();
    
    if (this.shouldEvolve(metrics)) {
      console.log('🔄 Auto-evolution triggered by request');
      const evolution = await this.handleEvolutionRequest({
        type: 'evolution',
        evolutionTarget: this.determineEvolutionTarget(metrics) as 'performance' | 'capability' | 'reliability' | 'scalability',
        priority: 'low'
      });
      
      const applied = evolution.applied;
      console.log(`✅ Auto-evolution ${applied ? 'applied' : 'not applied'} (confidence: ${evolution.plan.confidence})`);
      return applied;
    } else {
      console.log('✅ No auto-evolution needed for this request');
      return false;
    }
  }
  
  private shouldEvolve(metrics: EnterpriseMetrics): boolean {
    console.log('🔍 Checking if evolution is needed...');
    
    // Check if we're in cooldown period
    const now = Date.now();
    if (now - this.lastEvolutionTime < this.evolutionCooldown) {
      console.log('⏸️ Evolution in cooldown period');
      return false;
    }
    
    // Check if we've already evolved recently for the same issues
    const recentEvolutions = this.evolutionHistory.filter(
      ev => (now - ev.timestamp) < this.evolutionCooldown
    );
    
    if (recentEvolutions.length > 0) {
      console.log('⏸️ Recent evolution already applied, skipping');
      return false;
    }
    
    const needsEvolution = (
      metrics.throughput < 5 ||
      metrics.latency > 10000 ||
      metrics.accuracy < 0.7 ||
      metrics.reliability < 0.8
    );
    
    if (needsEvolution) {
      console.log('🔄 Evolution needed because:', {
        throughputLow: metrics.throughput < 5,
        latencyHigh: metrics.latency > 10000,
        accuracyLow: metrics.accuracy < 0.7,
        reliabilityLow: metrics.reliability < 0.8
      });
    } else {
      console.log('✅ No evolution needed - system performing well');
    }
    
    return needsEvolution;
  }
  
  private determineEvolutionTarget(metrics: EnterpriseMetrics): 'performance' | 'capability' | 'reliability' | 'scalability' {
    if (metrics.throughput < 5) return 'performance';
    if (metrics.accuracy < 0.7) return 'capability';
    if (metrics.reliability < 0.8) return 'reliability';
    if (metrics.scalability < 0.7) return 'scalability';
    return 'performance';
  }
  
  private calculateConfidence(result: any): number {
    if (result.confidence) return result.confidence;
    if (result.valid !== undefined) return result.valid ? 0.9 : 0.3;
    return 0.7;
  }
  
  private generateRecommendations(request: OrchestrationRequest, result: any): string[] {
    const recommendations: string[] = [];
    
    if (request.type === 'knowledge' && result.confidence < 0.8) {
      recommendations.push('Consider refining your query for better results');
    }
    
    if (request.type === 'generation' && result.tokens > 1000) {
      recommendations.push('Consider reducing maxTokens for faster responses');
    }
    
    if (request.priority === 'critical') {
      recommendations.push('Critical requests may benefit from higher quality models');
    }
    
    return recommendations;
  }
  
  private generateValidationRecommendations(validation: any): string[] {
    const recommendations: string[] = [];
    
    if (!validation.result) {
      recommendations.push('Review specification structure and requirements');
      recommendations.push('Ensure all required fields are properly defined');
    }
    
    if (!validation.consensus) {
      recommendations.push('Validate agent dependencies and contracts');
    }
    
    return recommendations;
  }
  
  private estimateOptimizationImpact(optimizations: string[]): 'low' | 'medium' | 'high' {
    if (optimizations.length === 0) return 'low';
    if (optimizations.length <= 2) return 'medium';
    return 'high';
  }
  
  private projectMetrics(current: EnterpriseMetrics, evolution: SystemEvolution): EnterpriseMetrics {
    const improvement = evolution.confidence * 0.2; // 20% improvement potential
    
    return {
      throughput: current.throughput * (1 + improvement),
      latency: current.latency * (1 - improvement),
      accuracy: Math.min(current.accuracy + improvement, 1.0),
      reliability: Math.min(current.reliability + improvement, 1.0),
      scalability: Math.min(current.scalability + improvement, 1.0),
      costEfficiency: current.costEfficiency * (1 + improvement),
      userSatisfaction: Math.min(current.userSatisfaction + improvement, 1.0)
    };
  }
  
  private initializeMetrics(): EnterpriseMetrics {
    return {
      throughput: 0,
      latency: 0,
      accuracy: 0,
      reliability: 0,
      scalability: 0,
      costEfficiency: 0,
      userSatisfaction: 0
    };
  }
  
  /**
   * Public API Methods
   */
  async getSystemMetrics(): Promise<EnterpriseMetrics> {
    return await this.analyzeSystemState();
  }
  
  async getEvolutionHistory(): Promise<SystemEvolution[]> {
    return this.evolutionHistory;
  }
  
  setAutoEvolution(enabled: boolean): void {
    this.autoEvolutionEnabled = enabled;
  }
  
  setEvolutionThreshold(threshold: number): void {
    this.evolutionThreshold = Math.max(0, Math.min(1, threshold));
  }
} 