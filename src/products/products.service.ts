import { Injectable } from '@nestjs/common';
import { BeerSearchCriteria } from 'src/ai/handlers/beer-recommendation.handler';

export interface ProductTypeInfo {
  _id: number;
  name: string; // Beer: 'Dark flavored beer', Snack: 'chips'
  productType: ProductTypes;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetails {
  style?: string; // Snack too (Salty, Spicy, Sweet)
  country?: string; // Snack too
  ABV?: number;
  IBU?: number;
  OG?: number;
  brand?: string; // Snack too
}

export interface Product {
  _id: number;
  name: string;
  description: string;
  type: ProductTypeInfo;
  price: number;
  productType: ProductTypes;
  details: ProductDetails;
  createdAt: string;
  updatedAt: string;
}

export enum ProductTypes {
  BEER = 'Beer',
  SNACK = 'Snack',
}

const database: Product[] = [
  {
    _id: 101,
    name: 'Classic Pilsner',
    description:
      "Хрусткий, освіжаючий світлий лагер із м'якою хмельовою гіркотою та чистим післясмаком.",
    type: {
      _id: 1001,
      name: 'Pilsner',
      productType: ProductTypes.BEER,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 45.0,
    productType: ProductTypes.BEER,
    details: {
      style: 'Czech Pilsner',
      country: 'Czech Republic',
      ABV: 4.8,
      IBU: 35,
      OG: 1.048,
      brand: 'Staropramen',
    },
    createdAt: '2025-11-16T15:00:00.000Z',
    updatedAt: '2025-11-16T15:00:00.000Z',
  },

  // 2. ІРА (IPA)
  {
    _id: 102,
    name: 'Hoppy West Coast IPA',
    description:
      'Інтенсивний, цитрусовий аромат із сильною, але збалансованою хмельовою гіркотою. Справжній американський стиль.',
    type: {
      _id: 1002,
      name: 'India Pale Ale',
      productType: ProductTypes.BEER,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 90.0,
    productType: ProductTypes.BEER,
    details: {
      style: 'West Coast IPA',
      country: 'USA',
      ABV: 6.9,
      IBU: 70,
      OG: 1.065,
      brand: 'Stone Brewing',
    },
    createdAt: '2025-11-16T15:05:00.000Z',
    updatedAt: '2025-11-16T15:05:00.000Z',
  },

  // 3. Пшеничне (Wheat Beer)
  {
    _id: 103,
    name: 'Bavarian Hefe-Weizen',
    description:
      'Класичне німецьке пшеничне пиво з нотами банана та гвоздики, отриманими від спеціальних дріжджів.',
    type: {
      _id: 1003,
      name: 'Wheat Beer',
      productType: ProductTypes.BEER,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 75.0,
    productType: ProductTypes.BEER,
    details: {
      style: 'Hefe-Weizen',
      country: 'Germany',
      ABV: 5.2,
      IBU: 15,
      OG: 1.05,
      brand: 'Paulaner',
    },
    createdAt: '2025-11-16T15:10:00.000Z',
    updatedAt: '2025-11-16T15:10:00.000Z',
  },

  // 4. Стаут (Stout)
  {
    _id: 104,
    name: 'Chocolate Milk Stout',
    description:
      'Темне, солодке пиво з виразними тонами молочного шоколаду та легкою паленою гіркотою.',
    type: {
      _id: 1004,
      name: 'Dark Beer',
      productType: ProductTypes.BEER,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 110.0,
    productType: ProductTypes.BEER,
    details: {
      style: 'Milk Stout',
      country: 'UK',
      ABV: 6.0,
      IBU: 25,
      OG: 1.068,
      brand: 'Samuel Smith',
    },
    createdAt: '2025-11-16T15:15:00.000Z',
    updatedAt: '2025-11-16T15:15:00.000Z',
  },

  // 5. Кисляк (Sour)
  {
    _id: 105,
    name: 'Raspberry Gose',
    description:
      'Низькоалкогольний, освіжаючий кислий ель із додаванням малини. Ідеальний для літньої спеки.',
    type: {
      _id: 1005,
      name: 'Sour Ale',
      productType: ProductTypes.BEER,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 95.0,
    productType: ProductTypes.BEER,
    details: {
      style: 'Fruited Gose',
      country: 'Belgium',
      ABV: 4.2,
      IBU: 10,
      OG: 1.04,
      brand: 'Lindemans',
    },
    createdAt: '2025-11-16T15:20:00.000Z',
    updatedAt: '2025-11-16T15:20:00.000Z',
  },

  // --- СНЕКИ (SNACK) ---

  // 6. Чипси (Salty)
  {
    _id: 201,
    name: 'Sea Salt & Cider Vinegar Crisps',
    description:
      'Хрусткі картопляні чипси з виразним кислим смаком оцту, що відмінно контрастує з солодкуватими елями.',
    type: {
      _id: 2001,
      name: 'Potato Chips',
      productType: ProductTypes.SNACK,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 35.0,
    productType: ProductTypes.SNACK,
    details: {
      style: 'Salty/Sour',
      country: 'UK',
      brand: 'Tyrrells',
    },
    createdAt: '2025-11-16T15:25:00.000Z',
    updatedAt: '2025-11-16T15:25:00.000Z',
  },

  // 7. Горішки (Salty)
  {
    _id: 202,
    name: 'Spicy Wasabi Peanuts',
    description:
      'Хрусткий арахіс у глазурі з васабі. Додає гостроти та зігріває, гарно пасує до міцного пива.',
    type: {
      _id: 2002,
      name: 'Nuts',
      productType: ProductTypes.SNACK,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 55.0,
    productType: ProductTypes.SNACK,
    details: {
      style: 'Spicy',
      country: 'Japan',
      brand: 'Kameida',
    },
    createdAt: '2025-11-16T15:30:00.000Z',
    updatedAt: '2025-11-16T15:30:00.000Z',
  },

  // 8. Сухарики (Salty/Savory)
  {
    _id: 203,
    name: 'Garlic Rye Croutons',
    description:
      'Ароматні житні сухарики з насиченим часниковим смаком. Класичний супровід до лагерів.',
    type: {
      _id: 2003,
      name: 'Croutons',
      productType: ProductTypes.SNACK,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 30.0,
    productType: ProductTypes.SNACK,
    details: {
      style: 'Savory/Garlic',
      country: 'Ukraine',
      brand: 'Flint',
    },
    createdAt: '2025-11-16T15:35:00.000Z',
    updatedAt: '2025-11-16T15:35:00.000Z',
  },

  // 9. М'ясний снек (Savory)
  {
    _id: 204,
    name: 'Classic Beef Jerky',
    description:
      "Тонкі скибочки в'яленої яловичини з легкою солодкувато-соленою глазур'ю. Ідеально підходить до IPA та портерів.",
    type: {
      _id: 2004,
      name: 'Jerky',
      productType: ProductTypes.SNACK,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 150.0,
    productType: ProductTypes.SNACK,
    details: {
      style: 'Savory/Meaty',
      country: 'USA',
      brand: "Jack Link's",
    },
    createdAt: '2025-11-16T15:40:00.000Z',
    updatedAt: '2025-11-16T15:40:00.000Z',
  },

  // 10. Сирний снек (Salty/Savory)
  {
    _id: 205,
    name: 'Aged Cheddar Cheese Puffs',
    description:
      "Хрусткі сирні кульки з насиченим смаком витриманого чеддеру. Добре поєднується з м'якими елями.",
    type: {
      _id: 2005,
      name: 'Cheese Snacks',
      productType: ProductTypes.SNACK,
      createdAt: '2025-11-15T10:00:00.000Z',
      updatedAt: '2025-11-15T10:00:00.000Z',
    },
    price: 40.0,
    productType: ProductTypes.SNACK,
    details: {
      style: 'Cheesy/Savory',
      country: 'Netherlands',
      brand: 'Cheetos',
    },
    createdAt: '2025-11-16T15:45:00.000Z',
    updatedAt: '2025-11-16T15:45:00.000Z',
  },
];

@Injectable()
export class ProductsService {
  // MUST BE REPLACED WITH NORMAL IMPLEMENTATION
  /**
   * Finds recommended products based on criteria from AI.
   * @param criteria - Object with search criteria.
   * @param productType - Product type to search for (eg. ‘Beer’).
   * @param limit - Maximum number of products to return.
   * @returns Array of found products.
   */
  /*eslint-disable-next-line @typescript-eslint/require-await*/
  async findRecommended(
    criteria: BeerSearchCriteria,
    productType: ProductTypes,
    limit: number,
  ): Promise<Product[]> {
    const filteredProducts = database.filter((product) => {
      if (product.productType !== productType) {
        return false;
      }
      if (
        criteria.style?.length &&
        (!product.details.style || !criteria.style.includes(product.details.style))
      ) {
        return false;
      }
      if (
        criteria.country?.length &&
        (!product.details.country || !criteria.country.includes(product.details.country))
      ) {
        return false;
      }
      if (
        criteria.brand?.length &&
        (!product.details.brand || !criteria.brand.includes(product.details.brand))
      ) {
        return false;
      }
      if (criteria.minABV && (!product.details.ABV || product.details.ABV < criteria.minABV)) {
        return false;
      }
      if (criteria.maxABV && (!product.details.ABV || product.details.ABV > criteria.maxABV)) {
        return false;
      }
      if (criteria.minIBU && (!product.details.IBU || product.details.IBU < criteria.minIBU)) {
        return false;
      }
      if (criteria.maxIBU && (!product.details.IBU || product.details.IBU > criteria.maxIBU)) {
        return false;
      }
      if (criteria.OG && (!product.details.OG || product.details.OG < criteria.OG)) {
        return false;
      }

      return true;
    });

    return filteredProducts.slice(0, limit);
  }
}
