import { Schema, model } from 'mongoose';

export interface Type {
  name: string;
}

const TypeSchema = new Schema<Type>(
  {
    name: { type: String, maxLength: 250, unique: true, trim: true, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const TypesModel = model<Type>('Types', TypeSchema);
