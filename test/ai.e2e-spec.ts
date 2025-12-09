import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AiModule } from '../src/ai/ai.module';
import { AiService } from '../src/ai/ai.service';
import { AiAssistantResponse } from '../src/ai/interfaces/ai-assistant-response.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfiguration } from 'src/config/configuration';
import { AppModule } from 'src/app.module';

describe('Ai', () => {
  let app: INestApplication;
  const aiService = {
    askSomething: async (): Promise<AiAssistantResponse> => {
      return Promise.resolve({ message: 'You successfully asked AI' });
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AiModule, ConfigModule],
      providers: [AiService, ConfigService<AppConfiguration>],
    })
      .overrideProvider(AiService)
      .useValue(aiService)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST ask`, () => {
    return request(app.getHttpServer())
      .post('/ai/ask')
      .send({ prompt: { text: 'Tell me a joke' } })
      .expect(201)
      .expect({ message: 'You successfully asked AI' });
  });

  afterAll(async () => {
    await app.close();
  });
});
