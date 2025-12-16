'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.BeerRecommendationHandler = void 0;
const beer_recommendation_prompts_1 = require('../prompts/beer-recommendation.prompts');
const ports_1 = require('../ports');
class BeerRecommendationHandler {
  constructor(aiProvider, productFinder) {
    this.aiProvider = aiProvider;
    this.productFinder = productFinder;
  }
  canHandle(intent) {
    return intent === 'BEER_RECOMMENDATION';
  }
  async handle(query) {
    const criteria = await this.getBeerCriteriaFromAi(query);
    const foundProducts = await this.productFinder.findRecommended(
      criteria,
      ports_1.ProductTypes.BEER,
      3,
    );
    if (foundProducts.length === 0) {
      return this.handleNotFound(query, criteria);
    }
    return this.synthesizeSuccessResponse(foundProducts, query);
  }
  async getBeerCriteriaFromAi(query) {
    const prompt = (0, beer_recommendation_prompts_1.getBeerCriteriaPrompt)(query);
    const responseString = await this.aiProvider.getCompletion(prompt);
    try {
      return JSON.parse(responseString);
    } catch {
      throw new Error('AI returned malformed criteria.');
    }
  }
  async synthesizeSuccessResponse(products, query) {
    const prompt = (0, beer_recommendation_prompts_1.synthesizeSuccessResponsePrompt)(
      products,
      query,
    );
    return this.aiProvider.getCompletion(prompt);
  }
  async handleNotFound(query, criteria) {
    const prompt = (0, beer_recommendation_prompts_1.handleNotFoundPrompt)(query, criteria);
    return this.aiProvider.getCompletion(prompt);
  }
}
exports.BeerRecommendationHandler = BeerRecommendationHandler;
//# sourceMappingURL=beer-recommendation.handler.js.map
