import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';


export const login = async (req: ExpressRequest, res: ExpressResponse) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: Brak JWT_SECRET w zmiennych środowiskowych.');
    return res.status(500).json({ error: 'Błąd konfiguracji serwera.' });
  }

  try {
    const supplier = await prisma.supplier.findUnique({
      where: { email },
    });

    if (!supplier) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const isValidPassword = await bcrypt.compare(password, supplier.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const token = jwt.sign(
      { 
        userId: supplier.id, 
        email: supplier.email,
        role: supplier.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' },
    );

    return res.json({
      token,
      user: {
        id: supplier.id,
        email: supplier.email,
        name: supplier.name,
        role: supplier.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Błąd serwera podczas logowania.' });
  }
};