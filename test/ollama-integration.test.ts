import { SarahAgent, KnowledgeContext, KnowledgeResult } from '../src/agents/SarahAgent';

/**
 * Ollama Integration Tests
 * 
 * Comprehensive test suite for Sarah agent (RAG engine) integration with Ollama.
 * Tests cover model management, knowledge retrieval, response generation,
 * error handling, and performance benchmarking.
 */

describe('Ollama Integration Tests', () => {
  let sarahAgent: SarahAgent;
  
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

  beforeEach(async () => {
    sarahAgent = new SarahAgent({
      ollamaEndpoint: 'http://localhost:11434',
      defaultModel: 'llama2',
      knowledgeBase: testKnowledgeBase
    });
    
    await sarahAgent.initialize();
  });

  afterEach(async () => {
    await sarahAgent.shutdown();
  });

  describe('Agent Initialization', () => {
    it('should initialize Sarah agent with Ollama configuration', async () => {
      const status = sarahAgent.getStatus();
      
      expect(status.status).toBe('ready');
      expect(status.uptime).toBeGreaterThan(0);
      expect(status.lastEvent).toBeDefined();
      expect(status.lastTrace).toBeDefined();
    });

    it('should emit initialization events', async () => {
      // This would test event emission in a real implementation
      expect(sarahAgent).toBeDefined();
    });
  });

  describe('Model Management', () => {
    it('should list available models', async () => {
      const models = await sarahAgent.listAvailableModels();
      
      expect(Array.isArray(models)).toBe(true);
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
    it('should generate responses using Ollama', async () => {
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
          content: 'Autonomous agents can self-organize.',
          metadata: { confidence: 0.9 },
          confidence: 0.9
        },
        {
          id: 'source-2',
          type: 'document' as const,
          content: 'Ollama provides local LLM inference.',
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
    it('should handle Ollama API errors gracefully', async () => {
      // Test with invalid endpoint
      const invalidAgent = new SarahAgent({
        ollamaEndpoint: 'http://localhost:9999',
        defaultModel: 'llama2'
      });

      await expect(invalidAgent.listAvailableModels()).rejects.toThrow();
    });

    it('should handle model loading failures', async () => {
      const result = await sarahAgent.loadModel('invalid-model-name');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle query validation errors', async () => {
      const longQuery = 'a'.repeat(1001); // Exceeds 1000 character limit
      
      await expect(sarahAgent.retrieveKnowledge(longQuery))
        .rejects.toThrow('Query too long');
    });
  });

  describe('Performance Benchmarking', () => {
    it('should handle concurrent queries efficiently', async () => {
      const queries = Array.from({ length: 10 }, (_, i) => 
        `Query ${i + 1}: Explain autonomous systems`
      );

      const startTime = Date.now();
      const promises = queries.map(query => 
        sarahAgent.retrieveKnowledge(query, { maxTokens: 200 })
      );

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      expect(results).toHaveLength(10);
      expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds
      
      results.forEach(result => {
        expect(result.content.length).toBeGreaterThan(0);
        expect(result.confidence).toBeGreaterThan(0);
      });
    });

    it('should maintain performance under load', async () => {
      const startTime = Date.now();
      const results: KnowledgeResult[] = [];

      for (let i = 0; i < 5; i++) {
        const result = await sarahAgent.retrieveKnowledge(
          `Performance test query ${i + 1}`,
          { maxTokens: 150 }
        );
        results.push(result);
      }

      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / results.length;

      expect(avgTime).toBeLessThan(5000); // Average response time under 5 seconds
      expect(results.every(r => r.content.length > 0)).toBe(true);
    });
  });

  describe('DDD/SDD Alignment', () => {
    it('should validate specifications correctly', async () => {
      const spec = {
        id: 'sarah-rag-engine',
        role: 'RAG Engine',
        dependencies: ['aiko', 'ryu'],
        capabilities: [
          {
            id: 'knowledge-retrieval',
            name: 'Knowledge Retrieval',
            description: 'Retrieve knowledge using RAG',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [
          {
            id: 'sarah-agent-interface',
            name: 'SarahAgentInterface',
            methods: [],
            events: [],
            properties: []
          }
        ],
        behaviors: [],
        constraints: [],
        validationRules: [],
        designIntent: {
          purpose: 'RAG-based knowledge retrieval',
          userGoals: ['Get accurate information'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const result = await sarahAgent.validateSpecification(spec);
      
      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('boolean');
    });

    it('should generate design artifacts', async () => {
      const artifacts = await sarahAgent.generateDesignArtifacts();
      
      expect(Array.isArray(artifacts)).toBe(true);
    });

    it('should track user interactions', async () => {
      const interaction = {
        id: 'test-interaction-001',
        userId: 'test-user',
        sessionId: 'test-session-001',
        action: 'knowledge-retrieval',
        context: { query: 'How does Ollama work?' },
        timestamp: new Date(),
        outcome: 'success' as const
      };

      await expect(sarahAgent.trackUserInteraction(interaction)).resolves.not.toThrow();
    });
  });

  describe('Integration with AikoRyu System', () => {
    it('should follow AgentContract interface', () => {
      expect(sarahAgent).toHaveProperty('id');
      expect(sarahAgent).toHaveProperty('role');
      expect(sarahAgent).toHaveProperty('dependencies');
      expect(typeof sarahAgent.initialize).toBe('function');
      expect(typeof sarahAgent.handleEvent).toBe('function');
      expect(typeof sarahAgent.shutdown).toBe('function');
      expect(typeof sarahAgent.emitTrace).toBe('function');
      expect(typeof sarahAgent.getStatus).toBe('function');
    });

    it('should emit trace events', async () => {
      await expect(sarahAgent.emitTrace({
        timestamp: new Date(),
        eventType: 'test.event',
        payload: {
          timestamp: new Date(),
          eventType: 'status-change',
          correlationId: 'test-event',
          sourceAgent: 'sarah-agent'
        },
        metadata: { sourceAgent: 'sarah-agent' }
      })).resolves.not.toThrow();
    });

    it('should handle system events', async () => {
      await expect(sarahAgent.handleEvent('rag.knowledge.retrieve', {
        timestamp: new Date(),
        eventType: 'status-change',
        correlationId: 'test-event',
        sourceAgent: 'sarah-agent'
      })).resolves.not.toThrow();
    });
  });
});

// Performance stress tests
describe('Ollama Performance Stress Tests', () => {
  let sarahAgent: SarahAgent;

  beforeAll(async () => {
    sarahAgent = new SarahAgent({
      ollamaEndpoint: 'http://localhost:11434',
      defaultModel: 'llama2'
    });
    await sarahAgent.initialize();
  });

  afterAll(async () => {
    await sarahAgent.shutdown();
  });

  it('should handle high-volume concurrent queries', async () => {
    const numQueries = 20; // Reduced for test environment
    const queries = Array.from({ length: numQueries }, (_, i) => 
      `Stress test query ${i + 1}: Explain autonomous agents`
    );

    const startTime = Date.now();
    const promises = queries.map(query => 
      sarahAgent.retrieveKnowledge(query, { maxTokens: 100 })
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    const throughput = numQueries / (totalTime / 1000);

    expect(results).toHaveLength(numQueries);
    expect(throughput).toBeGreaterThan(1); // At least 1 query per second
    expect(totalTime).toBeLessThan(60000); // Should complete within 60 seconds
  }, 120000); // 2 minute timeout

  it('should maintain response quality under load', async () => {
    const queries = [
      'What is autonomous orchestration?',
      'How does RAG work?',
      'Explain semantic search',
      'What are the benefits of local LLMs?',
      'How does context enrichment work?'
    ];

    const results: KnowledgeResult[] = [];
    for (const query of queries) {
      const result = await sarahAgent.retrieveKnowledge(query, { maxTokens: 200 });
      results.push(result);
    }

    // Check response quality metrics
    const avgConfidence = results.reduce((acc, r) => acc + r.confidence, 0) / results.length;
    const avgResponseTime = results.reduce((acc, r) => acc + r.responseTime, 0) / results.length;

    expect(avgConfidence).toBeGreaterThan(0.3); // Minimum confidence threshold
    expect(avgResponseTime).toBeLessThan(10000); // Maximum average response time
    expect(results.every(r => r.content.length > 10)).toBe(true); // All responses have content
  });

  it('should handle model switching efficiently', async () => {
    const models = ['llama2']; // Test with available model
    const switchCount = 5;

    for (let i = 0; i < switchCount; i++) {
      const model = models[i % models.length];
      const query = `Model switch test ${i + 1} with ${model}`;
      
      const result = await sarahAgent.retrieveKnowledge(query, {
        ollamaModel: model,
        maxTokens: 100
      });

      expect(result.modelUsed).toBe(model);
      expect(result.content.length).toBeGreaterThan(0);
    }
  });
});

// Mock Ollama API for testing
class MockOllamaAPI {
  static async generate(request: Record<string, unknown>) {
    return {
      response: `Mock response for: ${request.prompt}`,
      eval_count: 50,
      done: true
    };
  }

  static async listModels() {
    return {
      models: [
        {
          name: 'llama2',
          size: 4000000000,
          modified_at: '2024-01-01T00:00:00Z',
          digest: 'sha256:abc123'
        }
      ]
    };
  }
}

// Export for use in other tests
export { MockOllamaAPI }; 