import { Product } from 'src/products/products.service';
import { SnackSearchCriteria } from '../handlers/snack-recommendation.handler';

export const getSnackCriteriaPrompt = (query: string): string => `
You are a food pairing expert. Analyze the user's request for a snack and convert it into a structured JSON object for a database search.

**Schema:**
{
  "category": ["string"],
  "flavorProfile": ["string"]
}

---
**EXAMPLES:**

**User request:** "хочу якісь гострі чіпси"
**Your response:**
{
  "category": ["chips"],
  "flavorProfile": ["spicy"]
}

**User request:** "є щось солоне до пива?"
**Your response:**
{
  "flavorProfile": ["salty"]
}
---

**CURRENT TASK:**

**User request:** "${query}"
**Your response:**
`;

export const synthesizeSnackSuccessResponsePrompt = (
  products: Product[],
  query: string,
): string => {
  const productInfo = products.map((p) => `- ${p.name}`).join('\n');
  return `
    You are a friendly food expert, BeerBot.
    A user asked for a snack: "${query}".
    I found these options:
    ${productInfo}

    Present these snacks to the user in a conversational way.

    Respond ONLY with a valid JSON object: { "message": "string" }
  `;
};

export const handleSnackNotFoundPrompt = (query: string, criteria: SnackSearchCriteria): string => {
  const criteriaString = JSON.stringify(criteria, null, 2);
  return `
    You are a friendly food expert, BeerBot.
    A user asked for a snack: "${query}".
    We searched with these criteria but found nothing:
    ${criteriaString}

    Politely inform the user and suggest they broaden their search (e.g., "any salty snack").

    Respond ONLY with a valid JSON object: { "message": "string" }
  `;
};
