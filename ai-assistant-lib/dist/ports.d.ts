import { BeerSearchCriteria, SnackSearchCriteria } from './domain/interfaces/ai.interfaces';
export declare enum ProductTypes {
  BEER = 'Beer',
  SNACK = 'Snack',
}
export interface Product {
  title: string;
  image: string;
  description: string;
  type: string;
  price: number;
  productType: ProductTypes;
  brand: string;
  country: string;
  details: {
    ABV?: number;
    IBU?: number;
    OG?: number;
    flavor?: string;
    style?: string;
  };
}
export interface ProductFinder {
  findRecommended(
    criteria: BeerSearchCriteria | SnackSearchCriteria,
    productType: ProductTypes,
    count: number,
  ): Promise<Product[]>;
}
export interface AiProvider {
  getCompletion(prompt: string): Promise<string>;
}
//# sourceMappingURL=ports.d.ts.map
