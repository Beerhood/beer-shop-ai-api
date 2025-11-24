import { ProductTypes } from '@utils/enums';
import { createFilter } from '@utils/mongodb/create-filter';

export function createProductFilter(
  criteria: BeerSearchCriteria | SnackSearchCriteria,
  productType: ProductTypes,
) {
  const { details, ...rest } = criteria;
  if (!details) return { productType, ...rest };
  const detailsFilter = createFilter(details, 'details');
  return { ...rest, productType, ...detailsFilter };
}

// TODO : Remove after feat/ai-module merge
interface BeerSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    style?: string[];
    minABV?: number; // Міцність
    maxABV?: number;
    minIBU?: number; // Гіркота
    maxIBU?: number;
    OG?: number; // Початкова густина}
  };
}

interface SnackSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    flavor?: string[];
  };
}
