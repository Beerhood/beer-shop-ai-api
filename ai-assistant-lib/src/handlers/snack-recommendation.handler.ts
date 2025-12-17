import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import { ProductFinder } from '../ports';
import { ProductTypes } from '../ports';
import { AiProvider } from '../ports';
import {
  getSnackCriteriaPrompt,
  handleSnackNotFoundPrompt,
  synthesizeSnackSuccessResponsePrompt,
} from '../prompts/snack-recommendation.prompts';

export interface SnackSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    flavor?: string[];
  };
}

export class SnackRecommendationHandler implements IntentHandler {
  constructor(
    private readonly aiProvider: AiProvider,
    private readonly productFinder: ProductFinder,
  ) {}

  canHandle(intent: Intent): boolean {
    return intent === 'SNACK_RECOMMENDATION';
  }

  async handle(query: string): Promise<string> {
    const criteria = await this.getSnackCriteriaFromAi(query);
    const foundProducts = await this.productFinder.findRecommended(criteria, ProductTypes.SNACK, 3);

    if (foundProducts.length === 0) {
      return this.handleNotFound(query, criteria);
    }

    return this.synthesizeSuccessResponse(foundProducts, query);
  }

  private async getSnackCriteriaFromAi(query: string): Promise<SnackSearchCriteria> {
    const prompt = getSnackCriteriaPrompt(query);
    const responseString = await this.aiProvider.getCompletion(prompt);
    try {
      return JSON.parse(responseString) as SnackSearchCriteria;
    } catch {
      throw new Error('AI returned malformed criteria for snack.');
    }
  }

  private async synthesizeSuccessResponse(products: any[], query: string): Promise<string> {
    const prompt = synthesizeSnackSuccessResponsePrompt(products, query);
    return this.aiProvider.getCompletion(prompt);
  }

  private async handleNotFound(query: string, criteria: SnackSearchCriteria): Promise<string> {
    const prompt = handleSnackNotFoundPrompt(query, criteria);
    return this.aiProvider.getCompletion(prompt);
  }
}
