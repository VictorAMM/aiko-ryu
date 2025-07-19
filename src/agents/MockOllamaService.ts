/**
 * Mock Ollama Service for Testing
 * 
 * Provides realistic mock responses for Ollama API endpoints
 * to enable reliable testing without requiring a real Ollama instance.
 */

export interface MockOllamaResponse {
  response?: string;
  eval_count?: number;
  done?: boolean;
  model?: string;
  created_at?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
  context?: number[];
  timings?: {
    predicted_ms?: number;
    predicted_n?: number;
    predicted_per_second?: number;
    predicted_per_token_ms?: number;
  };
}

export interface MockOllamaModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
  details?: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface MockOllamaModelsResponse {
  models: MockOllamaModel[];
}

export class MockOllamaService {
  private static instance: MockOllamaService;
  private loadedModels: Set<string> = new Set();
  private mockResponses: Map<string, string> = new Map();
  private mockModels: MockOllamaModel[] = [
    {
      name: 'llama2',
      size: 4000000000,
      modified_at: '2024-01-01T00:00:00Z',
      digest: 'sha256:abc123',
      details: {
        format: 'gguf',
        family: 'llama',
        parameter_size: '7B',
        quantization_level: 'Q4_0'
      }
    },
    {
      name: 'mistral',
      size: 4500000000,
      modified_at: '2024-01-01T00:00:00Z',
      digest: 'sha256:def456',
      details: {
        format: 'gguf',
        family: 'mistral',
        parameter_size: '7B',
        quantization_level: 'Q4_0'
      }
    }
  ];

  constructor() {
    this.initializeMockResponses();
  }

  static getInstance(): MockOllamaService {
    if (!MockOllamaService.instance) {
      MockOllamaService.instance = new MockOllamaService();
    }
    return MockOllamaService.instance;
  }

  private initializeMockResponses(): void {
    // Initialize mock responses for different types of queries
    this.mockResponses.set('autonomous agents', 
      'Autonomous agents are AI systems that can operate independently and make decisions without human intervention. They are capable of perceiving their environment, reasoning about their goals, and taking actions to achieve those goals. In the context of the AikoRyu system, autonomous agents self-organize through declared dependencies and can orchestrate complex workflows.');
    
    this.mockResponses.set('ollama', 
      'Ollama is an open-source framework for running large language models locally. It provides a simple API for loading and running models like Llama 2, Mistral, and others. Ollama enables local inference without requiring cloud services, making it ideal for privacy-sensitive applications and offline development.');
    
    this.mockResponses.set('rag', 
      'Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with text generation. It works by first retrieving relevant documents or knowledge from a database, then using that information to generate more accurate and contextual responses. RAG improves the quality of AI responses by grounding them in factual information.');
    
    this.mockResponses.set('machine learning', 
      'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions. Common types include supervised learning, unsupervised learning, and reinforcement learning.');
    
    this.mockResponses.set('semantic search', 
      'Semantic search is a search technique that understands the context and meaning of search queries, rather than just matching keywords. It uses natural language processing and machine learning to understand user intent and return more relevant results. This is particularly useful for knowledge bases and document search systems.');
    
    this.mockResponses.set('aikoryu', 
      'The AikoRyu system is an autonomous agent orchestration platform that enables self-organizing systems through declared dependencies. It uses a distributed architecture where agents can discover each other, negotiate protocols, and coordinate complex workflows without central control. The system emphasizes resilience, observability, and emergent behavior.');
  }

  async generate(request: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: Record<string, unknown>;
  }): Promise<MockOllamaResponse> {
    // Simulate processing delay
    await this.simulateProcessingDelay();
    
    // Generate mock response based on prompt content
    const response = this.generateMockResponse(request.prompt);
    
    return {
      response,
      eval_count: Math.floor(Math.random() * 100) + 50,
      done: true,
      model: request.model,
      created_at: new Date().toISOString(),
      total_duration: Math.floor(Math.random() * 5000) + 1000,
      load_duration: Math.floor(Math.random() * 1000) + 100,
      prompt_eval_count: Math.floor(Math.random() * 20) + 10,
      prompt_eval_duration: Math.floor(Math.random() * 1000) + 100,
      eval_duration: Math.floor(Math.random() * 4000) + 500,
      context: [],
      timings: {
        predicted_ms: Math.floor(Math.random() * 4000) + 500,
        predicted_n: Math.floor(Math.random() * 100) + 50,
        predicted_per_second: Math.floor(Math.random() * 10) + 5,
        predicted_per_token_ms: Math.floor(Math.random() * 50) + 10
      }
    };
  }

  async listModels(): Promise<MockOllamaModelsResponse> {
    // Simulate API delay
    await this.simulateProcessingDelay();
    
    return {
      models: this.mockModels
    };
  }

  async pull(modelName: string): Promise<{ status: string; error?: string }> {
    // Simulate model download delay
    await this.simulateProcessingDelay(2000);
    
    // Check if model exists in our mock models
    const modelExists = this.mockModels.some(model => model.name === modelName);
    
    if (modelExists) {
      this.loadedModels.add(modelName);
      return { status: 'success' };
    } else {
      return { 
        status: 'error', 
        error: `Model '${modelName}' not found` 
      };
    }
  }

  async generateStream(request: {
    model: string;
    prompt: string;
    stream: boolean;
    options?: Record<string, unknown>;
  }): Promise<AsyncGenerator<MockOllamaResponse>> {
    const response = this.generateMockResponse(request.prompt);
    const words = response.split(' ');
    
    return (async function* () {
      for (let i = 0; i < words.length; i++) {
        await MockOllamaService.getInstance().simulateProcessingDelay(100);
        
        yield {
          response: words[i] + (i < words.length - 1 ? ' ' : ''),
          eval_count: i + 1,
          done: i === words.length - 1,
          model: request.model
        };
      }
    })();
  }

  private generateMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Find the best matching mock response
    for (const [key, response] of this.mockResponses) {
      if (lowerPrompt.includes(key)) {
        return response;
      }
    }
    
    // Generate a generic response if no specific match
    return `This is a mock response to: "${prompt}". In a real implementation, this would be generated by the actual language model. The response demonstrates how the system would handle various types of queries and provide relevant information based on the knowledge base.`;
  }

  private async simulateProcessingDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isModelLoaded(modelName: string): boolean {
    return this.loadedModels.has(modelName);
  }

  getLoadedModels(): string[] {
    return Array.from(this.loadedModels);
  }

  reset(): void {
    this.loadedModels.clear();
  }
}

// Global mock service instance
export const mockOllamaService = MockOllamaService.getInstance(); 