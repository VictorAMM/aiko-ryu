/**
 * Mock Ollama Test Setup
 * 
 * Provides utilities to intercept fetch calls and use the mock Ollama service
 * for reliable testing without requiring a real Ollama instance.
 */

import { mockOllamaService, MockOllamaResponse, MockOllamaModelsResponse } from '../src/agents/MockOllamaService';

// Store original fetch
const originalFetch = global.fetch;

export class MockFetchResponse extends Response {
  constructor(
    ok: boolean,
    status: number,
    statusText: string,
    private responseBody: any
  ) {
    super(JSON.stringify(responseBody), {
      status,
      statusText,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async json(): Promise<any> {
    return this.responseBody;
  }

  async text(): Promise<string> {
    return JSON.stringify(this.responseBody);
  }
}

export function setupMockOllama(): void {
  // Reset mock service state
  mockOllamaService.reset();

  // Override global fetch
  global.fetch = async (input: RequestInfo | URL, options?: RequestInit): Promise<MockFetchResponse> => {
    const url = typeof input === 'string' ? input : input.toString();
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const method = options?.method || 'GET';

    try {
      // Handle different Ollama API endpoints
      if (path === '/api/generate' && method === 'POST') {
        const body = JSON.parse(options?.body as string);
        const response = await mockOllamaService.generate({
          model: body.model,
          prompt: body.prompt,
          stream: body.stream || false,
          options: body.options
        });
        
        return new MockFetchResponse(true, 200, 'OK', response);
      }

      if (path === '/api/tags' && method === 'GET') {
        const response = await mockOllamaService.listModels();
        return new MockFetchResponse(true, 200, 'OK', response);
      }

      if (path === '/api/pull' && method === 'POST') {
        const body = JSON.parse(options?.body as string);
        const response = await mockOllamaService.pull(body.name);
        
        if (response.status === 'success') {
          return new MockFetchResponse(true, 200, 'OK', response);
        } else {
          return new MockFetchResponse(false, 404, 'Not Found', response);
        }
      }

      // Handle unknown endpoints
      return new MockFetchResponse(false, 404, 'Not Found', { error: 'Endpoint not found' });
    } catch (error) {
      return new MockFetchResponse(false, 500, 'Internal Server Error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };
}

export function teardownMockOllama(): void {
  // Restore original fetch
  global.fetch = originalFetch;
  
  // Reset mock service
  mockOllamaService.reset();
}

export function getMockOllamaService() {
  return mockOllamaService;
}

// Jest setup and teardown helpers
export const mockOllamaSetup = {
  beforeAll: () => {
    setupMockOllama();
  },
  afterAll: () => {
    teardownMockOllama();
  },
  beforeEach: () => {
    mockOllamaService.reset();
  }
}; 