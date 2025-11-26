import { Inject, Injectable } from '@nestjs/common';
import { IntentHandlerInterface } from '../interfaces/intent-handler.interface';
import { Intent } from '../constants/ai.const';
import { AiProviderInterface } from '../provider/ai-provider.interface';
import { AI_PROVIDER_TOKEN } from '../constants/ai.const';
import { createGeneralKnowledgePrompt } from '../prompts/general-knowledge.prompt';

@Injectable()
export class GeneralKnowledgeHandler implements IntentHandlerInterface {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AiProviderInterface,
  ) {}

  canHandle(intent: Intent): boolean {
    return intent === 'GENERAL_KNOWLEDGE';
  }

  async handle(query: string): Promise<string> {
    const prompt = createGeneralKnowledgePrompt(query);
    return this.aiProvider.getCompletion(prompt);
  }
}
