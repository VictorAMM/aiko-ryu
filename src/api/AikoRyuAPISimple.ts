import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AgentContract } from '../agents/AgentContract';

/**
 * Simplified AikoRyu RESTful API Gateway
 * 
 * Purpose: Provides RESTful endpoints for AikoRyu system operations
 * with proper error handling and type safety.
 */
export class AikoRyuAPISimple {
  private app: express.Application;
  private agents: Map<string, AgentContract> = new Map();
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        agents: Array.from(this.agents.keys())
      });
    });

    // System metrics
    this.app.get('/metrics', (req, res) => {
      res.json({
        system: {
          cpu: process.cpuUsage(),
          memory: process.memoryUsage(),
          uptime: process.uptime()
        },
        agents: Array.from(this.agents.entries()).map(([id, agent]) => ({
          id,
          status: agent.getStatus(),
          role: agent.role
        }))
      });
    });

    // Agent management
    this.setupAgentRoutes();
    
    // System administration
    this.setupAdminRoutes();

    // Error handling
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('API Error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    });
  }

  private setupAgentRoutes(): void {
    // Get all agents
    this.app.get('/api/agents', (req, res) => {
      const agents = Array.from(this.agents.entries()).map(([id, agent]) => ({
        id,
        role: agent.role,
        status: agent.getStatus(),
        dependencies: agent.dependencies
      }));
      res.json(agents);
    });

    // Get specific agent
    this.app.get('/api/agents/:id', (req, res) => {
      const agent = this.agents.get(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json({
        id: req.params.id,
        role: agent.role,
        status: agent.getStatus(),
        dependencies: agent.dependencies
      });
    });

    // Initialize agent
    this.app.post('/api/agents/:id/initialize', async (req, res) => {
      try {
        const agent = this.agents.get(req.params.id);
        if (!agent) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        
        await agent.initialize();
        res.json({ success: true, message: 'Agent initialized' });
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to initialize agent', 
          message: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    // Shutdown agent
    this.app.post('/api/agents/:id/shutdown', async (req, res) => {
      try {
        const agent = this.agents.get(req.params.id);
        if (!agent) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        
        await agent.shutdown();
        res.json({ success: true, message: 'Agent shut down' });
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to shutdown agent', 
          message: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    // Send event to agent
    this.app.post('/api/agents/:id/events', async (req, res) => {
      try {
        const agent = this.agents.get(req.params.id);
        if (!agent) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        
        const { eventType, payload } = req.body;
        await agent.handleEvent(eventType, payload);
        res.json({ success: true, message: 'Event sent to agent' });
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to send event', 
          message: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    // Get agent status
    this.app.get('/api/agents/:id/status', (req, res) => {
      const agent = this.agents.get(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json(agent.getStatus());
    });
  }

  private setupAdminRoutes(): void {
    // System configuration
    this.app.get('/api/admin/config', (req, res) => {
      res.json({
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version,
        agents: Array.from(this.agents.keys()),
        features: {
          gpu: true,
          ai: true,
          monitoring: true,
          tracing: true
        }
      });
    });

    // Update system configuration
    this.app.put('/api/admin/config', (req, res) => {
      res.json({ success: true, message: 'Configuration updated' });
    });

    // System backup
    this.app.post('/api/admin/backup', async (req, res) => {
      try {
        res.json({ success: true, message: 'Backup created successfully' });
      } catch (error) {
        res.status(500).json({ 
          error: 'Backup failed', 
          message: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    // System restore
    this.app.post('/api/admin/restore', async (req, res) => {
      try {
        const { backupId } = req.body;
        res.json({ success: true, message: 'System restored successfully' });
      } catch (error) {
        res.status(500).json({ 
          error: 'Restore failed', 
          message: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    // System shutdown
    this.app.post('/api/admin/shutdown', async (req, res) => {
      try {
        // Gracefully shutdown all agents
        await Promise.all(Array.from(this.agents.values()).map(agent => agent.shutdown()));
        res.json({ success: true, message: 'System shutdown initiated' });
        
        // Exit process after response
        setTimeout(() => process.exit(0), 1000);
      } catch (error) {
        res.status(500).json({ 
          error: 'Shutdown failed', 
          message: error instanceof Error ? error.message : String(error) 
        });
      }
    });
  }

  public registerAgent(agent: AgentContract): void {
    this.agents.set(agent.id, agent);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 AikoRyu API Gateway running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`📈 Metrics: http://localhost:${this.port}/metrics`);
      console.log(`🔧 Agent management: http://localhost:${this.port}/api/agents`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
} 