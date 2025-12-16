import { Product } from '../ports';
import { BeerSearchCriteria } from '../domain/interfaces/ai.interfaces';
export declare const getBeerCriteriaPrompt: (userPrompt: string) => string;
export declare const synthesizeSuccessResponsePrompt: (
  products: Product[],
  query: string,
) => string;
export declare const handleNotFoundPrompt: (query: string, criteria: BeerSearchCriteria) => string;
//# sourceMappingURL=beer-recommendation.prompts.d.ts.map
