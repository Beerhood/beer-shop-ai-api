import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import { ProductFinder } from '../ports';
import { AiProvider } from '../ports';
export interface SnackSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    flavor?: string[];
  };
}
export declare class SnackRecommendationHandler implements IntentHandler {
  private readonly aiProvider;
  private readonly productFinder;
  constructor(aiProvider: AiProvider, productFinder: ProductFinder);
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
  private getSnackCriteriaFromAi;
  private synthesizeSuccessResponse;
  private handleNotFound;
}
//# sourceMappingURL=snack-recommendation.handler.d.ts.map
