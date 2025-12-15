import { TYPES } from '@utils/constants/db-entity-names';
import { ProductTypes } from '@utils/enums';
import { getHandleDuplicateKeyError } from '@utils/mongodb/handle-unique';
import { Schema, model } from 'mongoose';

export interface Type {
  name: string;
  productType: ProductTypes;
}

const TypeSchema = new Schema<Type>(
  {
    name: { type: String, maxLength: 250, unique: true, trim: true, required: true },
    productType: {
      type: String,
      enum: Object.values(ProductTypes),
      trim: true,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const handleDuplicateKeyError = getHandleDuplicateKeyError<Type>('Type', 'name');

TypeSchema.post('save', handleDuplicateKeyError);
TypeSchema.post('findOneAndUpdate', handleDuplicateKeyError);
TypeSchema.post('updateOne', handleDuplicateKeyError);
TypeSchema.post('updateMany', handleDuplicateKeyError);
TypeSchema.post('insertMany', handleDuplicateKeyError);

export const TypesModel = model<Type>(TYPES, TypeSchema);
