'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.synthesizePairingSuccessResponsePrompt = exports.getPairingCriteriaPrompt = void 0;
const getPairingCriteriaPrompt = (query) => `
You are an expert sommelier. A user wants a beer and a snack pairing.
Analyze the user's request and extract criteria for BOTH the beer and the snack.

Respond ONLY with a valid JSON object with the following structure:
{
  "beerQuery": "string",
  "snackQuery": "string"
}
'beerQuery' should contain only the part of the user's request related to beer.
'snackQuery' should contain only the part of the user's request related to the snack.

---
**EXAMPLE:**
**User request:** "хочу темний стаут і якісь солоні горішки до нього"
**Your response:**
{
  "beerQuery": "темний стаут",
  "snackQuery": "солоні горішки"
}
---

**CURRENT TASK:**
**User request:** "${query}"
**Your response:**
`;
exports.getPairingCriteriaPrompt = getPairingCriteriaPrompt;
const synthesizePairingSuccessResponsePrompt = (beer, snack, query) => `
You are a friendly and knowledgeable beer sommelier, BeerBot.
A user asked: "${query}".
Based on their request, I have found a perfect pairing:
- Beer: ${beer.title} (${beer.details.style})
- Snack: ${snack.title}

Your task is to present this pairing to the user.
Explain briefly why this beer and snack are a great match.
Keep the response conversational and engaging.

Respond ONLY with a valid JSON object: { "message": "string" }
`;
exports.synthesizePairingSuccessResponsePrompt = synthesizePairingSuccessResponsePrompt;
//# sourceMappingURL=pairing-recommendation.prompts.js.map
