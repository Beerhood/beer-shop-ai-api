import { Injectable } from '@nestjs/common';
import { AiProvider } from 'ai-assistant-lib/src/ports';

@Injectable()
export class ChainAiService implements AiProvider {
  constructor(private readonly providers: AiProvider[]) {}

  async getCompletion(prompt: string): Promise<string> {
    for (const provider of this.providers) {
      try {
        return await provider.getCompletion(prompt);
      } catch (error) {
        console.warn(`Provider ${provider.constructor.name} failed. Trying next...`, error);
      }
    }
    throw new Error('All AI providers failed to respond.');
  }
}
