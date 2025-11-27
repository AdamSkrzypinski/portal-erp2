import { Router } from 'express';
import { getOrders, updateOrderStatus } from '../controllers/orderController';

const router = Router();

router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;