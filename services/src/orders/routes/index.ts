import { RequireAuthMiddleware } from '@eotickets/common';
import { Router, Request, Response } from 'express';
import { OrderService } from '../services/order-service';

const router = Router();

router.get(
  '/api/orders',
  RequireAuthMiddleware,
  async (req: Request, res: Response) => {
    const orders = await OrderService.getOrders(req.currentUser!.id);
    res.send(orders);

  }
);

export { router as indexOrderRouter };
