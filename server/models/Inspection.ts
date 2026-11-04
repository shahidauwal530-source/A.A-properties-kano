import mongoose, { Schema, Document } from 'mongoose';

export interface IInspection extends Document {
  _id: any;
  propertyId: mongoose.Types.ObjectId;
  propertyTitle: string;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  date: Date;
  time: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Done' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const InspectionSchema = new Schema<IInspection>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyTitle: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Done', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const InspectionModel =
  mongoose.models.Inspection || mongoose.model<IInspection>('Inspection', InspectionSchema);
