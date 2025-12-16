import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { validationPipeConfig } from 'src/config/validation-pipe.config';
import { CleanUndefinedPipe } from '@common/pipes/clean-undefined.pipe';
import { ConfigService } from '@nestjs/config';
import { getDBConnection } from '@utils/db';
import { Connection } from 'mongoose';
import { ENVIRONMENT } from '@utils/constants/env';
import { Server } from 'node:http';
import { AppConfiguration } from 'src/config/configuration';
import Groq from 'groq-sdk';

const mockCreate = jest.fn();

jest.mock('groq-sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((config: Record<string, any>) => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
        _config: config,
      };
    }),
  };
});

interface ApiResponses {
  intent: {
    intent: string;
    query: string;
  };
  criteria: Record<string, any>;
  finalMessage: { message: string };
  fallback: string;
}

function getCreateMock(responses: ApiResponses) {
  return (params: { messages: { content: string }[] }) => {
    const prompt = params.messages[0].content;

    if (prompt.includes('intent analyzer') && prompt.includes('beer e-commerce')) {
      return {
        choices: [
          {
            message: {
              content: JSON.stringify(responses.intent),
            },
          },
        ],
      };
    }

    if (prompt.includes('criteria') && prompt.includes('database search')) {
      return {
        choices: [
          {
            message: {
              content: JSON.stringify(responses.criteria),
            },
          },
        ],
      };
    }

    if (prompt.includes('but found nothing') && prompt.includes('searched our database'))
      return {
        choices: [
          {
            message: {
              content: JSON.stringify(responses.finalMessage),
            },
          },
        ],
      };

    return {
      choices: [
        {
          message: {
            content: responses.fallback,
          },
        },
      ],
    };
  };
}

describe('AI e2e', () => {
  let app: INestApplication<Server>;
  let connection: Connection;
  let groqApiKey: string;

  const apiResponses = {
    intent: {
      intent: 'BEER_RECOMMENDATION',
      query: 'I want an IPA from Ukraine',
    },
    criteria: {
      style: ['IPA'],
      country: 'Ukraine',
    },
    finalMessage: {
      message: 'Nothing was found',
    },
    fallback: 'Fallback',
  } as const;

  async function cleanup() {
    await app.close();
    if (connection) {
      await connection.dropDatabase();
      await connection.close();
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    app.useGlobalPipes(new CleanUndefinedPipe());
    app.setGlobalPrefix('api');

    const configService = app.get<ConfigService<AppConfiguration>>(ConfigService);
    const srv = configService.getOrThrow('db_srv', { infer: true });
    groqApiKey = configService.getOrThrow('groq.apiKey', { infer: true });

    const mongooseInstance = await getDBConnection(srv, ENVIRONMENT.TEST);
    connection = mongooseInstance.connection;

    mockCreate.mockImplementation(getCreateMock(apiResponses));

    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should initialize Groq SDK with correct API Key', () => {
    expect(Groq).toHaveBeenCalledTimes(1);
    expect(Groq).toHaveBeenCalledWith({
      apiKey: groqApiKey,
    });
  });

  describe('/POST ask', () => {
    it('should return valid message', async () => {
      await request(app.getHttpServer())
        .post('/api/ai/ask')
        .send({ text: apiResponses.intent.query })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({ message: apiResponses.finalMessage.message });
        });

      expect(mockCreate).toHaveBeenCalledTimes(3);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            expect.objectContaining({
              role: 'user',
              content: expect.any(String) as string,
            }),
          ],
          response_format: { type: 'json_object' },
        }),
      );
    });

    it('should return 400 status code if request is invalid', async () => {
      await request(app.getHttpServer())
        .post('/api/ai/ask')
        .send({ invalidValue: apiResponses.intent.query })
        .expect(400);
    });

    it('should return 500 status code if work with LLM failed', async () => {
      const error = new Error('Unknown api error');
      mockCreate.mockRejectedValue(error);

      await request(app.getHttpServer())
        .post('/api/ai/ask')
        .send({ text: apiResponses.intent.query })
        .expect(500);
    });
  });
});
