import { Product } from '../ports';
import { SnackSearchCriteria } from '../domain/interfaces/ai.interfaces';
export declare const getSnackCriteriaPrompt: (query: string) => string;
export declare const synthesizeSnackSuccessResponsePrompt: (
  products: Product[],
  query: string,
) => string;
export declare const handleSnackNotFoundPrompt: (
  query: string,
  criteria: SnackSearchCriteria,
) => string;
//# sourceMappingURL=snack-recommendation.prompts.d.ts.map
