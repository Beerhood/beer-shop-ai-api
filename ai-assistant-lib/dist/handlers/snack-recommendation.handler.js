'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SnackRecommendationHandler = void 0;
const ports_1 = require('../ports');
const snack_recommendation_prompts_1 = require('../prompts/snack-recommendation.prompts');
class SnackRecommendationHandler {
  constructor(aiProvider, productFinder) {
    this.aiProvider = aiProvider;
    this.productFinder = productFinder;
  }
  canHandle(intent) {
    return intent === 'SNACK_RECOMMENDATION';
  }
  async handle(query) {
    const criteria = await this.getSnackCriteriaFromAi(query);
    const foundProducts = await this.productFinder.findRecommended(
      criteria,
      ports_1.ProductTypes.SNACK,
      3,
    );
    if (foundProducts.length === 0) {
      return this.handleNotFound(query, criteria);
    }
    return this.synthesizeSuccessResponse(foundProducts, query);
  }
  async getSnackCriteriaFromAi(query) {
    const prompt = (0, snack_recommendation_prompts_1.getSnackCriteriaPrompt)(query);
    const responseString = await this.aiProvider.getCompletion(prompt);
    try {
      return JSON.parse(responseString);
    } catch {
      throw new Error('AI returned malformed criteria for snack.');
    }
  }
  async synthesizeSuccessResponse(products, query) {
    const prompt = (0, snack_recommendation_prompts_1.synthesizeSnackSuccessResponsePrompt)(
      products,
      query,
    );
    return this.aiProvider.getCompletion(prompt);
  }
  async handleNotFound(query, criteria) {
    const prompt = (0, snack_recommendation_prompts_1.handleSnackNotFoundPrompt)(query, criteria);
    return this.aiProvider.getCompletion(prompt);
  }
}
exports.SnackRecommendationHandler = SnackRecommendationHandler;
//# sourceMappingURL=snack-recommendation.handler.js.map
