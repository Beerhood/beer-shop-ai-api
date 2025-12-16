import { Inject, Injectable } from '@nestjs/common';
import { AI_ASSISTANT_TOKEN } from './constants/ai.const';
import { AiService as AiServiceInterface } from './interfaces/ai-service.interface';
import { AiAssistant, AiAssistantResponse } from 'ai-assistant';

@Injectable()
export class AiService implements AiServiceInterface {
  constructor(
    @Inject(AI_ASSISTANT_TOKEN)
    private readonly ai: AiAssistant,
  ) {}

  async askSomething(userPrompt: string): Promise<AiAssistantResponse> {
    return this.ai.ask(userPrompt);
  }
}
