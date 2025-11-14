import { Schema, model } from 'mongoose';
import { Types } from 'mongoose';
import { OrderStatuses } from '@utils/enums';

export interface IOrder {
  user: Types.ObjectId | string;
  products: [Types.ObjectId | string];
  address: string;
  totalPrice: number;
  status: OrderStatuses;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      maxLength: 25,
      trim: true,
      required: true,
      index: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Products',
      maxLength: 25,
      trim: true,
      required: true,
      index: true,
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

export const OrdersModel = model<IOrder>('Orders', OrderSchema);
