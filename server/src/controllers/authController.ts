import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

export const login = async (req: ExpressRequest, res: ExpressResponse) => {
  const { email, password } = req.body;

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
      { userId: supplier.id, email: supplier.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );

    res.json({
      token,
      user: {
        id: supplier.id,
        email: supplier.email,
        name: supplier.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera podczas logowania.' });
  }
};