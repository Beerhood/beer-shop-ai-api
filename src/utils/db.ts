import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { AppConfiguration } from 'src/config/configuration';

mongoose.Promise = global.Promise;
const config = new ConfigService<AppConfiguration>();

const nodeEnv = <string>config.get('nodeEnv');
const srv = <string>config.get('db_srv');

export async function getDBConnection() {
  const options = {
    serverSelectionTimeoutMS: 1000,
  };

  if (nodeEnv !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connection.on('connected', () => console.log('Mongoose connection is CONNECTED'));
  mongoose.connection.on('error', (err: Error) =>
    console.error('Mongoose connection error:', err.message),
  );
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is DISCONNECTED'));

  await mongoose.connect(srv, options);
}
