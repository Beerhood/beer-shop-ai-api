import mongoose from 'mongoose';
import { ENVIRONMENT } from './constants/env';

mongoose.Promise = global.Promise;

export async function getDBConnection(srv: string, nodeEnv: string) {
  const options = {
    serverSelectionTimeoutMS: 1000,
  };

  if (nodeEnv !== ENVIRONMENT.PRODUCTION) {
    mongoose.set('debug', true);
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connection is CONNECTED');
  });
  mongoose.connection.on('error', (err: Error) => {
    console.error('Mongoose connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is DISCONNECTED');
  });

  await mongoose.connect(srv, options);
}
