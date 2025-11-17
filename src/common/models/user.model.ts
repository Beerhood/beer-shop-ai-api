import { Schema, model } from 'mongoose';
import { UserRoles } from '@utils/enums';

export interface User {
  email: string;
  refreshTokens: string[];
  firstName: string;
  lastName: string;
  role: UserRoles;
  birthDate: Date;
  address?: string;
}

const UserSchema = new Schema<User>(
  {
    email: { type: String, maxLength: 250, unique: true, trim: true, required: true },
    refreshTokens: { type: [String], required: true },
    firstName: { type: String, maxLength: 250, trim: true, required: true },
    lastName: { type: String, maxLength: 250, trim: true, required: true },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CUSTOMER,
      trim: true,
      required: true,
    },
    birthDate: { type: Date, required: true },
    address: { type: String, maxLength: 1000, trim: true, required: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.index({ 'sessions.expiresAt': 1 }, { expireAfterSeconds: 0 });

export const UsersModel = model<User>('Users', UserSchema);
