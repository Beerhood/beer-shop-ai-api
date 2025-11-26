import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER_TOKEN } from './constants/ai.const';
import { AiProviderInterface } from './provider/ai-provider.interface';
import { AiAssistantResponse } from './interfaces/ai-assistant-response.interface';
import { AiServiceInterface } from './interfaces/ai-service.interface';
import { createIntentAnalysisPrompt } from './prompts/intent-analysis.prompt';
import { IntentHandlerFactory } from './handlers/intent-handler.factory';
import { Intent } from './constants/ai.const';

interface IntentAnalysisResponse {
  intent: Intent;
  query: string;
}

@Injectable()
export class AiService implements AiServiceInterface {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AiProviderInterface,
    private readonly handlerFactory: IntentHandlerFactory,
  ) {}

  async askSomething(userPrompt: string): Promise<AiAssistantResponse> {
    const intentResponse = await this.analyzeIntent(userPrompt);
    const handler = this.handlerFactory.findHandler(intentResponse.intent);
    const message = await handler.handle(intentResponse.query);
    return { message };
  }

  private async analyzeIntent(userPrompt: string): Promise<IntentAnalysisResponse> {
    const prompt = createIntentAnalysisPrompt(userPrompt);
    const responseString = await this.aiProvider.getCompletion(prompt);
    const parsedResponse = JSON.parse(responseString) as IntentAnalysisResponse;
    if (!parsedResponse.intent || !parsedResponse.query) {
      throw new Error('Invalid JSON structure from AI');
    }
    return parsedResponse;
  }
}
