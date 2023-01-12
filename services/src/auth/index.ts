import { config } from './config/config';
import { startDbConnection } from './db/dbConnection';
import { app } from './app';

const port = config.PORT;

const start = async () => {
  console.log('Starting up... !');
  await startDbConnection(config.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
