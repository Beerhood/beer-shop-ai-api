'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createIntentAnalysisPrompt = void 0;
const createIntentAnalysisPrompt = (userPrompt) => `
You are an intent analyzer for a beer e-commerce chatbot.
Analyze the user's request and determine their intent.
Respond ONLY with a valid JSON object with the following structure:
{
  "intent": "BEER_RECOMMENDATION" | "SNACK_RECOMMENDATION" | "PAIRING_RECOMMENDATION" | "GENERAL_KNOWLEDGE" | "OFF_TOPIC",
  "query": "string"
}
- intent: The primary user intent.
- query: The original user's query.

User request: "${userPrompt}"
`;
exports.createIntentAnalysisPrompt = createIntentAnalysisPrompt;
//# sourceMappingURL=intent-analysis.prompt.js.map
