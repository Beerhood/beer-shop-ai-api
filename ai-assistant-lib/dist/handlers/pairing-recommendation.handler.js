'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PairingRecommendationHandler = void 0;
const ports_1 = require('../ports');
const beer_recommendation_prompts_1 = require('../prompts/beer-recommendation.prompts');
const snack_recommendation_prompts_1 = require('../prompts/snack-recommendation.prompts');
const pairing_recommendation_prompts_1 = require('../prompts/pairing-recommendation.prompts');
class PairingRecommendationHandler {
  constructor(aiProvider, productFinder) {
    this.aiProvider = aiProvider;
    this.productFinder = productFinder;
  }
  canHandle(intent) {
    return intent === 'PAIRING_RECOMMENDATION';
  }
  async handle(query) {
    const pairingQuery = await this.getPairingQuery(query);
    const beerCriteriaPrompt = (0, beer_recommendation_prompts_1.getBeerCriteriaPrompt)(
      pairingQuery.beerQuery,
    );
    const beerCriteriaString = await this.aiProvider.getCompletion(beerCriteriaPrompt);
    const beerCriteria = JSON.parse(beerCriteriaString);
    const foundBeers = await this.productFinder.findRecommended(
      beerCriteria,
      ports_1.ProductTypes.BEER,
      1,
    );
    if (foundBeers.length === 0) {
      return `{"message": "На жаль, я не зміг знайти пиво за вашим запитом: ${pairingQuery.beerQuery}. Спробуйте щось інше."}`;
    }
    const beer = foundBeers[0];
    const snackCriteriaPrompt = (0, snack_recommendation_prompts_1.getSnackCriteriaPrompt)(
      pairingQuery.snackQuery,
    );
    const snackCriteriaString = await this.aiProvider.getCompletion(snackCriteriaPrompt);
    const snackCriteria = JSON.parse(snackCriteriaString);
    const foundSnacks = await this.productFinder.findRecommended(
      snackCriteria,
      ports_1.ProductTypes.SNACK,
      1,
    );
    if (foundSnacks.length === 0) {
      return `{"message": "Я знайшов для вас чудове пиво, ${beer.title}, але, на жаль, не зміг підібрати снек за запитом: ${pairingQuery.snackQuery}."}`;
    }
    const snack = foundSnacks[0];
    const finalPrompt = (0,
    pairing_recommendation_prompts_1.synthesizePairingSuccessResponsePrompt)(beer, snack, query);
    return this.aiProvider.getCompletion(finalPrompt);
  }
  async getPairingQuery(query) {
    const prompt = (0, pairing_recommendation_prompts_1.getPairingCriteriaPrompt)(query);
    const responseString = await this.aiProvider.getCompletion(prompt);
    try {
      return JSON.parse(responseString);
    } catch {
      throw new Error('AI returned malformed pairing query.');
    }
  }
}
exports.PairingRecommendationHandler = PairingRecommendationHandler;
//# sourceMappingURL=pairing-recommendation.handler.js.map
