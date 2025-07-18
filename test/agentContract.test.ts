// test/agentContract.test.ts
import { AgentContract, SystemEventPayload } from '../src/agents/AgentContract';
import { AikoAgent } from '../src/agents/AikoAgent';

describe('AgentContract', () => {
  let agent: AgentContract;
  
  beforeEach(() => {
    agent = new AikoAgent('test-agent');
  });
  
  it('should have required properties', () => {
    expect(agent.id).toBeDefined();
    expect(agent.role).toBeDefined();
    expect(agent.dependencies).toBeDefined();
  });
  
  describe('initialize()', () => {
    it('should transition to ready state', async () => {
      await agent.initialize();
      const status = agent.getStatus();
      expect(status.status).toBe('ready');
      expect(status.uptime).toBeGreaterThan(0);
    });
  });
  
  describe('handleEvent()', () => {
    it('should process events without error', async () => {
      await agent.initialize();
      await expect(agent.handleEvent('test.event', {
        timestamp: new Date(),
        correlationId: 'test-event',
        sourceAgent: agent.id
      } as SystemEventPayload)).resolves.not.toThrow();
    });
  });
  
  describe('shutdown()', () => {
    it('should transition to shutting-down state', async () => {
      await agent.initialize();
      await agent.shutdown();
      const status = agent.getStatus();
      expect(status.status).toBe('shutting-down');
    });
  });
  
  describe('getStatus()', () => {
    it('should return valid status object', () => {
      const status = agent.getStatus();
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('uptime');
    });
  });
}); 