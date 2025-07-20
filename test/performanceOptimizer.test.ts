import { PerformanceOptimizer } from '../src/agents/PerformanceOptimizer';

describe('PerformanceOptimizer', () => {
  let performanceOptimizer: PerformanceOptimizer;

  beforeEach(() => {
    performanceOptimizer = new PerformanceOptimizer();
  });

  describe('Basic Properties', () => {
    it('should have correct id and role', () => {
      expect(performanceOptimizer.id).toBe('performance-optimizer');
      expect(performanceOptimizer.role).toBe('Performance Optimizer');
    });

    it('should have required dependencies', () => {
      expect(performanceOptimizer.dependencies).toContain('aiko');
      expect(performanceOptimizer.dependencies).toContain('ryu');
      expect(performanceOptimizer.dependencies).toContain('sarah');
    });
  });

  describe('Lifecycle', () => {
    it('should initialize successfully', async () => {
      await expect(performanceOptimizer.initialize()).resolves.not.toThrow();
    });

    it('should shutdown gracefully', async () => {
      await performanceOptimizer.initialize();
      await expect(performanceOptimizer.shutdown()).resolves.not.toThrow();
    });

    it('should return valid status', () => {
      const status = performanceOptimizer.getStatus();
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('uptime');
      expect(status.uptime).toBeGreaterThan(0);
    });
  });

  describe('Core Performance Optimization', () => {
    beforeEach(async () => {
      await performanceOptimizer.initialize();
    });

    it('should optimize memory usage', async () => {
      const result = await performanceOptimizer.optimizeMemoryUsage();
      
      expect(result.success).toBe(true);
      expect(result.memoryFreed).toBeGreaterThan(0);
      expect(['garbage-collection', 'memory-compression', 'cache-eviction']).toContain(result.optimizationType);
      expect(result.duration).toBeGreaterThan(0);
      expect(['low', 'medium', 'high']).toContain(result.impact);
    });

    it('should implement caching strategy', async () => {
      const strategy = {
        type: 'lru' as const,
        maxSize: 1000,
        ttl: 3600,
        compression: true,
        persistence: 'memory' as const
      };

      const result = await performanceOptimizer.implementCachingStrategy(strategy);
      
      expect(result.success).toBe(true);
      expect(result.cacheSize).toBeGreaterThanOrEqual(0);
      expect(result.hitRate).toBeGreaterThanOrEqual(0);
      expect(result.hitRate).toBeLessThanOrEqual(1);
      expect(result.evictionCount).toBeGreaterThanOrEqual(0);
      expect(result.compressionRatio).toBeGreaterThan(0);
    });

    it('should monitor performance metrics', async () => {
      const metrics = await performanceOptimizer.monitorPerformanceMetrics();
      
      expect(metrics.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.responseTime).toBeGreaterThanOrEqual(0);
      expect(metrics.throughput).toBeGreaterThanOrEqual(0);
      expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheHitRate).toBeLessThanOrEqual(1);
      expect(metrics.activeConnections).toBeGreaterThanOrEqual(0);
    });

    it('should optimize resource usage', async () => {
      const result = await performanceOptimizer.optimizeResourceUsage();
      
      expect(result.success).toBe(true);
      expect(typeof result.cpuOptimized).toBe('boolean');
      expect(typeof result.memoryOptimized).toBe('boolean');
      expect(typeof result.networkOptimized).toBe('boolean');
      expect(typeof result.diskOptimized).toBe('boolean');
      expect(Array.isArray(result.optimizations)).toBe(true);
    });
  });

  describe('Advanced Optimizations', () => {
    beforeEach(async () => {
      await performanceOptimizer.initialize();
    });

    it('should implement lazy loading', async () => {
      const result = await performanceOptimizer.implementLazyLoading();
      
      expect(result.success).toBe(true);
      expect(result.componentsLoaded).toBeGreaterThanOrEqual(0);
      expect(result.loadTimeReduced).toBeGreaterThanOrEqual(0);
      expect(result.memorySaved).toBeGreaterThanOrEqual(0);
    });

    it('should optimize event processing', async () => {
      const result = await performanceOptimizer.optimizeEventProcessing();
      
      expect(result.success).toBe(true);
      expect(result.eventsProcessed).toBeGreaterThanOrEqual(0);
      expect(result.processingTimeReduced).toBeGreaterThanOrEqual(0);
      expect(typeof result.queueSizeOptimized).toBe('boolean');
      expect(typeof result.batchingEnabled).toBe('boolean');
    });

    it('should implement connection pooling', async () => {
      const result = await performanceOptimizer.implementConnectionPooling();
      
      expect(result.success).toBe(true);
      expect(result.poolSize).toBeGreaterThan(0);
      expect(result.activeConnections).toBeGreaterThanOrEqual(0);
      expect(result.connectionReuseRate).toBeGreaterThanOrEqual(0);
      expect(result.connectionReuseRate).toBeLessThanOrEqual(1);
      expect(result.connectionTimeReduced).toBeGreaterThanOrEqual(0);
    });

    it('should optimize data structures', async () => {
      const result = await performanceOptimizer.optimizeDataStructures();
      
      expect(result.success).toBe(true);
      expect(result.structuresOptimized).toBeGreaterThanOrEqual(0);
      expect(result.memorySaved).toBeGreaterThanOrEqual(0);
      expect(result.accessTimeImproved).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.optimizations)).toBe(true);
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await performanceOptimizer.initialize();
    });

    it('should handle performance optimization events', async () => {
      await expect(performanceOptimizer.handleEvent('performance.optimize', {
        type: 'memory'
      })).resolves.not.toThrow();
    });

    it('should handle cache eviction events', async () => {
      await expect(performanceOptimizer.handleEvent('cache.evict', {
        pattern: 'old-*'
      })).resolves.not.toThrow();
    });

    it('should handle memory optimization events', async () => {
      await expect(performanceOptimizer.handleEvent('memory.optimize', {
        strategy: 'garbage-collection'
      })).resolves.not.toThrow();
    });

    it('should handle unknown events gracefully', async () => {
      await expect(performanceOptimizer.handleEvent('unknown.event', {})).resolves.not.toThrow();
    });
  });

  describe('DDD/SDD Compliance', () => {
    it('should validate specifications', () => {
      const spec = {
        id: 'test-spec',
        role: 'test-role',
        dependencies: [],
        capabilities: [{
          id: 'cap-1',
          name: 'optimization',
          description: 'Performance optimization capability',
          inputs: [],
          outputs: [],
          preconditions: [],
          postconditions: []
        }],
        interfaces: [],
        behaviors: [],
        constraints: [],
        designIntent: {
          purpose: 'test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [],
        validationRules: []
      };

      const result = performanceOptimizer.validateSpecification(spec);
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('consensus');
    });

    it('should generate design artifacts', () => {
      const artifacts = performanceOptimizer.generateDesignArtifacts();
      expect(Array.isArray(artifacts)).toBe(true);
    });

    it('should track user interactions', () => {
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'optimize',
        context: { type: 'performance' },
        timestamp: new Date(),
        outcome: 'success' as const
      };

      expect(() => performanceOptimizer.trackUserInteraction(interaction)).not.toThrow();
    });
  });
}); 