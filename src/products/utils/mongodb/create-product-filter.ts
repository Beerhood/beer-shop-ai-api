import { ProductTypes } from '@utils/enums';
import { createFilter } from '@utils/mongodb/create-filter';
import { BeerSearchCriteria, SnackSearchCriteria } from 'src/ai/interfaces/ai-search.interface';

export function createProductFilter(
  criteria: BeerSearchCriteria | SnackSearchCriteria,
  productType: ProductTypes,
) {
  const { details, ...rest } = criteria;
  if (!details) return { productType, ...rest };
  const detailsFilter = createFilter(details, 'details');
  return { ...rest, productType, ...detailsFilter };
}
