import { Request, Response, NextFunction } from 'express';
import { compare, hash } from 'bcrypt';
import session from 'express-session';
import { storage } from './storage';
import { InsertUser, loginSchema, googleLoginSchema } from '@shared/schema';
import { z, ZodError } from 'zod';
import MemoryStore from 'memorystore';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    role: string;
  }
}

// Helper function to validate and sanitize requests
export function validateRequest<T>(schema: z.ZodType<T>, req: Request, res: Response): T | null {
  try {
    return schema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Invalid request data' });
    }
    return null;
  }
}

// Configure session middleware
export function configureSession(app: any) {
  const MemoryStoreSession = MemoryStore(session);
  
  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // 24 hours
      }),
      secret: process.env.SESSION_SECRET || 'watch-dealer-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Middleware to check if user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  console.log('Checking admin status:', req.session);
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
}

// Registration handler
export async function register(req: Request, res: Response) {
  try {
    // Validate the request
    const userData = validateRequest(loginSchema, req, res);
    if (!userData) return;
    
    const { email, password } = userData;

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user
    const newUser = await storage.createUser({
      username: email.split('@')[0], // Simple username from email
      email,
      password: hashedPassword,
      role: 'dealer', // Default role
      googleId: null,
    } as InsertUser);

    // Set up session
    req.session.userId = newUser.id;
    req.session.role = newUser.role;

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Login handler
export async function login(req: Request, res: Response) {
  try {
    // Validate the request
    const credentials = validateRequest(loginSchema, req, res);
    if (!credentials) return;
    
    const { email, password } = credentials;

    // Find the user
    const user = await storage.getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set up session
    req.session.userId = user.id;
    req.session.role = user.role;

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Google login handler (simplified without actual OAuth implementation)
export async function googleLogin(req: Request, res: Response) {
  try {
    // In a real implementation, we would verify the token with Google
    // and extract user information. For this example, we'll assume
    // the token is the Google ID and email is provided.
    const { token } = req.body;
    const email = req.body.email;
    
    if (!token || !email) {
      return res.status(400).json({ message: 'Invalid Google authentication data' });
    }

    // Check if user exists
    let user = await storage.getUserByGoogleId(token);
    
    if (!user) {
      // Check if email exists but not linked to Google
      user = await storage.getUserByEmail(email);
      
      if (user) {
        // Link Google ID to existing account
        user = await storage.updateUser(user.id, { googleId: token }) || user;
      } else {
        // Create new user
        user = await storage.createUser({
          username: email.split('@')[0],
          email,
          googleId: token,
          role: 'dealer',
          password: null,
        } as InsertUser);
      }
    }

    // Set up session
    req.session.userId = user.id;
    req.session.role = user.role;

    // Return user
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Logout handler
export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
}

// Get current user
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: 'User not found' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
