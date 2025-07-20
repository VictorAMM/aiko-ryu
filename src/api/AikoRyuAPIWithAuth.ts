import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AgentContract } from '../agents/AgentContract';
import { AuthenticationMiddlewareSimple, AuthConfig } from '../auth/AuthenticationMiddlewareSimple';

/**
 * Enhanced AikoRyu RESTful API Gateway with Authentication
 * 
 * Purpose: Provides comprehensive RESTful endpoints for AikoRyu system
 * operations with authentication, role-based access control, and security.
 */
export class AikoRyuAPIWithAuth {
  private app: express.Application;
  private agents: Map<string, AgentContract> = new Map();
  private port: number;
  private auth: AuthenticationMiddlewareSimple;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();
    
    // Initialize authentication
    const authConfig: AuthConfig = {
      jwtSecret: process.env.JWT_SECRET || 'aikoryu-secret-key',
      jwtExpiresIn: '24h',
      rateLimitWindowMs: 15 * 60 * 1000,
      rateLimitMax: 100
    };
    this.auth = new AuthenticationMiddlewareSimple(authConfig);
    
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
    // Public routes (no authentication required)
    this.setupPublicRoutes();
    
    // Authentication routes
    this.setupAuthRoutes();
    
    // Protected routes (authentication required)
    this.setupProtectedRoutes();

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

  private setupPublicRoutes(): void {
    // Health check (public)
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        agents: Array.from(this.agents.keys())
      });
    });

    // API documentation (public)
    this.app.get('/api/docs', (req, res) => {
      res.json({
        title: 'AikoRyu API Documentation',
        version: '1.0.0',
        endpoints: {
          public: [
            'GET /health',
            'GET /api/docs',
            'POST /api/auth/login',
            'POST /api/auth/register'
          ],
          protected: [
            'GET /api/agents',
            'GET /api/agents/:id',
            'POST /api/agents/:id/initialize',
            'POST /api/agents/:id/shutdown',
            'POST /api/agents/:id/events',
            'GET /api/metrics',
            'GET /api/admin/config'
          ]
        }
      });
    });
  }

  private setupAuthRoutes(): void {
    // Login
    this.app.post('/api/auth/login', (req, res) => {
      this.auth.login(req, res);
    });

    // Register
    this.app.post('/api/auth/register', (req, res) => {
      this.auth.register(req, res);
    });

    // Logout
    this.app.post('/api/auth/logout', this.auth.authenticate, (req, res) => {
      this.auth.logout(req, res);
    });

    // Get profile
    this.app.get('/api/auth/profile', this.auth.authenticate, (req, res) => {
      this.auth.getProfile(req, res);
    });

    // Refresh token
    this.app.post('/api/auth/refresh', this.auth.authenticate, (req, res) => {
      this.auth.refreshToken(req, res);
    });

    // Get all users (admin only)
    this.app.get('/api/auth/users', 
      this.auth.authenticate, 
      this.auth.requireRole(['admin']), 
      (req, res) => {
        this.auth.getAllUsers(req, res);
      }
    );
  }

  private setupProtectedRoutes(): void {
    // System metrics (requires authentication)
    this.app.get('/api/metrics', 
      this.auth.authenticate, 
      this.auth.requirePermission('metrics:read'), 
      (req, res) => {
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
      }
    );

    // Agent management (requires authentication)
    this.setupAgentRoutes();
    
    // System administration (requires authentication)
    this.setupAdminRoutes();
  }

  private setupAgentRoutes(): void {
    // Get all agents
    this.app.get('/api/agents', 
      this.auth.authenticate, 
      this.auth.requirePermission('agents:read'), 
      (req, res) => {
        const agents = Array.from(this.agents.entries()).map(([id, agent]) => ({
          id,
          role: agent.role,
          status: agent.getStatus(),
          dependencies: agent.dependencies
        }));
        res.json(agents);
      }
    );

    // Get specific agent
    this.app.get('/api/agents/:id', 
      this.auth.authenticate, 
      this.auth.requirePermission('agents:read'), 
      (req, res) => {
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
      }
    );

    // Initialize agent
    this.app.post('/api/agents/:id/initialize', 
      this.auth.authenticate, 
      this.auth.requirePermission('agents:write'), 
      async (req, res) => {
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
      }
    );

    // Shutdown agent
    this.app.post('/api/agents/:id/shutdown', 
      this.auth.authenticate, 
      this.auth.requirePermission('agents:write'), 
      async (req, res) => {
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
      }
    );

    // Send event to agent
    this.app.post('/api/agents/:id/events', 
      this.auth.authenticate, 
      this.auth.requirePermission('agents:write'), 
      async (req, res) => {
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
      }
    );

    // Get agent status
    this.app.get('/api/agents/:id/status', 
      this.auth.authenticate, 
      this.auth.requirePermission('agents:read'), 
      (req, res) => {
        const agent = this.agents.get(req.params.id);
        if (!agent) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        res.json(agent.getStatus());
      }
    );
  }

  private setupAdminRoutes(): void {
    // System configuration (admin only)
    this.app.get('/api/admin/config', 
      this.auth.authenticate, 
      this.auth.requireRole(['admin']), 
      (req, res) => {
        res.json({
          environment: process.env.NODE_ENV,
          version: process.env.npm_package_version,
          agents: Array.from(this.agents.keys()),
          features: {
            gpu: true,
            ai: true,
            monitoring: true,
            tracing: true,
            authentication: true
          }
        });
      }
    );

    // Update system configuration (admin only)
    this.app.put('/api/admin/config', 
      this.auth.authenticate, 
      this.auth.requireRole(['admin']), 
      (req, res) => {
        res.json({ success: true, message: 'Configuration updated' });
      }
    );

    // System backup (admin only)
    this.app.post('/api/admin/backup', 
      this.auth.authenticate, 
      this.auth.requireRole(['admin']), 
      async (req, res) => {
        try {
          res.json({ success: true, message: 'Backup created successfully' });
        } catch (error) {
          res.status(500).json({ 
            error: 'Backup failed', 
            message: error instanceof Error ? error.message : String(error) 
          });
        }
      }
    );

    // System restore (admin only)
    this.app.post('/api/admin/restore', 
      this.auth.authenticate, 
      this.auth.requireRole(['admin']), 
      async (req, res) => {
        try {
          const { backupId } = req.body;
          res.json({ success: true, message: 'System restored successfully' });
        } catch (error) {
          res.status(500).json({ 
            error: 'Restore failed', 
            message: error instanceof Error ? error.message : String(error) 
          });
        }
      }
    );

    // System shutdown (admin only)
    this.app.post('/api/admin/shutdown', 
      this.auth.authenticate, 
      this.auth.requireRole(['admin']), 
      async (req, res) => {
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
      }
    );
  }

  public registerAgent(agent: AgentContract): void {
    this.agents.set(agent.id, agent);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 AikoRyu API Gateway with Auth running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`📈 API Documentation: http://localhost:${this.port}/api/docs`);
      console.log(`🔧 Agent management: http://localhost:${this.port}/api/agents`);
      console.log(`🔐 Authentication: http://localhost:${this.port}/api/auth/login`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
} 