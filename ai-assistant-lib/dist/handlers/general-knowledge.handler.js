'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GeneralKnowledgeHandler = void 0;
const general_knowledge_prompt_1 = require('../prompts/general-knowledge.prompt');
class GeneralKnowledgeHandler {
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
  }
  canHandle(intent) {
    return intent === 'GENERAL_KNOWLEDGE';
  }
  async handle(query) {
    const prompt = (0, general_knowledge_prompt_1.createGeneralKnowledgePrompt)(query);
    return this.aiProvider.getCompletion(prompt);
  }
}
exports.GeneralKnowledgeHandler = GeneralKnowledgeHandler;
//# sourceMappingURL=general-knowledge.handler.js.map
