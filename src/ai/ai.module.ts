import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ProductsModule } from '../products/products.module';
import { GroqProvider } from './provider/groq.provider';
import { BeerRecommendationHandler } from './handlers/beer-recommendation.handler';
import { OffTopicHandler } from './handlers/off-topic.handler';
import { IntentHandlerFactory } from './handlers/intent-handler.factory';
import { IntentHandlerInterface } from './interfaces/intent-handler.interface';
import {
  AI_PROVIDER_TOKEN,
  GROQ_AI_PROVIDER_TOKEN,
  INTENT_HANDLERS_TOKEN,
} from './constants/ai.const';
import { ChainAiProvider } from './provider/chain-ai.provider';

@Module({
  imports: [ProductsModule],
  controllers: [AiController],
  providers: [
    {
      provide: GROQ_AI_PROVIDER_TOKEN,
      useClass: GroqProvider,
    },
    {
      provide: AI_PROVIDER_TOKEN,
      useClass: ChainAiProvider,
    },
    BeerRecommendationHandler,
    OffTopicHandler,
    {
      provide: INTENT_HANDLERS_TOKEN,
      useFactory: (
        beerHandler: BeerRecommendationHandler,
        offTopicHandler: OffTopicHandler,
      ): IntentHandlerInterface[] => {
        return [beerHandler, offTopicHandler];
      },
      inject: [BeerRecommendationHandler, OffTopicHandler],
    },
    IntentHandlerFactory,
    AiService,
  ],
})
export class AiModule {}
