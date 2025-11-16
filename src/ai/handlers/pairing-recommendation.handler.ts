import { Inject, Injectable } from '@nestjs/common';
import { IntentHandlerInterface } from '../interfaces/intent-handler.interface';
import { Intent } from '../ai.service';
import { ProductsService, ProductTypes } from 'src/products/products.service';
import { AiProviderInterface } from '../provider/ai-provider.interface';
import { AI_PROVIDER_TOKEN } from '../constants/ai.const';
import { getBeerCriteriaPrompt } from '../prompts/beer-recommendation.prompts';
import { getSnackCriteriaPrompt } from '../prompts/snack-recommendation.prompts';
import {
  getPairingCriteriaPrompt,
  synthesizePairingSuccessResponsePrompt,
} from '../prompts/pairing-recommendation.prompts';
import { BeerSearchCriteria } from './beer-recommendation.handler';
import { SnackSearchCriteria } from './snack-recommendation.handler';

@Injectable()
export class PairingRecommendationHandler implements IntentHandlerInterface {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AiProviderInterface,
    private readonly productsService: ProductsService,
  ) {}

  canHandle(intent: Intent): boolean {
    return intent === 'PAIRING_RECOMMENDATION';
  }

  async handle(query: string): Promise<string> {
    const pairingQuery = await this.getPairingQuery(query);
    const beerCriteriaPrompt = getBeerCriteriaPrompt(pairingQuery.beerQuery);
    const beerCriteriaString = await this.aiProvider.getCompletion(beerCriteriaPrompt);
    const beerCriteria = JSON.parse(beerCriteriaString) as BeerSearchCriteria;
    const foundBeers = await this.productsService.findRecommended(
      beerCriteria,
      ProductTypes.BEER,
      1,
    );

    if (foundBeers.length === 0) {
      return `{"message": "На жаль, я не зміг знайти пиво за вашим запитом: ${pairingQuery.beerQuery}. Спробуйте щось інше."}`;
    }
    const beer = foundBeers[0];
    const snackCriteriaPrompt = getSnackCriteriaPrompt(pairingQuery.snackQuery);
    const snackCriteriaString = await this.aiProvider.getCompletion(snackCriteriaPrompt);
    const snackCriteria = JSON.parse(snackCriteriaString) as SnackSearchCriteria;
    const foundSnacks = await this.productsService.findRecommended(
      snackCriteria,
      ProductTypes.SNACK,
      1,
    );

    if (foundSnacks.length === 0) {
      return `{"message": "Я знайшов для вас чудове пиво, ${beer.name}, але, на жаль, не зміг підібрати снек за запитом: ${pairingQuery.snackQuery}."}`;
    }
    const snack = foundSnacks[0];
    const finalPrompt = synthesizePairingSuccessResponsePrompt(beer, snack, query);
    return this.aiProvider.getCompletion(finalPrompt);
  }

  private async getPairingQuery(query: string): Promise<{ beerQuery: string; snackQuery: string }> {
    const prompt = getPairingCriteriaPrompt(query);
    const responseString = await this.aiProvider.getCompletion(prompt);
    try {
      return JSON.parse(responseString) as { beerQuery: string; snackQuery: string };
    } catch {
      throw new Error('AI returned malformed pairing query.');
    }
  }
}
