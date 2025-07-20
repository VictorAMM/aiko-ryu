import { EventEmitter } from 'events';

export interface LoopDetectionConfig {
  maxIterations: number;
  timeWindowMs: number;
  similarityThreshold: number;
  contextRetentionMs: number;
  circuitBreakerThreshold: number;
}

export interface LoopContext {
  id: string;
  agentId: string;
  eventType: string;
  iteration: number;
  startTime: Date;
  lastIterationTime: Date;
  errorPattern: string;
  contextData: Record<string, unknown>;
  retryAttempts: number;
  maxRetries: number;
}

export interface ContextEnrichment {
  loopId: string;
  agentId: string;
  eventType: string;
  errorContext: {
    originalError: string;
    errorPattern: string;
    iterationCount: number;
    timeElapsed: number;
  };
  systemContext: {
    agentStatuses: Record<string, AgentStatus>;
    activeLoops: LoopContext[];
    recentErrors: ErrorContext[];
    systemHealth: SystemHealth;
  };
  recoveryContext: {
    suggestedActions: string[];
    alternativeAgents: string[];
    fallbackStrategies: string[];
    circuitBreakerStatus: CircuitBreakerStatus;
  };
  enrichedData: Record<string, unknown>;
}

export interface ErrorContext {
  id: string;
  timestamp: Date;
  agentId: string;
  eventType: string;
  error: string;
  context: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentStatus {
  id: string;
  status: 'active' | 'inactive' | 'error' | 'recovering';
  lastEvent: string;
  uptime: number;
  errorCount: number;
  successRate: number;
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  activeAgents: number;
  errorRate: number;
  responseTime: number;
  resourceUsage: number;
}

export interface CircuitBreakerStatus {
  agentId: string;
  status: 'closed' | 'open' | 'half-open';
  failureCount: number;
  lastFailureTime: Date;
  timeoutMs: number;
}

export class InfiniteLoopDetector extends EventEmitter {
  private config: LoopDetectionConfig;
  private activeLoops: Map<string, LoopContext>;
  private errorHistory: ErrorContext[];
  private agentStatuses: Map<string, AgentStatus>;
  private circuitBreakers: Map<string, CircuitBreakerStatus>;
  private contextCache: Map<string, ContextEnrichment>;

  constructor(config: Partial<LoopDetectionConfig> = {}) {
    super();
    this.config = {
      maxIterations: 5,
      timeWindowMs: 30000, // 30 seconds
      similarityThreshold: 0.8,
      contextRetentionMs: 300000, // 5 minutes
      circuitBreakerThreshold: 3,
      ...config
    };

    this.activeLoops = new Map();
    this.errorHistory = [];
    this.agentStatuses = new Map();
    this.circuitBreakers = new Map();
    this.contextCache = new Map();

    // Cleanup old data periodically
    setInterval(() => this.cleanupOldData(), 60000);
  }

  /**
   * Detect and handle infinite loops with comprehensive context enrichment
   */
  async detectAndHandleLoop(
    agentId: string,
    eventType: string,
    error: Error,
    context: Record<string, unknown> = {}
  ): Promise<{
    isLoop: boolean;
    shouldRetry: boolean;
    enrichedContext: ContextEnrichment;
    recoveryAction: string;
  }> {
    const loopId = this.generateLoopId(agentId, eventType, error);
    const currentTime = new Date();

    // Check if this is a new loop or continuation
    let loopContext = this.activeLoops.get(loopId);
    
    if (!loopContext) {
      // New potential loop
      loopContext = {
        id: loopId,
        agentId,
        eventType,
        iteration: 1,
        startTime: currentTime,
        lastIterationTime: currentTime,
        errorPattern: this.extractErrorPattern(error),
        contextData: context,
        retryAttempts: 0,
        maxRetries: this.config.maxIterations
      };
      this.activeLoops.set(loopId, loopContext);
    } else {
      // Existing loop - increment iteration
      loopContext.iteration++;
      loopContext.lastIterationTime = currentTime;
      loopContext.retryAttempts++;
    }

    // Record error in history
    this.recordError(agentId, eventType, error, context);

    // Update agent status
    this.updateAgentStatus(agentId, 'error', error);

    // Check for infinite loop conditions
    const isLoop = this.isInfiniteLoop(loopContext);
    const circuitBreakerStatus = this.checkCircuitBreaker(agentId);

    // Generate enriched context for recovery
    const enrichedContext = await this.generateEnrichedContext(
      loopContext,
      circuitBreakerStatus,
      context
    );

    // Determine recovery action
    const recoveryAction = this.determineRecoveryAction(
      loopContext,
      circuitBreakerStatus,
      enrichedContext
    );

    // Emit loop detection event
    this.emit('loop.detected', {
      loopContext,
      enrichedContext,
      recoveryAction,
      timestamp: currentTime
    });

    return {
      isLoop,
      shouldRetry: recoveryAction === 'retry' && circuitBreakerStatus.status !== 'open',
      enrichedContext,
      recoveryAction
    };
  }

  /**
   * Generate comprehensive context enrichment for agent retries
   */
  async generateEnrichedContext(
    loopContext: LoopContext,
    circuitBreakerStatus: CircuitBreakerStatus,
    originalContext: Record<string, unknown>
  ): Promise<ContextEnrichment> {
    const cacheKey = `${loopContext.id}-${Date.now()}`;
    
    // Check cache first
    const cached = this.contextCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Collect system-wide context
    const systemContext = await this.collectSystemContext();
    const recentErrors = this.getRecentErrors(loopContext.agentId);
    const alternativeAgents = this.findAlternativeAgents(loopContext.agentId);
    const fallbackStrategies = this.generateFallbackStrategies(loopContext);

    const enrichedContext: ContextEnrichment = {
      loopId: loopContext.id,
      agentId: loopContext.agentId,
      eventType: loopContext.eventType,
      errorContext: {
        originalError: loopContext.errorPattern,
        errorPattern: this.analyzeErrorPattern(loopContext.errorPattern),
        iterationCount: loopContext.iteration,
        timeElapsed: Date.now() - loopContext.startTime.getTime()
      },
      systemContext: {
        agentStatuses: Object.fromEntries(this.agentStatuses),
        activeLoops: Array.from(this.activeLoops.values()),
        recentErrors,
        systemHealth: this.calculateSystemHealth()
      },
      recoveryContext: {
        suggestedActions: this.generateSuggestedActions(loopContext),
        alternativeAgents,
        fallbackStrategies,
        circuitBreakerStatus
      },
      enrichedData: {
        ...originalContext,
        loopDetection: {
          iteration: loopContext.iteration,
          startTime: loopContext.startTime,
          errorPattern: loopContext.errorPattern
        },
        systemState: systemContext,
        recoveryOptions: {
          alternatives: alternativeAgents,
          fallbacks: fallbackStrategies
        }
      }
    };

    // Cache the enriched context
    this.contextCache.set(cacheKey, enrichedContext);

    return enrichedContext;
  }

  /**
   * Determine optimal recovery action based on loop analysis
   */
  private determineRecoveryAction(
    loopContext: LoopContext,
    circuitBreakerStatus: CircuitBreakerStatus,
    enrichedContext: ContextEnrichment
  ): 'retry' | 'fallback' | 'degrade' | 'fail' | 'circuit-break' {
    
    // Circuit breaker is open - fail fast
    if (circuitBreakerStatus.status === 'open') {
      return 'circuit-break';
    }

    // Too many iterations - fail
    if (loopContext.iteration > this.config.maxIterations) {
      return 'fail';
    }

    // Check if we have alternative agents
    if (enrichedContext.recoveryContext.alternativeAgents.length > 0) {
      return 'fallback';
    }

    // Check if we can degrade functionality
    if (enrichedContext.recoveryContext.fallbackStrategies.length > 0) {
      return 'degrade';
    }

    // Retry with exponential backoff
    if (loopContext.retryAttempts < this.config.maxIterations) {
      return 'retry';
    }

    return 'fail';
  }

  /**
   * Check if a loop context represents an infinite loop
   */
  private isInfiniteLoop(loopContext: LoopContext): boolean {
    const timeElapsed = Date.now() - loopContext.startTime.getTime();
    
    // Check iteration count
    if (loopContext.iteration > this.config.maxIterations) {
      return true;
    }

    // Check time window
    if (timeElapsed > this.config.timeWindowMs) {
      return true;
    }

    // Check for rapid iterations
    const iterationsPerSecond = loopContext.iteration / (timeElapsed / 1000);
    if (iterationsPerSecond > 2) { // More than 2 iterations per second
      return true;
    }

    return false;
  }

  /**
   * Check circuit breaker status for an agent
   */
  private checkCircuitBreaker(agentId: string): CircuitBreakerStatus {
    let status = this.circuitBreakers.get(agentId);
    
    if (!status) {
      status = {
        agentId,
        status: 'closed',
        failureCount: 0,
        lastFailureTime: new Date(),
        timeoutMs: 30000
      };
      this.circuitBreakers.set(agentId, status);
    }

    // Check if circuit breaker should be opened
    if (status.failureCount >= this.config.circuitBreakerThreshold) {
      const timeSinceLastFailure = Date.now() - status.lastFailureTime.getTime();
      
      if (status.status === 'closed' && timeSinceLastFailure < status.timeoutMs) {
        status.status = 'open';
      } else if (status.status === 'open' && timeSinceLastFailure >= status.timeoutMs) {
        status.status = 'half-open';
      }
    }

    return status;
  }

  /**
   * Update circuit breaker on failure
   */
  updateCircuitBreaker(agentId: string, success: boolean): void {
    const status = this.circuitBreakers.get(agentId);
    if (!status) return;

    if (success) {
      status.failureCount = 0;
      status.status = 'closed';
    } else {
      status.failureCount++;
      status.lastFailureTime = new Date();
      
      if (status.failureCount >= this.config.circuitBreakerThreshold) {
        status.status = 'open';
      }
    }
  }

  /**
   * Collect comprehensive system context
   */
  private async collectSystemContext(): Promise<Record<string, unknown>> {
    const context: Record<string, unknown> = {
      timestamp: new Date(),
      activeLoops: Array.from(this.activeLoops.values()),
      errorHistory: this.errorHistory.slice(-10), // Last 10 errors
      agentStatuses: Object.fromEntries(this.agentStatuses),
      circuitBreakers: Object.fromEntries(this.circuitBreakers),
      systemHealth: this.calculateSystemHealth()
    };

    return context;
  }

  /**
   * Calculate overall system health
   */
  private calculateSystemHealth(): SystemHealth {
    const totalAgents = this.agentStatuses.size;
    const activeAgents = Array.from(this.agentStatuses.values())
      .filter(status => status.status === 'active').length;
    
    const errorRate = totalAgents > 0 ? 
      Array.from(this.agentStatuses.values())
        .reduce((sum, status) => sum + status.errorCount, 0) / totalAgents : 0;

    const overallStatus = errorRate > 0.5 ? 'critical' :
                         errorRate > 0.2 ? 'degraded' : 'healthy';

    return {
      overallStatus,
      activeAgents,
      errorRate,
      responseTime: this.calculateAverageResponseTime(),
      resourceUsage: this.calculateResourceUsage()
    };
  }

  /**
   * Find alternative agents for the given agent
   */
  private findAlternativeAgents(agentId: string): string[] {
    const alternatives: string[] = [];
    
    // Map of agent alternatives based on capabilities
    const agentAlternatives: Record<string, string[]> = {
      'aiko': ['alex', 'sarah'],
      'alex': ['aiko', 'ryu'],
      'ryu': ['alex', 'maya'],
      'sarah': ['aiko', 'maya'],
      'maya': ['ryu', 'sarah']
    };

    const agentAlts = agentAlternatives[agentId] || [];
    
    // Filter to only active agents
    for (const altAgent of agentAlts) {
      const status = this.agentStatuses.get(altAgent);
      if (status && status.status === 'active' && status.errorCount < 3) {
        alternatives.push(altAgent);
      }
    }

    return alternatives;
  }

  /**
   * Generate fallback strategies for recovery
   */
  private generateFallbackStrategies(loopContext: LoopContext): string[] {
    const strategies: string[] = [];

    // Add strategies based on error pattern
    if (loopContext.errorPattern.includes('validation')) {
      strategies.push('skip-validation', 'use-cached-result', 'degrade-validation');
    }
    
    if (loopContext.errorPattern.includes('timeout')) {
      strategies.push('increase-timeout', 'use-async-processing', 'reduce-complexity');
    }
    
    if (loopContext.errorPattern.includes('dependency')) {
      strategies.push('use-local-fallback', 'skip-dependency', 'use-alternative-source');
    }

    // Add general strategies
    strategies.push('retry-with-backoff', 'use-circuit-breaker', 'degrade-functionality');

    return strategies;
  }

  /**
   * Generate suggested actions for recovery
   */
  private generateSuggestedActions(loopContext: LoopContext): string[] {
    const actions: string[] = [];

    if (loopContext.iteration <= 2) {
      actions.push('retry-immediate', 'check-dependencies', 'validate-input');
    } else if (loopContext.iteration <= 4) {
      actions.push('retry-with-backoff', 'use-fallback-agent', 'degrade-functionality');
    } else {
      actions.push('fail-fast', 'use-circuit-breaker', 'manual-intervention');
    }

    return actions;
  }

  /**
   * Record error in history
   */
  private recordError(
    agentId: string,
    eventType: string,
    error: Error,
    context: Record<string, unknown>
  ): void {
    const errorContext: ErrorContext = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      agentId,
      eventType,
      error: error.message,
      context,
      severity: this.calculateErrorSeverity(error, context)
    };

    this.errorHistory.push(errorContext);

    // Keep only recent errors
    if (this.errorHistory.length > 100) {
      this.errorHistory = this.errorHistory.slice(-50);
    }
  }

  /**
   * Update agent status
   */
  private updateAgentStatus(agentId: string, status: AgentStatus['status'], error?: Error): void {
    let agentStatus = this.agentStatuses.get(agentId);
    
    if (!agentStatus) {
      agentStatus = {
        id: agentId,
        status: 'active',
        lastEvent: '',
        uptime: 0,
        errorCount: 0,
        successRate: 1.0
      };
    }

    agentStatus.status = status;
    agentStatus.lastEvent = error ? 'error' : 'success';
    
    if (error) {
      agentStatus.errorCount++;
      agentStatus.successRate = Math.max(0, agentStatus.successRate - 0.1);
    } else {
      agentStatus.successRate = Math.min(1, agentStatus.successRate + 0.05);
    }

    this.agentStatuses.set(agentId, agentStatus);
  }

  /**
   * Get recent errors for an agent
   */
  private getRecentErrors(agentId: string): ErrorContext[] {
    const cutoff = Date.now() - this.config.contextRetentionMs;
    return this.errorHistory
      .filter(error => error.agentId === agentId && error.timestamp.getTime() > cutoff)
      .slice(-5); // Last 5 errors
  }

  /**
   * Extract error pattern for analysis
   */
  private extractErrorPattern(error: Error): string {
    const message = error.message.toLowerCase();
    
    // Common error patterns
    if (message.includes('timeout')) return 'timeout-error';
    if (message.includes('validation')) return 'validation-error';
    if (message.includes('dependency')) return 'dependency-error';
    if (message.includes('circuit')) return 'circuit-breaker-error';
    if (message.includes('unknown')) return 'unknown-event-error';
    if (message.includes('context')) return 'context-error';
    
    return 'general-error';
  }

  /**
   * Analyze error pattern for recovery insights
   */
  private analyzeErrorPattern(pattern: string): string {
    const patternAnalysis: Record<string, string> = {
      'timeout-error': 'System overload or resource constraints',
      'validation-error': 'Data integrity or schema issues',
      'dependency-error': 'External service or resource unavailable',
      'circuit-breaker-error': 'System protection mechanism activated',
      'unknown-event-error': 'Event type not recognized by agent',
      'context-error': 'Context propagation or state management issue',
      'general-error': 'Unspecified system error'
    };

    return patternAnalysis[pattern] || 'Unknown error pattern';
  }

  /**
   * Calculate error severity
   */
  private calculateErrorSeverity(error: Error, context: Record<string, unknown>): ErrorContext['severity'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) return 'critical';
    if (message.includes('timeout') || message.includes('circuit')) return 'high';
    if (message.includes('validation') || message.includes('dependency')) return 'medium';
    
    return 'low';
  }

  /**
   * Generate unique loop ID
   */
  private generateLoopId(agentId: string, eventType: string, error: Error): string {
    const pattern = this.extractErrorPattern(error);
    return `${agentId}-${eventType}-${pattern}-${Date.now()}`;
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    // Mock implementation - in real system, track actual response times
    return 150; // ms
  }

  /**
   * Calculate resource usage
   */
  private calculateResourceUsage(): number {
    // Mock implementation - in real system, track actual resource usage
    return 0.65; // 65%
  }

  /**
   * Cleanup old data
   */
  private cleanupOldData(): void {
    const cutoff = Date.now() - this.config.contextRetentionMs;
    
    // Cleanup old loops
    for (const [id, loop] of this.activeLoops.entries()) {
      if (loop.lastIterationTime.getTime() < cutoff) {
        this.activeLoops.delete(id);
      }
    }

    // Cleanup old context cache
    for (const [key, context] of this.contextCache.entries()) {
      if (Date.now() - parseInt(key.split('-')[1]) > this.config.contextRetentionMs) {
        this.contextCache.delete(key);
      }
    }
  }

  /**
   * Get current system state
   */
  getSystemState(): {
    activeLoops: LoopContext[];
    agentStatuses: Map<string, AgentStatus>;
    circuitBreakers: Map<string, CircuitBreakerStatus>;
    systemHealth: SystemHealth;
  } {
    return {
      activeLoops: Array.from(this.activeLoops.values()),
      agentStatuses: this.agentStatuses,
      circuitBreakers: this.circuitBreakers,
      systemHealth: this.calculateSystemHealth()
    };
  }
} 