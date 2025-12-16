'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AiAssistant = void 0;
const intent_analysis_prompt_1 = require('./prompts/intent-analysis.prompt');
const intent_handler_factory_1 = require('./handlers/intent-handler.factory');
const beer_recommendation_handler_1 = require('./handlers/beer-recommendation.handler');
const snack_recommendation_handler_1 = require('./handlers/snack-recommendation.handler');
const pairing_recommendation_handler_1 = require('./handlers/pairing-recommendation.handler');
const general_knowledge_handler_1 = require('./handlers/general-knowledge.handler');
const off_topic_handler_1 = require('./handlers/off-topic.handler');
class AiAssistant {
  constructor(aiProvider, productFinder) {
    this.aiProvider = aiProvider;
    const handlers = [
      new beer_recommendation_handler_1.BeerRecommendationHandler(aiProvider, productFinder),
      new snack_recommendation_handler_1.SnackRecommendationHandler(aiProvider, productFinder),
      new pairing_recommendation_handler_1.PairingRecommendationHandler(aiProvider, productFinder),
      new general_knowledge_handler_1.GeneralKnowledgeHandler(aiProvider),
      new off_topic_handler_1.OffTopicHandler(),
    ];
    this.handlerFactory = new intent_handler_factory_1.IntentHandlerFactory(handlers);
  }
  async ask(userPrompt) {
    const intentResponse = await this.analyzeIntent(userPrompt);
    const handler = this.handlerFactory.findHandler(intentResponse.intent);
    const messageJson = await handler.handle(intentResponse.query);
    try {
      const messageObj = JSON.parse(messageJson);
      return { message: messageObj.message };
    } catch (e) {
      return { message: messageJson };
    }
  }
  async analyzeIntent(userPrompt) {
    const prompt = (0, intent_analysis_prompt_1.createIntentAnalysisPrompt)(userPrompt);
    const responseString = await this.aiProvider.getCompletion(prompt);
    const parsedResponse = JSON.parse(responseString);
    if (!parsedResponse.intent || !parsedResponse.query) {
      throw new Error('Invalid JSON structure from AI for intent analysis');
    }
    return parsedResponse;
  }
}
exports.AiAssistant = AiAssistant;
//# sourceMappingURL=ai-assistant.js.map
