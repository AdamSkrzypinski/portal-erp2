import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import prisma from '../prismaClient';

export const getOrders = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        supplier: true,
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
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};