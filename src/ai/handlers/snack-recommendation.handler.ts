import { Inject, Injectable } from '@nestjs/common';
import { IntentHandlerInterface } from '../interfaces/intent-handler.interface';
import { Intent } from '../constants/ai.const';
import { ProductsService } from 'src/products/products.service';
import { ProductTypes } from '@utils/enums';
import { AiProviderInterface } from '../provider/ai-provider.interface';
import { AI_PROVIDER_TOKEN } from '../constants/ai.const';
import {
  getSnackCriteriaPrompt,
  handleSnackNotFoundPrompt,
  synthesizeSnackSuccessResponsePrompt,
} from '../prompts/snack-recommendation.prompts';

export interface SnackSearchCriteria {
  style?: string[];
  country?: string[];
  brand?: string[];
}

@Injectable()
export class SnackRecommendationHandler implements IntentHandlerInterface {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AiProviderInterface,
    private readonly productsService: ProductsService,
  ) {}

  canHandle(intent: Intent): boolean {
    return intent === 'SNACK_RECOMMENDATION';
  }

  async handle(query: string): Promise<string> {
    const criteria = await this.getSnackCriteriaFromAi(query);
    const foundProducts = await this.productsService.findRecommended(
      criteria,
      ProductTypes.SNACK,
      3,
    );

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
