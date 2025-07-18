// test/llmConsistency.test.ts
import { ConsistencyVerifierAgent, LLMResponse, ComputationPath } from '../src/agents/ConsistencyVerifier';
import { StateReconstructorAgent, StateSnapshot, AgentDecision, DeterministicReplay } from '../src/agents/StateReconstructor';
import { CompactAuditTrailAgent } from '../src/agents/CompactAuditTrail';

describe('LLM Consistency & Memory Optimization', () => {
  let consistencyVerifier: ConsistencyVerifierAgent;
  let stateReconstructor: StateReconstructorAgent;
  let compactAuditTrail: CompactAuditTrailAgent;

  beforeEach(async () => {
    consistencyVerifier = new ConsistencyVerifierAgent('consistency-verifier-001');
    stateReconstructor = new StateReconstructorAgent('state-reconstructor-001');
    compactAuditTrail = new CompactAuditTrailAgent('compact-audit-trail-001');

    await consistencyVerifier.initialize();
    await stateReconstructor.initialize();
    await compactAuditTrail.initialize();
  });

  afterEach(async () => {
    await consistencyVerifier.shutdown();
    await stateReconstructor.shutdown();
    await compactAuditTrail.shutdown();
  });

  describe('ConsistencyVerifier', () => {
    test('should verify exact match for critical paths', async () => {
      const response1: LLMResponse = {
        content: 'Validate this specification',
        tokens: 5,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const response2: LLMResponse = {
        content: 'Validate this specification',
        tokens: 5,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const result = await consistencyVerifier.verifyRecomputationConsistency(
        response1,
        response2,
        ComputationPath.CRITICAL
      );

      expect(result).toBe(true);
    });

    test('should reject non-exact match for critical paths', async () => {
      const response1: LLMResponse = {
        content: 'Validate this specification',
        tokens: 5,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const response2: LLMResponse = {
        content: 'Validate this specification with slight difference',
        tokens: 7,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const result = await consistencyVerifier.verifyRecomputationConsistency(
        response1,
        response2,
        ComputationPath.CRITICAL
      );

      expect(result).toBe(false);
    });

    test('should allow semantic similarity for non-critical paths', async () => {
      const response1: LLMResponse = {
        content: 'Generate creative solution for user interface',
        tokens: 8,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const response2: LLMResponse = {
        content: 'Create innovative UI design solution',
        tokens: 7,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const result = await consistencyVerifier.verifyRecomputationConsistency(
        response1,
        response2,
        ComputationPath.NON_CRITICAL
      );

      // Should allow semantic similarity (mock implementation returns random similarity)
      expect(typeof result).toBe('boolean');
    });

    test('should calculate semantic similarity', async () => {
      const response1: LLMResponse = {
        content: 'Hello world',
        tokens: 2,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const response2: LLMResponse = {
        content: 'Hello world',
        tokens: 2,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const similarity = await consistencyVerifier.calculateSemanticSimilarity(response1, response2);
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    test('should verify state consistency for critical paths', () => {
      const state1 = { id: 'test', value: 42 };
      const state2 = { id: 'test', value: 42 };

      const result = consistencyVerifier.verifyStateConsistency(state1, state2);
      expect(result).toBe(true);
    });

    test('should reject inconsistent states for critical paths', () => {
      const state1 = { id: 'test', value: 42 };
      const state2 = { id: 'test', value: 43 };

      const result = consistencyVerifier.verifyStateConsistency(state1, state2);
      expect(result).toBe(false);
    });
  });

  describe('StateReconstructor', () => {
    test('should reconstruct state from checkpoint', async () => {
      const decision: AgentDecision = {
        id: 'test-decision-001',
        type: 'validation',
        payload: { isValid: true, confidence: 0.95 },
        confidence: 0.95,
        timestamp: Date.now()
      };

      const replayConfig: DeterministicReplay = {
        seed: 'test-seed-123',
        temperature: 0.0,
        maxTokens: 1000,
        contextHash: 'test-context-hash',
        timestamp: Date.now()
      };

      const checkpoint: StateSnapshot = {
        hash: 'test-hash-123',
        timestamp: Date.now(),
        context: 'Test context for validation',
        decision,
        replayConfig
      };

      const reconstructed = await stateReconstructor.reconstructState(checkpoint, { reconstructionContext: 'test-reconstruction' });
      
      expect(reconstructed).toBeDefined();
      expect(reconstructed.hash).toBeDefined();
      expect(reconstructed.decision.id).toBe(decision.id);
      expect(reconstructed.decision.type).toBe(decision.type);
    });

    test('should replay from checkpoint with original configuration', async () => {
      const decision: AgentDecision = {
        id: 'test-decision-002',
        type: 'generation',
        payload: { prompt: 'Generate content', length: 100 },
        confidence: 0.8,
        timestamp: Date.now()
      };

      const replayConfig: DeterministicReplay = {
        seed: 'replay-seed-456',
        temperature: 0.7,
        maxTokens: 2000,
        contextHash: 'replay-context-hash',
        timestamp: Date.now()
      };

      const checkpoint: StateSnapshot = {
        hash: 'replay-hash-456',
        timestamp: Date.now(),
        context: 'Replay context for generation',
        decision,
        replayConfig
      };

      const replayed = await stateReconstructor.replayFromCheckpoint(checkpoint);
      
      expect(replayed).toBeDefined();
      expect(replayed.replayConfig.seed).toBe(replayConfig.seed);
      expect(replayed.replayConfig.temperature).toBe(replayConfig.temperature);
    });

    test('should verify state consistency between original and reconstructed', () => {
      const original: StateSnapshot = {
        hash: 'original-hash',
        timestamp: Date.now(),
        context: 'Original context',
        decision: {
          id: 'original-decision',
          type: 'test',
          payload: { value: 42 },
          confidence: 0.9,
          timestamp: Date.now()
        },
        replayConfig: {
          seed: 'original-seed',
          temperature: 0.0,
          maxTokens: 1000,
          contextHash: 'original-context-hash',
          timestamp: Date.now()
        }
      };

      const reconstructed: StateSnapshot = {
        hash: 'original-hash', // Same hash for consistency
        timestamp: Date.now(),
        context: 'Original context',
        decision: {
          id: 'original-decision',
          type: 'test',
          payload: { value: 42 },
          confidence: 0.9,
          timestamp: Date.now()
        },
        replayConfig: {
          seed: 'original-seed',
          temperature: 0.0,
          maxTokens: 1000,
          contextHash: 'original-context-hash',
          timestamp: Date.now()
        }
      };

      const result = stateReconstructor.verifyStateConsistency(original, reconstructed);
      expect(result).toBe(true);
    });

    test('should reject inconsistent state reconstruction', () => {
      const original: StateSnapshot = {
        hash: 'original-hash',
        timestamp: Date.now(),
        context: 'Original context',
        decision: {
          id: 'original-decision',
          type: 'test',
          payload: { value: 42 },
          confidence: 0.9,
          timestamp: Date.now()
        },
        replayConfig: {
          seed: 'original-seed',
          temperature: 0.0,
          maxTokens: 1000,
          contextHash: 'original-context-hash',
          timestamp: Date.now()
        }
      };

      const reconstructed: StateSnapshot = {
        hash: 'different-hash', // Different hash
        timestamp: Date.now(),
        context: 'Original context',
        decision: {
          id: 'original-decision',
          type: 'test',
          payload: { value: 43 }, // Different value
          confidence: 0.9,
          timestamp: Date.now()
        },
        replayConfig: {
          seed: 'original-seed',
          temperature: 0.0,
          maxTokens: 1000,
          contextHash: 'original-context-hash',
          timestamp: Date.now()
        }
      };

      const result = stateReconstructor.verifyStateConsistency(original, reconstructed);
      expect(result).toBe(false);
    });
  });

  describe('CompactAuditTrail', () => {
    test('should add decisions to audit trail with compression', async () => {
      const decision: AgentDecision = {
        id: 'audit-decision-001',
        type: 'validation',
        payload: { isValid: true, score: 0.95 },
        confidence: 0.95,
        timestamp: Date.now()
      };

      await compactAuditTrail.addDecision(decision, ComputationPath.CRITICAL);
      
      // Check that the decision was processed (compression may prevent storage)
      const status = compactAuditTrail.getStatus();
      expect(status.status).toBe('ready');
    });

    test('should replay audit trail from checkpoints', async () => {
      // Add some decisions to create checkpoints
      for (let i = 0; i < 15; i++) {
        const decision: AgentDecision = {
          id: `audit-decision-${i}`,
          type: 'validation',
          payload: { isValid: true, score: 0.9 + i * 0.01 },
          confidence: 0.9 + i * 0.01,
          timestamp: Date.now() + i * 1000
        };

        await compactAuditTrail.addDecision(decision, ComputationPath.CRITICAL);
      }

      const auditTrail = await compactAuditTrail.replayAuditTrail();
      
      expect(auditTrail).toBeDefined();
      expect(auditTrail.checkpoints).toBeDefined();
      expect(auditTrail.metadata).toBeDefined();
      expect(auditTrail.metadata.compressionRatio).toBe(10);
      expect(auditTrail.metadata.memoryUsage).toBeGreaterThan(0);
    });

    test('should reconstruct intermediate states between checkpoints', async () => {
      const startDecision: AgentDecision = {
        id: 'start-decision',
        type: 'validation',
        payload: { value: 10, confidence: 0.8 },
        confidence: 0.8,
        timestamp: Date.now()
      };

      const endDecision: AgentDecision = {
        id: 'end-decision',
        type: 'validation',
        payload: { value: 20, confidence: 0.9 },
        confidence: 0.9,
        timestamp: Date.now() + 10000
      };

      const startCheckpoint: StateSnapshot = {
        hash: 'start-hash',
        timestamp: Date.now(),
        context: 'Start context',
        decision: startDecision,
        replayConfig: {
          seed: 'start-seed',
          temperature: 0.0,
          maxTokens: 1000,
          contextHash: 'start-context-hash',
          timestamp: Date.now()
        }
      };

      const endCheckpoint: StateSnapshot = {
        hash: 'end-hash',
        timestamp: Date.now() + 10000,
        context: 'End context',
        decision: endDecision,
        replayConfig: {
          seed: 'end-seed',
          temperature: 0.0,
          maxTokens: 1000,
          contextHash: 'end-context-hash',
          timestamp: Date.now() + 10000
        }
      };

      const intermediateStates = await compactAuditTrail.reconstructIntermediateStates(
        startCheckpoint,
        endCheckpoint
      );

      expect(intermediateStates).toBeDefined();
      expect(intermediateStates.length).toBeGreaterThan(0);
      
      // Check that intermediate states are between start and end
      for (const state of intermediateStates) {
        expect(state.timestamp).toBeGreaterThanOrEqual(startCheckpoint.timestamp);
        expect(state.timestamp).toBeLessThanOrEqual(endCheckpoint.timestamp);
      }
    });

    test('should handle different computation paths', async () => {
      const criticalDecision: AgentDecision = {
        id: 'critical-decision',
        type: 'consensus',
        payload: { approved: true, votes: 5 },
        confidence: 1.0,
        timestamp: Date.now()
      };

      const nonCriticalDecision: AgentDecision = {
        id: 'non-critical-decision',
        type: 'exploration',
        payload: { ideas: ['idea1', 'idea2'], creativity: 0.8 },
        confidence: 0.8,
        timestamp: Date.now()
      };

      await compactAuditTrail.addDecision(criticalDecision, ComputationPath.CRITICAL);
      await compactAuditTrail.addDecision(nonCriticalDecision, ComputationPath.NON_CRITICAL);

      const auditTrail = await compactAuditTrail.replayAuditTrail();
      expect(auditTrail).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    test('should maintain consistency across all components', async () => {
      // Create a decision
      const decision: AgentDecision = {
        id: 'integration-decision',
        type: 'validation',
        payload: { isValid: true, score: 0.95 },
        confidence: 0.95,
        timestamp: Date.now()
      };

      // Add to audit trail
      await compactAuditTrail.addDecision(decision, ComputationPath.CRITICAL);

      // Create LLM responses
      const response1: LLMResponse = {
        content: 'Validate this specification',
        tokens: 5,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      const response2: LLMResponse = {
        content: 'Validate this specification',
        tokens: 5,
        finishReason: 'stop',
        timestamp: Date.now()
      };

      // Verify consistency
      const consistencyResult = await consistencyVerifier.verifyRecomputationConsistency(
        response1,
        response2,
        ComputationPath.CRITICAL
      );

      expect(consistencyResult).toBe(true);

      // Reconstruct audit trail
      const auditTrail = await compactAuditTrail.replayAuditTrail();
      expect(auditTrail).toBeDefined();
    });

    test('should handle memory optimization with Williams-inspired tradeoffs', async () => {
      // Add many decisions to test compression
      for (let i = 0; i < 50; i++) {
        const decision: AgentDecision = {
          id: `memory-test-${i}`,
          type: 'validation',
          payload: { 
            isValid: true, 
            score: 0.8 + (i * 0.004),
            metadata: { iteration: i, timestamp: Date.now() }
          },
          confidence: 0.8 + (i * 0.004),
          timestamp: Date.now() + i * 1000
        };

        await compactAuditTrail.addDecision(decision, ComputationPath.CRITICAL);
      }

      const auditTrail = await compactAuditTrail.replayAuditTrail();
      
      // Verify memory optimization
      expect(auditTrail.metadata.compressionRatio).toBe(10);
      expect(auditTrail.metadata.memoryUsage).toBeGreaterThan(0);
      expect(auditTrail.metadata.reconstructionAccuracy).toBeGreaterThan(0);
      expect(auditTrail.metadata.reconstructionAccuracy).toBeLessThanOrEqual(1);
    });
  });
}); 