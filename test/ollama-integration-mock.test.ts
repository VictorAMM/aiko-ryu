/**
 * Ollama Integration Tests with Mock Service
 * 
 * Comprehensive test suite for Sarah agent (RAG engine) using mock Ollama service.
 * These tests can run in CI/CD without requiring a running Ollama server.
 */

import { SarahAgent, KnowledgeContext, KnowledgeResult } from '../src/agents/SarahAgent';
import { MockOllamaService } from '../src/agents/MockOllamaService';

// Mock fetch globally for the tests
global.fetch = jest.fn();

const testKnowledgeBase = [
  {
    id: 'doc-1',
    content: 'The AikoRyu system uses autonomous agents that self-organize through declared dependencies.',
    metadata: {
      title: 'AikoRyu Architecture',
      tags: ['architecture', 'agents'],
      confidence: 0.9
    }
  },
  {
    id: 'doc-2',
    content: 'Ollama provides local LLM inference with support for multiple models including Llama 2 and Mistral.',
    metadata: {
      title: 'Ollama Integration',
      tags: ['ollama', 'llm'],
      confidence: 0.85
    }
  }
];

describe('Ollama Integration Tests (Mock)', () => {
  let sarahAgent: SarahAgent;
  let mockOllamaService: MockOllamaService;

  beforeEach(async () => {
    // Create mock Ollama service
    mockOllamaService = new MockOllamaService({
      enableMocking: true,
      responseDelay: 50, // Fast responses for tests
      failureRate: 0.0, // No failures for reliable tests
      availableModels: ['llama2', 'mistral', 'codellama'],
      defaultModel: 'llama2'
    });

    // Mock the fetch function to use our mock service
    (global.fetch as jest.Mock).mockImplementation(async (url: string, options: Record<string, unknown>) => {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      
      if (url.includes('/api/generate')) {
        const result = await mockOllamaService.generate(body);
        return {
          ok: !('error' in result),
          status: 'error' in result ? 404 : 200,
          statusText: 'error' in result ? 'Not Found' : 'OK',
          json: async () => result,
          text: async () => JSON.stringify(result)
        };
      } else if (url.includes('/api/tags')) {
        const result = await mockOllamaService.listModels();
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => result,
          text: async () => JSON.stringify(result)
        };
      } else if (url.includes('/api/pull')) {
        const result = await mockOllamaService.loadModel(body.name);
        return {
          ok: !('error' in result),
          status: 'error' in result ? 500 : 200,
          statusText: 'error' in result ? 'Internal Server Error' : 'OK',
          json: async () => result,
          text: async () => JSON.stringify({ status: 'success', model: body.name })
        };
      } else if (url.includes('/api/unload')) {
        const result = await mockOllamaService.unloadModel(body.name);
        return {
          ok: !('error' in result),
          status: 'error' in result ? 500 : 200,
          statusText: 'error' in result ? 'Internal Server Error' : 'OK',
          json: async () => result,
          text: async () => JSON.stringify(result)
        };
      }
      
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Endpoint not found' }),
        text: async () => JSON.stringify({ error: 'Endpoint not found' })
      };
    });

    sarahAgent = new SarahAgent({
      ollamaEndpoint: 'http://localhost:11434',
      defaultModel: 'llama2',
      knowledgeBase: testKnowledgeBase
    });
    
    await sarahAgent.initialize();
  });

  afterEach(async () => {
    await sarahAgent.shutdown();
    mockOllamaService.reset();
    jest.clearAllMocks();
  });

  describe('Agent Initialization', () => {
    it('should initialize Sarah agent with mock Ollama configuration', async () => {
      const status = sarahAgent.getStatus();
      
      expect(status.status).toBe('ready');
      expect(status.uptime).toBeGreaterThan(0);
      expect(status.lastEvent).toBeDefined();
      expect(status.lastTrace).toBeDefined();
    });

    it('should emit initialization events', async () => {
      expect(sarahAgent).toBeDefined();
      expect(mockOllamaService.getStats().callCount).toBeGreaterThan(0);
    });
  });

  describe('Model Management', () => {
    it('should list available models', async () => {
      const models = await sarahAgent.listAvailableModels();
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      models.forEach(model => {
        expect(model).toHaveProperty('name');
        expect(model).toHaveProperty('size');
        expect(model).toHaveProperty('modifiedAt');
        expect(model).toHaveProperty('digest');
      });
    });

    it('should load model successfully', async () => {
      const result = await sarahAgent.loadModel('llama2');
      
      expect(result.success).toBe(true);
      expect(result.modelName).toBe('llama2');
      expect(result.loadTime).toBeGreaterThan(0);
    });

    it('should handle model loading failure gracefully', async () => {
      // Mock fetch to simulate failure for this specific test
      (global.fetch as jest.Mock).mockImplementationOnce(async (_url: string, _options: Record<string, unknown>) => {
        return {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({ error: 'Model not found' }),
          text: async () => JSON.stringify({ error: 'Model not found' })
        };
      });

      const result = await sarahAgent.loadModel('non-existent-model');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should unload model successfully', async () => {
      const result = await sarahAgent.unloadModel('test-model');
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Knowledge Retrieval', () => {
    it('should retrieve knowledge with semantic search', async () => {
      const query = 'How does the AikoRyu system work?';
      const context: KnowledgeContext = {
        confidenceThreshold: 0.7,
        maxTokens: 500,
        temperature: 0.7
      };

      const result = await sarahAgent.retrieveKnowledge(query, context);
      
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('sources');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('modelUsed');
      expect(result).toHaveProperty('tokensUsed');
      expect(result).toHaveProperty('responseTime');
      expect(result).toHaveProperty('metadata');
      
      expect(typeof result.content).toBe('string');
      expect(result.content.length).toBeGreaterThan(0);
      expect(Array.isArray(result.sources)).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle empty query validation', async () => {
      await expect(sarahAgent.retrieveKnowledge('')).rejects.toThrow('Query cannot be empty');
    });

    it('should handle invalid confidence threshold', async () => {
      const context: KnowledgeContext = {
        confidenceThreshold: 1.5
      };

      await expect(sarahAgent.retrieveKnowledge('test query', context))
        .rejects.toThrow('Confidence threshold must be between 0 and 1');
    });

    it('should perform semantic search on knowledge base', async () => {
      const query = 'autonomous agents';
      const documents = testKnowledgeBase;
      
      const results = await sarahAgent.semanticSearch(query, documents);
      
      expect(Array.isArray(results)).toBe(true);
      results.forEach(result => {
        expect(result).toHaveProperty('document');
        expect(result).toHaveProperty('relevance');
        expect(result).toHaveProperty('snippet');
        expect(result).toHaveProperty('metadata');
        expect(result.relevance).toBeGreaterThan(0);
        expect(result.relevance).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Response Generation', () => {
    it('should generate responses using mock Ollama', async () => {
      const prompt = 'Explain the benefits of autonomous agents';
      const context: KnowledgeContext = {
        temperature: 0.7,
        maxTokens: 300
      };

      const response = await sarahAgent.generateResponse(prompt, context);
      
      expect(response).toHaveProperty('text');
      expect(response).toHaveProperty('confidence');
      expect(response).toHaveProperty('model');
      expect(response).toHaveProperty('tokens');
      expect(response).toHaveProperty('latency');
      expect(response).toHaveProperty('context');
      
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(0);
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
      expect(response.latency).toBeGreaterThan(0);
    });

    it('should handle response generation with different models', async () => {
      const prompt = 'What is machine learning?';
      const context: KnowledgeContext = {
        ollamaModel: 'llama2',
        temperature: 0.6
      };

      const response = await sarahAgent.generateResponse(prompt, context);
      
      expect(response.model).toBe('llama2');
      expect(response.text.length).toBeGreaterThan(0);
    });
  });

  describe('Context Enrichment', () => {
    it('should enrich context with additional data', async () => {
      const context: KnowledgeContext = {
        userId: 'test-user',
        domain: 'ai-integration',
        confidenceThreshold: 0.8
      };

      const enriched = await sarahAgent.contextEnrichment(context);
      
      expect(enriched).toHaveProperty('originalContext');
      expect(enriched).toHaveProperty('enrichedData');
      expect(enriched).toHaveProperty('confidence');
      expect(enriched).toHaveProperty('sources');
      
      expect(enriched.originalContext).toEqual(context);
      expect(enriched.confidence).toBeGreaterThanOrEqual(0);
      expect(enriched.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Knowledge Synthesis', () => {
    it('should synthesize knowledge from multiple sources', async () => {
      const sources = [
        {
          id: 'source-1',
          type: 'document' as const,
          content: 'AikoRyu uses autonomous agents for orchestration.',
          metadata: { confidence: 0.9 },
          confidence: 0.9
        },
        {
          id: 'source-2',
          type: 'ollama' as const,
          content: 'Ollama provides local LLM inference capabilities.',
          metadata: { confidence: 0.85 },
          confidence: 0.85
        }
      ];

      const synthesis = await sarahAgent.knowledgeSynthesis(sources);
      
      expect(synthesis).toHaveProperty('summary');
      expect(synthesis).toHaveProperty('keyInsights');
      expect(synthesis).toHaveProperty('confidence');
      expect(synthesis).toHaveProperty('sources');
      expect(synthesis).toHaveProperty('recommendations');
      
      expect(typeof synthesis.summary).toBe('string');
      expect(Array.isArray(synthesis.keyInsights)).toBe(true);
      expect(synthesis.confidence).toBeGreaterThanOrEqual(0);
      expect(synthesis.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(synthesis.recommendations)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle model loading failures', async () => {
      // Configure mock to simulate failure
      mockOllamaService = new MockOllamaService({
        enableMocking: true,
        failureRate: 1.0 // Always fail
      });

      const result = await sarahAgent.loadModel('invalid-model-name');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle API connection errors gracefully', async () => {
      // Mock fetch to simulate network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(sarahAgent.loadModel('test-model')).rejects.toThrow('Network error');
    });
  });

  describe('Performance Benchmarking', () => {
    it('should handle concurrent queries efficiently', async () => {
      const queries = Array.from({ length: 5 }, (_, i) =>
        `Query ${i + 1}: Explain autonomous systems`
      );

      const startTime = Date.now();
      const results = await Promise.all(
        queries.map(query => sarahAgent.retrieveKnowledge(query))
      );
      const endTime = Date.now();

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.content.length).toBeGreaterThan(0);
        expect(result.confidence).toBeGreaterThan(0);
      });

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds
    });

    it('should maintain performance under load', async () => {
      const startTime = Date.now();
      const results: KnowledgeResult[] = [];

      for (let i = 0; i < 10; i++) {
        const result = await sarahAgent.retrieveKnowledge(`Load test query ${i}`);
        results.push(result);
      }

      const endTime = Date.now();
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

      expect(results).toHaveLength(10);
      expect(avgResponseTime).toBeLessThan(5000); // Average response time under 5 seconds
      expect(endTime - startTime).toBeLessThan(30000); // Total time under 30 seconds
    });
  });

  describe('DDD/SDD Alignment', () => {
    it('should track user interactions', async () => {
      const interaction = {
        id: 'test-interaction-1',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'knowledge-query',
        query: 'How does AikoRyu work?',
        timestamp: new Date(),
        context: { confidenceThreshold: 0.8 },
        outcome: 'success' as const,
        metadata: { sessionId: 'test-session' }
      };

      expect(() => sarahAgent.trackUserInteraction(interaction)).not.toThrow();
    });

    it('should emit trace events', async () => {
      const event = {
        timestamp: new Date(),
        eventType: 'test.event',
        correlationId: 'test-event',
        sourceAgent: 'sarah-agent',
        payload: {
          test: 'data'
        },
        metadata: { sourceAgent: 'sarah-agent' }
      };

      expect(() => sarahAgent.emitTrace(event)).not.toThrow();
    });

    it('should handle system events', async () => {
      await expect(sarahAgent.handleEvent('rag.knowledge.retrieve', {
        timestamp: new Date(),
        eventType: 'status-change',
        correlationId: 'test-event',
        sourceAgent: 'sarah-agent',
        payload: {
          query: 'test query',
          context: { confidenceThreshold: 0.8 }
        },
        metadata: { sourceAgent: 'sarah-agent' }
      })).resolves.toBeUndefined();
    });
  });

  describe('Mock Service Statistics', () => {
    it('should track mock service usage', async () => {
      const initialStats = mockOllamaService.getStats();
      
      await sarahAgent.retrieveKnowledge('Test query');
      
      const finalStats = mockOllamaService.getStats();
      
      expect(finalStats.callCount).toBeGreaterThan(initialStats.callCount);
      expect(finalStats.successRate).toBeGreaterThan(0.8); // High success rate
    });

    it('should reset mock service state', async () => {
      await sarahAgent.retrieveKnowledge('Test query');
      
      const statsBeforeReset = mockOllamaService.getStats();
      expect(statsBeforeReset.callCount).toBeGreaterThan(0);
      
      mockOllamaService.reset();
      
      const statsAfterReset = mockOllamaService.getStats();
      expect(statsAfterReset.callCount).toBe(0);
      expect(statsAfterReset.failureCount).toBe(0);
    });
  });
});

// Performance stress tests with mock service
describe('Ollama Performance Stress Tests (Mock)', () => {
  let sarahAgent: SarahAgent;
  let mockOllamaService: MockOllamaService;

  beforeEach(async () => {
    mockOllamaService = new MockOllamaService({
      enableMocking: true,
      responseDelay: 10, // Very fast for stress tests
      failureRate: 0.0
    });

    // Mock fetch for stress tests
    (global.fetch as jest.Mock).mockImplementation(async (url: string, options: Record<string, unknown>) => {
      const body = options.body ? JSON.parse(options.body as string) : {};
      
      if (url.includes('/api/generate')) {
        const result = await mockOllamaService.generate(body);
        return {
          ok: !('error' in result),
          status: 'error' in result ? 404 : 200,
          json: async () => result,
          text: async () => JSON.stringify(result)
        };
      } else if (url.includes('/api/tags')) {
        const result = await mockOllamaService.listModels();
        return {
          ok: true,
          status: 200,
          json: async () => result,
          text: async () => JSON.stringify(result)
        };
      } else if (url.includes('/api/pull')) {
        const result = await mockOllamaService.loadModel(body.name);
        return {
          ok: !('error' in result),
          status: 'error' in result ? 500 : 200,
          json: async () => result,
          text: async () => JSON.stringify({ status: 'success', model: body.name })
        };
      } else if (url.includes('/api/unload')) {
        const result = await mockOllamaService.unloadModel(body.name);
        return {
          ok: !('error' in result),
          status: 'error' in result ? 500 : 200,
          json: async () => result,
          text: async () => JSON.stringify(result)
        };
      }
      
      return {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Endpoint not found' }),
        text: async () => JSON.stringify({ error: 'Endpoint not found' })
      };
    });

    sarahAgent = new SarahAgent({
      ollamaEndpoint: 'http://localhost:11434',
      defaultModel: 'llama2',
      knowledgeBase: testKnowledgeBase
    });
    
    await sarahAgent.initialize();
  });

  afterEach(async () => {
    await sarahAgent.shutdown();
    mockOllamaService.reset();
    jest.clearAllMocks();
  });

  it('should handle high-volume concurrent queries', async () => {
    const numQueries = 20;
    const queries = Array.from({ length: numQueries }, (_, i) =>
      `Stress test query ${i + 1}: Explain autonomous agents`
    );

    const startTime = Date.now();
    const results = await Promise.all(
      queries.map(query => sarahAgent.retrieveKnowledge(query))
    );
    const endTime = Date.now();

    expect(results).toHaveLength(numQueries);
    results.forEach(result => {
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    // Should complete within reasonable time
    expect(endTime - startTime).toBeLessThan(15000); // 15 seconds
  }, 30000); // 30 second timeout

  it('should maintain response quality under load', async () => {
    const queries = [
      'What is autonomous orchestration?',
      'How does RAG work?',
      'Explain machine learning',
      'What is Ollama?',
      'How do agents communicate?'
    ];

    const results = await Promise.all(
      queries.map(query => sarahAgent.retrieveKnowledge(query))
    );

    results.forEach(result => {
      expect(result.content.length).toBeGreaterThan(50); // Minimum content length
      expect(result.confidence).toBeGreaterThan(0.3); // Minimum confidence
      expect(result.sources.length).toBeGreaterThan(0); // Should have sources
    });
  }, 10000);

  it('should handle model switching efficiently', async () => {
    const models = ['llama2', 'mistral'];
    const switchCount = 5;

    for (let i = 0; i < switchCount; i++) {
      const model = models[i % models.length];
      const result = await sarahAgent.loadModel(model);
      expect(result.success).toBe(true);
      
      const response = await sarahAgent.generateResponse('Test query', { ollamaModel: model });
      expect(response.model).toBe(model);
    }
  }, 10000);
}); 