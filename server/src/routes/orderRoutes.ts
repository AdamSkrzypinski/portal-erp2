import { Router } from 'express';
import { getOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getOrders);
router.patch('/:id/status', authenticateToken, updateOrderStatus);

export default router;