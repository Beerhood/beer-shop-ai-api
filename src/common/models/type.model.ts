import { Schema, model } from 'mongoose';

export interface IType {
  name: string;
}

const TypeSchema = new Schema<IType>(
  {
    name: { type: String, maxLength: 250, unique: true, trim: true, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const TypesModel = model<IType>('Types', TypeSchema);
