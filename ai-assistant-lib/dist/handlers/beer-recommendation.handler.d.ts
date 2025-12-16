import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import { AiProvider, ProductFinder } from '../ports';
export declare class BeerRecommendationHandler implements IntentHandler {
  private readonly aiProvider;
  private readonly productFinder;
  constructor(aiProvider: AiProvider, productFinder: ProductFinder);
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
  private getBeerCriteriaFromAi;
  private synthesizeSuccessResponse;
  private handleNotFound;
}
//# sourceMappingURL=beer-recommendation.handler.d.ts.map
