import { Injectable, Inject } from '@nestjs/common';
import { IntentHandlerInterface } from '../interfaces/intent-handler.interface';
import { Intent } from '../ai.service';
import { ProductsService } from 'src/products/products.service';
import { AiProviderInterface } from '../provider/ai-provider.interface';
import {
  getBeerCriteriaPrompt,
  handleNotFoundPrompt,
  synthesizeSuccessResponsePrompt,
} from '../prompts/beer-recommendation.prompts';
import { AI_PROVIDER_TOKEN } from '../constants/ai.const';
import { Product } from 'src/products/products.service';
import { ProductTypes } from 'src/products/products.service';

export interface BeerSearchCriteria {
  style?: string[];
  country?: string[];
  minABV?: number; // Міцність
  maxABV?: number;
  minIBU?: number; // Гіркота
  maxIBU?: number;
  OG?: number; // Початкова густина
  brand?: string[];
}

@Injectable()
export class BeerRecommendationHandler implements IntentHandlerInterface {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AiProviderInterface,
    private readonly productsService: ProductsService,
  ) {}

  canHandle(intent: Intent): boolean {
    return intent === 'BEER_RECOMMENDATION';
  }

  async handle(query: string): Promise<string> {
    const criteria = await this.getBeerCriteriaFromAi(query);
    const foundProducts = await this.productsService.findRecommended(
      criteria,
      ProductTypes.BEER,
      3,
    );

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
