import { AikoAgent } from '../src/agents/AikoAgent';

describe('AikoAgent Tests', () => {
  it('should have correct role', () => {
    const agent = new AikoAgent('test-id');
    expect(agent.role).toBe('SemanticValidator');
  });
}); 