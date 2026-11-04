import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;
  fullName: string;
  phone: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  avatar?: string;
  favorites: mongoose.Types.ObjectId[];
  location?: string;
  isVerified: boolean;
  pin?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    location: { type: String, default: 'Kano, Nigeria' },
    isVerified: { type: Boolean, default: false },
    pin: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
