import { getDBConnection } from '@utils/db';
import { ENVIRONMENT } from '@utils/constants/env';
import { CONTEXT_FILE, REPORTS_DIR } from '../utils/constants';
import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from 'src/config/configuration';

async function analyze() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const configService = app.get<ConfigService<AppConfiguration>>(ConfigService);
  const srv = configService.getOrThrow('db_srv', { infer: true });

  const mongooseInstance = await getDBConnection(srv, ENVIRONMENT.TEST);
  const connection = mongooseInstance.connection;

  if (!connection.db) {
    throw new Error('Database connection is not established');
  }

  const reportPath = path.join(REPORTS_DIR, `mongo-slow-queries-${Date.now()}.json`);

  const fileStream = fs.createWriteStream(reportPath, { flags: 'w' });

  const cursor = connection.db
    .collection('system.profile')
    .find({
      millis: { $gt: 0 },
      op: { $in: ['query', 'command'] },
      ns: { $not: /system\.profile/ },
    })
    .sort({ millis: -1 })
    .limit(100);

  fileStream.write('[\n');

  let isFirst = true;
  let count = 0;

  for await (const q of cursor) {
    let explainResult: any = null;
    let collectionName = '';

    try {
      if (q.ns) collectionName = q.ns.split('.')[1];

      if (q.command && q.command.find) {
        const explainCmd = {
          explain: {
            find: collectionName || q.command.find,
            filter: q.command.filter || {},
            sort: q.command.sort || {},
            skip: q.command.skip || 0,
            limit: q.command.limit || 0,
          },
          verbosity: 'executionStats',
        };

        explainResult = await connection.db.command(explainCmd);
      } else if (q.command && q.command.aggregate) {
        const explainCmd = {
          explain: {
            aggregate: collectionName || q.command.aggregate,
            pipeline: q.command.pipeline || [],
            cursor: q.command.cursor || {},
          },
          verbosity: 'executionStats',
        };
        explainResult = await connection.db.command(explainCmd);
      }
    } catch (e) {
      if (e instanceof Error) explainResult = { error: `Could not run explain: ${e.message}` };
    }

    const reportItem = {
      originalProfileEntry: {
        timestamp: q.ts,
        millis: q.millis,
        op: q.op,
        ns: q.ns,
        command: q.command,
      },
      explainAnalysis: explainResult,
    };

    if (!isFirst) {
      fileStream.write(',\n');
    }

    fileStream.write(JSON.stringify(reportItem, null, 2));

    isFirst = false;
    count++;

    if (count % 10 === 0) process.stdout.write('.');
  }

  fileStream.write('\n]');
  fileStream.end();

  await new Promise<void>((resolve) => fileStream.on('finish', resolve));

  console.log(`\nProcessed ${count} queries.`);
  console.log(`Detailed DB Profile Report saved to: ${reportPath}`);

  await connection.db.command({ profile: 0 });

  try {
    if (fs.existsSync(CONTEXT_FILE)) {
      fs.unlinkSync(CONTEXT_FILE);
      console.log('Temporary file successfully deleted.');
    }
  } catch (e) {
    if (e instanceof Error) console.error('Error deleting file:', e.message);
  }

  await connection.dropDatabase();
  await connection.close();
}

analyze().catch((err) => {
  console.error('Analysis and cleanup failed:', err);
  process.exit(1);
});
