import { Router, Response as ExpressResponse } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/logs', authenticateToken, async (req: any, res: ExpressResponse) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Brak uprawnień administratora' });
    }

 
    const logs = await prisma.auditLog.findMany({
      include: {
        supplier: {
          select: { name: true },
        },
        order: {
          select: { orderNumber: true },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.json(logs);
  } catch (error) {
    console.error('Błąd pobierania logów:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

export default router;