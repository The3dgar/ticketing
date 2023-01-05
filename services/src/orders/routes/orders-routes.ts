import { Router } from 'express';
import { indexOrderRouter } from '.';
import { deleteOrderRouter } from './delete';
import { newOrderRouter } from './new';
import { showOrderRouter } from './show';

const orderRouter = Router();
orderRouter.use(indexOrderRouter);
orderRouter.use(deleteOrderRouter);
orderRouter.use(showOrderRouter);
orderRouter.use(newOrderRouter);

export { orderRouter };
