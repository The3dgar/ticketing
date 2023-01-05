import { Router } from 'express';
import { newPaymentRoute } from './new-payment';

const router = Router();
router.use(newPaymentRoute);
export { router as PaymentsRoutes};
