import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends ExpressRequest {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}


export const authenticateToken = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) { 
    return res.status(401).json({ error: 'Brak tokena dostępu.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('Błąd: Brak JWT_SECRET w pliku .env');
    return res.status(500).json({ error: 'Błąd konfiguracji serwera.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number; email: string; role: string };
    
    (req as AuthRequest).user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Nieprawidłowy lub wygasły token.' });
  }
};