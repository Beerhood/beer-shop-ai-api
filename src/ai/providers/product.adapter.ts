import { Injectable } from '@nestjs/common';
import { ProductFinder, Product } from 'ai-assistant-lib/src/ports';
import { ProductsService } from '../../products/products.service';
import { ProductTypes } from '@utils/enums';

@Injectable()
export class ProductFinderAdapter implements ProductFinder {
  constructor(private readonly productsService: ProductsService) {}

  async findRecommended(criteria: any, productType: string, count: number): Promise<Product[]> {
    const products = await this.productsService.findRecommended(
      criteria,
      productType as ProductTypes,
      count,
    );
    return products.map((p) => ({ ...p, type: p.type.toString() }));
  }
}
