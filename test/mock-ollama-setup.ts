/**
 * Mock Ollama Setup for Testing
 * 
 * Provides mock implementations for Ollama API calls during testing
 */

// Mock fetch globally for the tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
(global as any).fetch = jest.fn();

// Mock service state
let mockServiceState: {
  isInitialized: boolean;
  currentModel: string | null;
  models: string[];
} = {
  isInitialized: false,
  currentModel: null,
  models: []
};

// Export functions for test setup/teardown
export const setupMockOllama = () => {
  mockServiceState = {
    isInitialized: true,
    currentModel: null,
    models: ['llama2', 'mistral']
  };
};

export const teardownMockOllama = () => {
  mockServiceState = {
    isInitialized: false,
    currentModel: null,
    models: []
  };
};

export const getMockOllamaService = () => ({
  reset: () => {
    mockServiceState = {
      isInitialized: false,
      currentModel: null,
      models: []
    };
  },
  getState: () => mockServiceState
});

// Mock fetch implementation for Ollama API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
((global as any).fetch as jest.Mock).mockImplementation(async (url: string, options?: any) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock different Ollama endpoints
  if (url.includes('/api/generate')) {
    const body = JSON.parse(options.body);
    
    return {
      ok: true,
      status: 200,
      json: async () => ({
        response: `Mock response for: ${body.prompt}`,
        eval_count: Math.floor(Math.random() * 100) + 50,
        done: true,
        model: body.model,
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
      })
    };
  }
  
  if (url.includes('/api/tags')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        models: [
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
        ]
      })
    };
  }
  
  // Default response for unknown endpoints
  return {
    ok: false,
    status: 404,
    json: async () => ({ error: 'Not found' })
  };
}); 