import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import { ProductFinder } from '../ports';
import { AiProvider } from '../ports';
export declare class PairingRecommendationHandler implements IntentHandler {
  private readonly aiProvider;
  private readonly productFinder;
  constructor(aiProvider: AiProvider, productFinder: ProductFinder);
  canHandle(intent: Intent): boolean;
  handle(query: string): Promise<string>;
  private getPairingQuery;
}
//# sourceMappingURL=pairing-recommendation.handler.d.ts.map
