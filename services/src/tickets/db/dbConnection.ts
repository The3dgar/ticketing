import { connect } from 'mongoose';

export const startDbConnection = async (url: string) => {
  try {
    const connection = await connect(url);
    console.log('MongoDB is connected: ', connection.connection.host);
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error);
  }
};
