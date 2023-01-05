import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import {
  cookieSessionMiddleware,
  CurrentUserMiddleware,
  ErrorHandlerMiddleware,
  NotFoundError,
} from '@eotickets/common';
import { PaymentsRoutes } from './routes/payments-routes';

const app = express();

// just for https
app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(cookieSessionMiddleware);

app.all('*', (req, _, next) => {
  console.log('Request: ', req.method, req.path, new Date());
  next();
});

app.use(CurrentUserMiddleware);
app.use(PaymentsRoutes);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(ErrorHandlerMiddleware);

export { app };
