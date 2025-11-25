import { Injectable, Inject } from '@nestjs/common';
import { AiProviderInterface } from './ai-provider.interface';
import { GROQ_AI_PROVIDER_TOKEN } from '../constants/ai.const';

@Injectable()
export class ChainAiService implements AiProviderInterface {
  private readonly providers: AiProviderInterface[];
  constructor(
    @Inject(GROQ_AI_PROVIDER_TOKEN)
    private readonly groqProvider: AiProviderInterface,
  ) {
    this.providers = [this.groqProvider];
  }

  async getCompletion(prompt: string): Promise<string> {
    for (const provider of this.providers) {
      try {
        return await provider.getCompletion(prompt);
      } catch {
        throw new Error('Provider failed to respond. Trying next provider...');
      }
    }
    throw new Error('All AI providers failed to respond.');
  }
}
