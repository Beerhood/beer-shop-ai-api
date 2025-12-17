import { IntentHandler } from '../domain/interfaces/ai.interfaces';
import { Intent } from '../domain/types/ai.types';
import {
  getBeerCriteriaPrompt,
  handleNotFoundPrompt,
  synthesizeSuccessResponsePrompt,
} from '../prompts/beer-recommendation.prompts';
import { ProductTypes } from '../ports';
import { BeerSearchCriteria } from '../domain/interfaces/ai.interfaces';
import { Product, AiProvider, ProductFinder } from '../ports';

export class BeerRecommendationHandler implements IntentHandler {
  constructor(
    private readonly aiProvider: AiProvider,
    private readonly productFinder: ProductFinder,
  ) {}

  canHandle(intent: Intent): boolean {
    return intent === 'BEER_RECOMMENDATION';
  }

  async handle(query: string): Promise<string> {
    const criteria = await this.getBeerCriteriaFromAi(query);
    const foundProducts = await this.productFinder.findRecommended(criteria, ProductTypes.BEER, 3);
    if (foundProducts.length === 0) {
      return this.handleNotFound(query, criteria);
    }
    return this.synthesizeSuccessResponse(foundProducts, query);
  }

  private async getBeerCriteriaFromAi(query: string): Promise<BeerSearchCriteria> {
    const prompt = getBeerCriteriaPrompt(query);
    const responseString = await this.aiProvider.getCompletion(prompt);
    try {
      return JSON.parse(responseString) as BeerSearchCriteria;
    } catch {
      throw new Error('AI returned malformed criteria.');
    }
  }

  private async synthesizeSuccessResponse(products: Product[], query: string): Promise<string> {
    const prompt = synthesizeSuccessResponsePrompt(products, query);
    return this.aiProvider.getCompletion(prompt);
  }

  private async handleNotFound(query: string, criteria: BeerSearchCriteria): Promise<string> {
    const prompt = handleNotFoundPrompt(query, criteria);
    return this.aiProvider.getCompletion(prompt);
  }
}
