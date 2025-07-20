import { Request, Response, NextFunction } from 'express';

/**
 * Simplified Authentication Middleware for AikoRyu API Gateway
 * 
 * Purpose: Provides basic authentication, role-based access control,
 * and security features for the AikoRyu system.
 */
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'developer' | 'viewer';
  permissions: string[];
  tenant?: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}

export class AuthenticationMiddlewareSimple {
  private config: AuthConfig;
  private users: Map<string, User> = new Map();
  private tokens: Map<string, any> = new Map();

  constructor(config: AuthConfig) {
    this.config = config;
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    // Default admin user
    this.users.set('admin@aikoryu.com', {
      id: 'admin-001',
      email: 'admin@aikoryu.com',
      role: 'admin',
      permissions: ['*'],
      tenant: 'aikoryu'
    });

    // Default developer user
    this.users.set('developer@aikoryu.com', {
      id: 'dev-001',
      email: 'developer@aikoryu.com',
      role: 'developer',
      permissions: ['agents:read', 'agents:write', 'ai:read', 'ai:write', 'gpu:read'],
      tenant: 'aikoryu'
    });

    // Default user
    this.users.set('user@aikoryu.com', {
      id: 'user-001',
      email: 'user@aikoryu.com',
      role: 'user',
      permissions: ['agents:read', 'ai:read', 'metrics:read'],
      tenant: 'aikoryu'
    });

    // Default viewer
    this.users.set('viewer@aikoryu.com', {
      id: 'viewer-001',
      email: 'viewer@aikoryu.com',
      role: 'viewer',
      permissions: ['metrics:read', 'health:read'],
      tenant: 'aikoryu'
    });
  }

  /**
   * Simple Token Generation
   */
  generateToken(user: User): string {
    const token = `token_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.tokens.set(token, {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      tenant: user.tenant,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    return token;
  }

  /**
   * Token Verification
   */
  verifyToken(token: string): any {
    const tokenData = this.tokens.get(token);
    if (!tokenData) {
      throw new Error('Invalid token');
    }
    
    if (tokenData.exp < Date.now()) {
      this.tokens.delete(token);
      throw new Error('Token expired');
    }
    
    return tokenData;
  }

  /**
   * Authentication Middleware
   */
  authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'No authorization header provided'
        });
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = this.verifyToken(token);
      
      // Add user info to request
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Invalid token'
      });
    }
  }

  /**
   * Role-based Access Control
   */
  requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Required roles: ${roles.join(', ')}. User role: ${user.role}`
        });
      }

      next();
    };
  }

  /**
   * Permission-based Access Control
   */
  requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      if (!user.permissions.includes('*') && !user.permissions.includes(permission)) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Required permission: ${permission}`
        });
      }

      next();
    };
  }

  /**
   * Multi-tenant Access Control
   */
  requireTenant(tenant: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      if (user.role !== 'admin' && user.tenant !== tenant) {
        return res.status(403).json({
          error: 'Access denied',
          message: `Access to tenant ${tenant} not allowed`
        });
      }

      next();
    };
  }

  /**
   * Login Endpoint
   */
  login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing credentials',
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = this.users.get(email);
      if (!user) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid credentials'
        });
      }

      // In a real implementation, you would verify the password
      // For demo purposes, we'll accept any password
      if (password !== 'password') {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = this.generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          tenant: user.tenant
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Register User
   */
  register(req: Request, res: Response) {
    try {
      const { email, password, role, tenant } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Email, password, and role are required'
        });
      }

      // Check if user already exists
      if (this.users.has(email)) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email already exists'
        });
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        role: role as User['role'],
        permissions: this.getDefaultPermissions(role as User['role']),
        tenant: tenant || 'default'
      };

      this.users.set(email, newUser);

      // Generate token
      const token = this.generateToken(newUser);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          permissions: newUser.permissions,
          tenant: newUser.tenant
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get Default Permissions for Role
   */
  private getDefaultPermissions(role: User['role']): string[] {
    switch (role) {
      case 'admin':
        return ['*'];
      case 'developer':
        return ['agents:read', 'agents:write', 'ai:read', 'ai:write', 'gpu:read'];
      case 'user':
        return ['agents:read', 'ai:read', 'metrics:read'];
      case 'viewer':
        return ['metrics:read', 'health:read'];
      default:
        return ['health:read'];
    }
  }

  /**
   * Get User Profile
   */
  getProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          tenant: user.tenant
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get profile',
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Refresh Token
   */
  refreshToken(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
      }

      // Generate new token
      const newToken = this.generateToken(user);

      res.json({
        success: true,
        token: newToken
      });
    } catch (error) {
      res.status(500).json({
        error: 'Token refresh failed',
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Logout
   */
  logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        this.tokens.delete(token);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Logout failed',
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get All Users (Admin only)
   */
  getAllUsers(req: Request, res: Response) {
    try {
      const users = Array.from(this.users.values()).map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        tenant: user.tenant
      }));

      res.json({
        success: true,
        users
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get users',
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
} 