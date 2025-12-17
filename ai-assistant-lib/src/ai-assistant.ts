import { AiProvider, ProductFinder } from './ports';
import { AiAssistantResponse, IntentAnalysisResponse } from './domain/interfaces/ai.interfaces';
import { createIntentAnalysisPrompt } from './prompts/intent-analysis.prompt';
import { IntentHandlerFactory } from './handlers/intent-handler.factory';
import { BeerRecommendationHandler } from './handlers/beer-recommendation.handler';
import { SnackRecommendationHandler } from './handlers/snack-recommendation.handler';
import { PairingRecommendationHandler } from './handlers/pairing-recommendation.handler';
import { GeneralKnowledgeHandler } from './handlers/general-knowledge.handler';
import { OffTopicHandler } from './handlers/off-topic.handler';

export class AiAssistant {
  private readonly handlerFactory: IntentHandlerFactory;

  constructor(
    private readonly aiProvider: AiProvider,
    productFinder: ProductFinder,
  ) {
    const handlers = [
      new BeerRecommendationHandler(aiProvider, productFinder),
      new SnackRecommendationHandler(aiProvider, productFinder),
      new PairingRecommendationHandler(aiProvider, productFinder),
      new GeneralKnowledgeHandler(aiProvider),
      new OffTopicHandler(),
    ];
    this.handlerFactory = new IntentHandlerFactory(handlers);
  }

  public async ask(userPrompt: string): Promise<AiAssistantResponse> {
    const intentResponse = await this.analyzeIntent(userPrompt);
    const handler = this.handlerFactory.findHandler(intentResponse.intent);
    const messageJson = await handler.handle(intentResponse.query);

    try {
      const messageObj = JSON.parse(messageJson);
      return { message: messageObj.message };
    } catch (_e) {
      return { message: messageJson };
    }
  }

  private async analyzeIntent(userPrompt: string): Promise<IntentAnalysisResponse> {
    const prompt = createIntentAnalysisPrompt(userPrompt);
    const responseString = await this.aiProvider.getCompletion(prompt);
    const parsedResponse = JSON.parse(responseString) as IntentAnalysisResponse;
    if (!parsedResponse.intent || !parsedResponse.query) {
      throw new Error('Invalid JSON structure from AI for intent analysis');
    }
    return parsedResponse;
  }
}
