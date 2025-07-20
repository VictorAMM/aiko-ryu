import { InfiniteLoopDetector, ContextEnrichment, LoopContext } from './InfiniteLoopDetector';

export interface ErrorHandlingConfig {
  maxRetries: number;
  retryDelayMs: number;
  exponentialBackoff: boolean;
  contextPropagationEnabled: boolean;
  fallbackEnabled: boolean;
  circuitBreakerEnabled: boolean;
}

export interface ErrorHandlingResult {
  success: boolean;
  action: 'retry' | 'fallback' | 'degrade' | 'fail' | 'circuit-break';
  enrichedContext: ContextEnrichment;
  retryDelay?: number;
  alternativeAgent?: string;
  fallbackStrategy?: string;
  error: Error;
  metadata: {
    iteration: number;
    timeElapsed: number;
    circuitBreakerStatus: string;
    systemHealth: string;
  };
}

export interface AgentRetryContext {
  agentId: string;
  eventType: string;
  originalError: Error;
  enrichedContext: ContextEnrichment;
  retryAttempt: number;
  maxRetries: number;
  alternativeAgents: string[];
  fallbackStrategies: string[];
}

export class EnhancedErrorHandler {
  private config: ErrorHandlingConfig;
  private loopDetector: InfiniteLoopDetector;
  private retryHistory: Map<string, AgentRetryContext>;
  private agentCapabilities: Map<string, string[]>;

  constructor(config: Partial<ErrorHandlingConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelayMs: 1000,
      exponentialBackoff: true,
      contextPropagationEnabled: true,
      fallbackEnabled: true,
      circuitBreakerEnabled: true,
      ...config
    };

    this.loopDetector = new InfiniteLoopDetector();
    this.retryHistory = new Map();
    this.agentCapabilities = new Map();

    // Initialize agent capabilities
    this.initializeAgentCapabilities();

    // Listen to loop detection events
    this.loopDetector.on('loop.detected', this.handleLoopDetection.bind(this));
  }

  /**
   * Enhanced error handling with infinite loop detection and context enrichment
   */
  async handleError(
    agentId: string,
    eventType: string,
    error: Error,
    context: Record<string, unknown> = {}
  ): Promise<ErrorHandlingResult> {
    
    // Step 1: Detect and handle infinite loops
    const loopResult = await this.loopDetector.detectAndHandleLoop(
      agentId,
      eventType,
      error,
      context
    );

    // Step 2: Generate comprehensive context enrichment
    const enrichedContext = loopResult.enrichedContext;

    // Step 3: Determine optimal recovery action
    const recoveryAction = this.determineOptimalRecoveryAction(
      agentId,
      eventType,
      error,
      enrichedContext,
      loopResult.isLoop
    );

    // Step 4: Prepare retry context for alternative agents
    const retryContext = this.prepareRetryContext(
      agentId,
      eventType,
      error,
      enrichedContext,
      recoveryAction
    );

    // Step 5: Update circuit breaker status
    if (this.config.circuitBreakerEnabled) {
      this.loopDetector.updateCircuitBreaker(agentId, false);
    }

    // Step 6: Calculate retry delay if retrying
    const retryDelay = recoveryAction === 'retry' ? 
      this.calculateRetryDelay(retryContext.retryAttempt) : undefined;

    return {
      success: recoveryAction !== 'fail',
      action: recoveryAction,
      enrichedContext,
      retryDelay,
      alternativeAgent: retryContext.alternativeAgents[0],
      fallbackStrategy: retryContext.fallbackStrategies[0],
      error,
      metadata: {
        iteration: loopResult.isLoop ? enrichedContext.errorContext.iterationCount : 1,
        timeElapsed: enrichedContext.errorContext.timeElapsed,
        circuitBreakerStatus: enrichedContext.recoveryContext.circuitBreakerStatus.status,
        systemHealth: enrichedContext.systemContext.systemHealth.overallStatus
      }
    };
  }

  /**
   * Propagate enriched context to alternative agents for retry
   */
  async propagateContextForRetry(
    retryContext: AgentRetryContext,
    targetAgents: string[]
  ): Promise<{
    success: boolean;
    results: Array<{
      agentId: string;
      success: boolean;
      result?: unknown;
      error?: string;
    }>;
  }> {
    const results = [];

    for (const agentId of targetAgents) {
      try {
        // Check if agent can handle this event type
        if (!this.canAgentHandleEvent(agentId, retryContext.eventType)) {
          results.push({
            agentId,
            success: false,
            error: `Agent ${agentId} cannot handle event type ${retryContext.eventType}`
          });
          continue;
        }

        // Prepare enriched context for this agent
        const agentSpecificContext = this.prepareAgentSpecificContext(
          agentId,
          retryContext
        );

        // Simulate agent retry (in real implementation, this would call the agent)
        const result = await this.simulateAgentRetry(agentId, agentSpecificContext);

        results.push({
          agentId,
          success: result.success,
          result: result.output,
          error: result.error
        });

        // Update circuit breaker on success
        if (result.success && this.config.circuitBreakerEnabled) {
          this.loopDetector.updateCircuitBreaker(agentId, true);
        }

      } catch (error) {
        results.push({
          agentId,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    const success = results.some(r => r.success);

    return {
      success,
      results
    };
  }

  /**
   * Determine optimal recovery action based on comprehensive analysis
   */
  private determineOptimalRecoveryAction(
    agentId: string,
    eventType: string,
    error: Error,
    enrichedContext: ContextEnrichment,
    isLoop: boolean
  ): 'retry' | 'fallback' | 'degrade' | 'fail' | 'circuit-break' {
    
    // Circuit breaker is open
    if (enrichedContext.recoveryContext.circuitBreakerStatus.status === 'open') {
      return 'circuit-break';
    }

    // Too many iterations in loop
    if (isLoop && enrichedContext.errorContext.iterationCount > 5) {
      return 'fail';
    }

    // System is in critical state
    if (enrichedContext.systemContext.systemHealth.overallStatus === 'critical') {
      return 'degrade';
    }

    // We have alternative agents available
    if (enrichedContext.recoveryContext.alternativeAgents.length > 0) {
      return 'fallback';
    }

    // We have fallback strategies
    if (enrichedContext.recoveryContext.fallbackStrategies.length > 0) {
      return 'degrade';
    }

    // Retry with backoff
    if (enrichedContext.errorContext.iterationCount <= this.config.maxRetries) {
      return 'retry';
    }

    return 'fail';
  }

  /**
   * Prepare comprehensive retry context for alternative agents
   */
  private prepareRetryContext(
    agentId: string,
    eventType: string,
    error: Error,
    enrichedContext: ContextEnrichment,
    recoveryAction: string
  ): AgentRetryContext {
    
    const retryAttempt = enrichedContext.errorContext.iterationCount;
    const alternativeAgents = enrichedContext.recoveryContext.alternativeAgents;
    const fallbackStrategies = enrichedContext.recoveryContext.fallbackStrategies;

    const retryContext: AgentRetryContext = {
      agentId,
      eventType,
      originalError: error,
      enrichedContext,
      retryAttempt,
      maxRetries: this.config.maxRetries,
      alternativeAgents,
      fallbackStrategies
    };

    // Store retry context for tracking
    const contextKey = `${agentId}-${eventType}-${Date.now()}`;
    this.retryHistory.set(contextKey, retryContext);

    return retryContext;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    if (!this.config.exponentialBackoff) {
      return this.config.retryDelayMs;
    }

    const baseDelay = this.config.retryDelayMs;
    const maxDelay = 30000; // 30 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }

  /**
   * Check if an agent can handle a specific event type
   */
  private canAgentHandleEvent(agentId: string, eventType: string): boolean {
    const capabilities = this.agentCapabilities.get(agentId) || [];
    
    // Check if agent has capability for this event type
    return capabilities.some(capability => 
      eventType.includes(capability) || capability.includes(eventType)
    );
  }

  /**
   * Prepare agent-specific context for retry
   */
  private prepareAgentSpecificContext(
    agentId: string,
    retryContext: AgentRetryContext
  ): Record<string, unknown> {
    
    const baseContext = retryContext.enrichedContext.enrichedData;
    
    // Add agent-specific adaptations
    const agentSpecificContext = {
      ...baseContext,
      retryInfo: {
        originalAgent: retryContext.agentId,
        retryAttempt: retryContext.retryAttempt,
        alternativeAgent: agentId,
        fallbackStrategy: retryContext.fallbackStrategies[0]
      },
      agentCapabilities: this.agentCapabilities.get(agentId) || [],
      systemState: retryContext.enrichedContext.systemContext,
      recoveryOptions: retryContext.enrichedContext.recoveryContext
    };

    return agentSpecificContext;
  }

  /**
   * Simulate agent retry (in real implementation, this would call the actual agent)
   */
  private async simulateAgentRetry(
    agentId: string,
    context: Record<string, unknown>
  ): Promise<{
    success: boolean;
    output?: unknown;
    error?: string;
  }> {
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate success/failure based on agent and context
    const successRate = this.getAgentSuccessRate(agentId);
    const success = Math.random() < successRate;

    if (success) {
      return {
        success: true,
        output: {
          agentId,
          processedAt: new Date(),
          context: context,
          result: 'success'
        }
      };
    } else {
      return {
        success: false,
        error: `Agent ${agentId} failed to process request`
      };
    }
  }

  /**
   * Get agent success rate based on historical data
   */
  private getAgentSuccessRate(agentId: string): number {
    const successRates: Record<string, number> = {
      'aiko': 0.9,
      'alex': 0.85,
      'ryu': 0.95,
      'sarah': 0.8,
      'maya': 0.88
    };

    return successRates[agentId] || 0.7;
  }

  /**
   * Handle loop detection events
   */
  private handleLoopDetection(data: {
    loopContext: LoopContext;
    enrichedContext: ContextEnrichment;
    recoveryAction: string;
    timestamp: Date;
  }): void {
    console.log(`🔄 Loop detected for agent ${data.loopContext.agentId}:`, {
      iteration: data.loopContext.iteration,
      errorPattern: data.loopContext.errorPattern,
      recoveryAction: data.recoveryAction,
      systemHealth: data.enrichedContext.systemContext.systemHealth.overallStatus
    });
  }

  /**
   * Initialize agent capabilities mapping
   */
  private initializeAgentCapabilities(): void {
    this.agentCapabilities.set('aiko', [
      'specification', 'validation', 'consensus', 'llm', 'semantic'
    ]);
    
    this.agentCapabilities.set('alex', [
      'workflow', 'dag', 'orchestration', 'task', 'execution'
    ]);
    
    this.agentCapabilities.set('ryu', [
      'integrity', 'validation', 'compliance', 'policy', 'security'
    ]);
    
    this.agentCapabilities.set('sarah', [
      'user', 'behavior', 'personalization', 'rag', 'analysis'
    ]);
    
    this.agentCapabilities.set('maya', [
      'context', 'propagation', 'state', 'management', 'communication'
    ]);
  }

  /**
   * Get system state for monitoring
   */
  getSystemState(): {
    activeLoops: LoopContext[];
    agentStatuses: Map<string, any>;
    circuitBreakers: Map<string, any>;
    systemHealth: any;
    retryHistory: Map<string, AgentRetryContext>;
  } {
    return {
      ...this.loopDetector.getSystemState(),
      retryHistory: this.retryHistory
    };
  }

  /**
   * Cleanup old retry history
   */
  cleanup(): void {
    const cutoff = Date.now() - 300000; // 5 minutes
    
    for (const [key, context] of this.retryHistory.entries()) {
      if (Date.now() - parseInt(key.split('-')[2]) > cutoff) {
        this.retryHistory.delete(key);
      }
    }
  }
} 