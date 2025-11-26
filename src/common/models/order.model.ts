import mongoose, { Schema, model } from 'mongoose';
import { Types } from 'mongoose';
import { OrderStatuses } from '@utils/enums';
import { NONEXISTENT_RELATION_ERROR } from '@utils/constants/db-errors';

export interface Order {
  user: Types.ObjectId | string;
  products: (Types.ObjectId | string)[];
  address: string;
  totalPrice: number;
  status: OrderStatuses;
}

const OrderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
      validate: {
        validator: async function (v) {
          const user: unknown = await mongoose.model('Users').findById(v);
          return !!user;
        },
        type: NONEXISTENT_RELATION_ERROR,
        message: `Trying to set nonexistent User to order`,
      },
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Products',
      required: true,
      index: true,
      validate: {
        validator: async function (v) {
          const product: unknown = await mongoose.model('Products').find({ _id: v });
          return !!product;
        },
        type: NONEXISTENT_RELATION_ERROR,
        message: `Trying to set nonexistent Product to order`,
      },
    },
    address: { type: String, maxLength: 1000, trim: true, required: true },
    totalPrice: { type: Number, min: 0, max: 999999, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatuses),
      trim: true,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const OrdersModel = model<Order>('Orders', OrderSchema);
