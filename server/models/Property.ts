import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  _id: any;
  title: string;
  type: 'Gida' | 'Fili' | 'Shago' | 'Company' | 'Warehouse' | 'Hall';
  area: string;
  price: number;
  dealType: 'Haya - Per Year' | 'Haya - Per Day' | 'Saya - Total';
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  document: 'C of O' | 'R of O' | 'Tenancy Agreement' | 'None';
  water?: string;
  power?: string;
  fence: boolean;
  parking: boolean;
  security: boolean;
  description: string;
  images: string[];
  videoUrl?: string;
  mapPin?: string;
  status: 'Available' | 'Sold' | 'Rented' | 'Draft';
  views: number;
  whatsappClicks: number;
  favoritesCount: number;
  isFeatured: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Gida', 'Fili', 'Shago', 'Company', 'Warehouse', 'Hall'],
    },
    area: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    dealType: {
      type: String,
      required: true,
      enum: ['Haya - Per Year', 'Haya - Per Day', 'Saya - Total'],
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    size: { type: String, default: '' },
    document: {
      type: String,
      required: true,
      enum: ['C of O', 'R of O', 'Tenancy Agreement', 'None'],
      default: 'None',
    },
    water: { type: String, default: 'Borehole / Ruwan Pompom' },
    power: { type: String, default: 'NEPA / Solar Available' },
    fence: { type: Boolean, default: true },
    parking: { type: Boolean, default: true },
    security: { type: Boolean, default: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    videoUrl: { type: String, default: '' },
    mapPin: { type: String, default: 'Kano, Nigeria' },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Rented', 'Draft'],
      default: 'Available',
    },
    views: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PropertyModel =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
