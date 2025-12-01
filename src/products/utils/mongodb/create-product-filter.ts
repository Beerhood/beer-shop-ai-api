import { ProductTypes } from '@utils/enums';
import { createFilter } from '@utils/mongodb/create-filter';
import { BeerSearchCriteria } from 'src/ai/handlers/beer-recommendation.handler';
import { SnackSearchCriteria } from 'src/ai/handlers/snack-recommendation.handler';

export function createProductFilter(
  criteria: BeerSearchCriteria | SnackSearchCriteria,
  productType: ProductTypes,
) {
  const { details, ...rest } = criteria;
  if (!details) return { productType, ...rest };
  const detailsFilter = createFilter(details, 'details');
  return { ...rest, productType, ...detailsFilter };
}
