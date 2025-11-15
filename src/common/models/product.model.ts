import { Schema, model } from 'mongoose';
import { Types } from 'mongoose';
import { ProductTypes } from '@utils/enums';

export interface Product {
  name: string;
  image: string;
  description: string;
  type: Types.ObjectId | string;
  price: number;
  productType: ProductTypes;
  details: {
    country?: string;
    ABV?: number;
    flavour?: string;
  };
}

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, maxLength: 250, trim: true, required: true },
    image: { type: String, maxLength: 1000, trim: true, required: true },
    description: { type: String, maxLength: 3000, trim: true, required: true },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'Types',
      maxLength: 25,
      trim: true,
      required: true,
      index: true,
    },
    price: { type: Number, min: 0, max: 999999, required: true },
    productType: {
      type: String,
      enum: Object.values(ProductTypes),
      trim: true,
      required: true,
    },
    details: {
      type: {
        country: { type: String, maxLength: 250, trim: true, required: false },
        ABV: { type: Number, min: 0, max: 100, required: false },
        flavour: { type: String, maxLength: 250, trim: true, required: false },
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ProductsModel = model<Product>('Products', ProductSchema);
