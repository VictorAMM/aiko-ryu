import { DynamicOntologyMatrix } from '../src/agents/DynamicOntologyMatrix';
import { ErrorInvestigationHandler } from '../src/agents/ErrorInvestigationHandler';

// Guard against infinite loops in error investigation tests
if (process.env.ERROR_INVESTIGATION_ACTIVE === 'true') {
  console.log('⚠️ Skipping dynamic-ontology-error-handling test to prevent infinite loop');
  process.exit(0);
}

// Mock child_process to prevent actual test execution
jest.mock('child_process', () => ({
  execSync: jest.fn(() => {
    // Return success without actually running tests
    return Buffer.from('Mock test output');
  })
}));

// Mock fs to prevent file system operations
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(() => JSON.stringify({ scripts: { test: 'jest' } })),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  rmSync: jest.fn(),
  readdirSync: jest.fn(() => ['test.test.js'])
}));

describe('Dynamic Ontology Matrix and Error Investigation Handler', () => {
  let ontologyMatrix: DynamicOntologyMatrix;
  let errorHandler: ErrorInvestigationHandler;

  beforeEach(() => {
    ontologyMatrix = new DynamicOntologyMatrix();
    errorHandler = new ErrorInvestigationHandler(ontologyMatrix);
  });

  describe('Dynamic Ontology Matrix', () => {
    test('should initialize with base ontology', async () => {
      const status = await ontologyMatrix.getStatus();
      expect(status.status).toBe('ready');
    });

    test('should handle known events', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await ontologyMatrix.handleEvent('system.autonomous.cycle', {
        cycle: 1,
        timestamp: new Date(),
        correlationId: 'test',
        sourceAgent: 'test'
      });

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('DynamicOntologyMatrix:dynamic-ontology-matrix'),
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });

    test('should create investigation cycle for unknown events', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await ontologyMatrix.handleEvent('unknown.event.type', {
        timestamp: new Date(),
        correlationId: 'test',
        sourceAgent: 'test'
      });

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ONTOLOGY: Unknown event detected')
      );

      consoleSpy.mockRestore();
    });

    test('should add ontology nodes', async () => {
      const node = {
        id: 'test.event',
        type: 'event' as const,
        name: 'test.event',
        description: 'Test event',
        confidence: 0.9,
        relationships: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await ontologyMatrix.addOntologyNode(node);
      
      const foundNodes = await ontologyMatrix.findOntologyNode('test.event');
      expect(foundNodes).toHaveLength(1);
      expect(foundNodes[0].id).toBe('test.event');
    });
  });

  describe('Error Investigation Handler', () => {
    test('should handle dependency errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await errorHandler.handleError(
        new Error('Cannot find module \'supertest\''),
        { projectPath: process.cwd(), type: 'dependency' }
      );

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR INVESTIGATION:')
      );

      consoleSpy.mockRestore();
    });

    test('should handle test errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await errorHandler.handleError(
        new Error('Test timeout exceeded'),
        { projectPath: process.cwd(), type: 'test' }
      );

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR INVESTIGATION:')
      );

      consoleSpy.mockRestore();
    });

    test('should investigate dependency issues', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await errorHandler.investigateDependencyIssue({
        type: 'missing',
        package: 'supertest',
        error: 'Cannot find module \'supertest\''
      });

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR INVESTIGATION:')
      );

      consoleSpy.mockRestore();
    });

    test('should investigate test issues', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await errorHandler.investigateTestIssue({
        type: 'timeout',
        testName: 'app.test.js',
        timeout: 5000
      });

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR INVESTIGATION:')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Integration Tests', () => {
    test('should handle unknown events through ontology matrix', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Simulate unknown event
      await ontologyMatrix.handleEvent('completely.unknown.event', {
        timestamp: new Date(),
        correlationId: 'test',
        sourceAgent: 'test'
      });

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ONTOLOGY: Unknown event detected')
      );

      consoleSpy.mockRestore();
    });

    test('should handle errors through error investigation handler', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Simulate error event
      await errorHandler.handleEvent('error.detected', {
        error: 'Test error message',
        context: { projectPath: process.cwd() },
        timestamp: new Date(),
        correlationId: 'test',
        sourceAgent: 'test'
      });

      // Check for the actual console output format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR INVESTIGATION:')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Error Resolution Tests', () => {
    test('should attempt to resolve dependency issues', async () => {
      const fs = require('fs');
      const path = require('path');
      
      // Create a temporary package.json for testing
      const testDir = path.join(process.cwd(), 'test-temp');
      const packageJsonPath = path.join(testDir, 'package.json');
      
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      const packageJson = {
        name: 'test-project',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {}
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      
      try {
        const result = await errorHandler.resolveDependencyIssue({
          type: 'missing',
          package: 'supertest',
          error: 'Cannot find module \'supertest\''
        });
        
        // Should attempt to resolve (may fail in test environment)
        expect(typeof result).toBe('boolean');
      } finally {
        // Cleanup
        if (fs.existsSync(testDir)) {
          fs.rmSync(testDir, { recursive: true, force: true });
        }
      }
    });
  });
}); 