import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import prisma from '../prismaClient';
import { AuthRequest } from '../middleware/authMiddleware';

export const getOrders = async (req: ExpressRequest, res: ExpressResponse) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'Użytkownik niezalogowany' });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        supplierId: authReq.user.userId,
      },
      orderBy: {
        dateIssued: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateOrderStatus = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { 
        status,
        comment,
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};