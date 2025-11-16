import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await*/
  async findRecommended(criteria: any, category: string, limit: number): Promise<any[]> {
    return [];
  }
}
