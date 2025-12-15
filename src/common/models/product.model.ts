import mongoose, { Schema, model } from 'mongoose';
import { Types } from 'mongoose';
import { ProductTypes } from '@utils/enums';
import { NONEXISTENT_RELATION_ERROR } from '@utils/constants/db-errors';
import { PRODUCTS } from '@utils/constants/db-entity-names';

export interface Product {
  title: string;
  image: string;
  description: string;
  type: Types.ObjectId | string;
  price: number;
  productType: ProductTypes;
  brand: string;
  country: string;
  details: {
    ABV?: number; // Alcohol By Volume, measure of the amount of pure alcohol
    IBU?: number; // International Bitterness Units, measure of a beer's bitterness
    OG?: number; // Original Gravity, measure of the density of wort before yeast is added for fermentation
    flavor?: string;
    style?: string;
  };
}

const ProductSchema = new Schema<Product>(
  {
    title: { type: String, maxLength: 250, trim: true, required: true },
    image: { type: String, maxLength: 1000, trim: true, required: true },
    description: { type: String, maxLength: 3000, trim: true, required: true },
    brand: { type: String, maxLength: 250, trim: true, required: true },
    country: { type: String, maxLength: 250, trim: true, required: true },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'Types',
      required: true,
      index: true,
      validate: {
        validator: async function (v) {
          const type: unknown = await mongoose.model('Types').findById(v);
          return !!type;
        },
        type: NONEXISTENT_RELATION_ERROR,
        message: `Trying to set nonexistent Type to product`,
      },
    },
    price: { type: Number, min: 0, max: 999999, required: true },
    productType: {
      type: String,
      enum: Object.values(ProductTypes),
      trim: true,
      required: true,
    },
    details: {
      _id: false,
      ABV: { type: Number, min: 0, max: 100, required: false },
      IBU: { type: Number, min: 3, max: 100, required: false },
      OG: { type: Number, min: 1.0, max: 1.1, required: false },
      style: { type: String, maxLength: 100, trim: true, required: false },
      flavor: { type: String, maxLength: 100, trim: true, required: false },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ProductsModel = model<Product>(PRODUCTS, ProductSchema);
