import { Schema, model } from 'mongoose';
import { UserRoles } from '@utils/enums';

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  birthDate: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, maxLength: 250, unique: true, trim: true, required: true },
    firstName: { type: String, maxLength: 250, trim: true, required: true },
    lastName: { type: String, maxLength: 250, trim: true, required: true },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CUSTOMER,
      trim: true,
      required: true,
    },
    birthDate: { type: Date, maxLength: 30, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const UsersModel = model<IUser>('Users', UserSchema);
