import mongoose from 'mongoose';
import * as process from 'process';

mongoose.Promise = global.Promise;
const srv = <string>process.env.DB_SRV;

export async function getDBConnection() {
  const options = {
    serverSelectionTimeoutMS: 1000,
  };

  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connection.on('connected', () => console.log('Mongoose connection is CONNECTED'));
  mongoose.connection.on('error', (err: Error) =>
    console.error('Mongoose connection error:', err.message),
  );
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is DISCONNECTED'));

  await mongoose.connect(srv, options);
}
