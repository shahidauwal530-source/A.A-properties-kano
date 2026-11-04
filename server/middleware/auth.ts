import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isMongoConnected, localStore } from '../db.ts';
import { UserModel } from '../models/User.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'aa_properties_kano_jwt_super_secret_key_2026';

export interface AuthRequest extends Request {
  user?: any;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Ka shiga da farko - Sign In (Authentication required)',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Token ba shi da inganci (Invalid token)',
      });
    }

    let user: any = null;
    if (isMongoConnected) {
      user = await UserModel.findById(decoded.id).select('-passwordHash');
    } else {
      const users = localStore.getCollection('users');
      user = users.find((u) => u._id === decoded.id || u.id === decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Babu wannan mai amfani (User not found)',
      });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: 'Token ya kare ko ba shi da inganci (Session expired. Please sign in again)',
      error: err.message,
    });
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Kai ba Admin ba ne - Adam kadai ne Admin (Admin access only)',
    });
  }
  next();
}

export async function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.id) {
        if (isMongoConnected) {
          req.user = await UserModel.findById(decoded.id).select('-passwordHash');
        } else {
          const users = localStore.getCollection('users');
          req.user = users.find((u) => u._id === decoded.id || u.id === decoded.id);
        }
      }
    }
  } catch (e) {
    // optional, proceed as guest
  }
  next();
}
