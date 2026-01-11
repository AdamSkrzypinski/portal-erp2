import { Router, Response as ExpressResponse } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req: any, res: ExpressResponse) => {
  try {
    const { userId, role } = req.user;
    const whereCondition = role === 'ADMIN' ? {} : { supplierId: userId };

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        supplier: {
          select: { name: true },
        },
      },
      orderBy: {
        dateIssued: 'desc',
      },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.patch('/:id/status', authenticateToken, async (req: any, res: ExpressResponse) => {
  const { id } = req.params;
  const { status, comment } = req.body;
  const { userId, role } = req.user;

  try {
    const orderId = parseInt(id);
    const oldOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!oldOrder) {
      return res.status(404).json({ error: 'Zamówienie nie istnieje' });
    }

    if (role !== 'ADMIN' && oldOrder.supplierId !== userId) {
      return res.status(403).json({ error: 'Brak dostępu' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        comment: comment || oldOrder.comment,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'ZMIANA STATUSU',
        oldValue: oldOrder.status,
        newValue: status,
        comment: comment || '',
        orderId: orderId,
        supplierId: userId,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Błąd aktualizacji' });
  }
});

export default router;