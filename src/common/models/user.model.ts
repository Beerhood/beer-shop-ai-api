import { Schema, model } from 'mongoose';
import { UserRoles } from '@utils/enums';
import { getHandleDuplicateKeyError } from '@utils/mongodb/handle-unique';

export interface User {
  email: string;
  refreshToken?: string | null;
  firstName: string;
  lastName?: string | null;
  role: UserRoles;
  birthDate?: Date | null;
  address?: string | null;
}

const UserSchema = new Schema<User>(
  {
    email: { type: String, maxLength: 250, unique: true, trim: true, required: true },
    refreshToken: { type: String, required: false },
    firstName: { type: String, maxLength: 250, trim: true, required: true },
    lastName: { type: String, maxLength: 250, trim: true, required: false },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CUSTOMER,
      trim: true,
      required: true,
    },
    birthDate: { type: Date, required: false },
    address: { type: String, maxLength: 1000, trim: true, required: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const handleDuplicateKeyError = getHandleDuplicateKeyError<User>('User', 'email');

UserSchema.post('save', handleDuplicateKeyError);
UserSchema.post('findOneAndUpdate', handleDuplicateKeyError);
UserSchema.post('updateOne', handleDuplicateKeyError);
UserSchema.post('updateMany', handleDuplicateKeyError);
UserSchema.post('insertMany', handleDuplicateKeyError);

UserSchema.index({ 'sessions.expiresAt': 1 }, { expireAfterSeconds: 0 });

export const UsersModel = model<User>('Users', UserSchema);
