import { Router, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_tajny_klucz_123';

router.post('/login', async (req: ExpressRequest, res: ExpressResponse) => {
  const { email, password } = req.body;

  try {

    const user = await prisma.supplier.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }


    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

  
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
      }, 
      JWT_SECRET, 
      { expiresIn: '2h' },
    );

    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role,
      }, 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera podczas logowania' });
  }
});

export default router;