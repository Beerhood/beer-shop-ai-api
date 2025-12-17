import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ProductsModule } from '../products/products.module';
import { ProductFinderAdapter } from './providers/product.adapter';
import { GroqProvider } from './providers/groq.provider';
import { AiAssistant } from 'ai-assistant';
import { ChainAiService } from './providers/chain-ai.service';
import { AI_ASSISTANT_TOKEN, CHAIN_AI_PROVIDER_TOKEN } from './constants/ai.const';

@Module({
  imports: [ProductsModule],
  controllers: [AiController],
  providers: [
    AiService,
    GroqProvider,
    ProductFinderAdapter,
    {
      provide: CHAIN_AI_PROVIDER_TOKEN,
      useFactory: (groq: GroqProvider) => {
        const providers = [groq];
        return new ChainAiService(providers);
      },
      inject: [GroqProvider],
    },
    {
      provide: AI_ASSISTANT_TOKEN,
      useFactory: (aiProvider: ChainAiService, productFinder: ProductFinderAdapter) => {
        return new AiAssistant(aiProvider, productFinder);
      },
      inject: [CHAIN_AI_PROVIDER_TOKEN, ProductFinderAdapter],
    },
  ],
})
export class AiModule {}
