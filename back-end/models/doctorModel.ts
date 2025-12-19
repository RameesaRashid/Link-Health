import mongoose, { Document, Schema, Types, Model } from 'mongoose';
// import { type IUser } from './userModel.js'; 

export interface IWorkingHour {
  day: string;
  startTime: string; 
  endTime: string;
}


export interface IDoctor extends Document {
    
  userId: Types.ObjectId 
  name: string
  fees: number; 
  slotDuration: number;
  workingHours: IWorkingHour[];
  status: 'pending' | 'approved' | 'rejected';
}

const DoctorSchema: Schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    fees: { type: Number, required: true, min: 0 },
    slotDuration: { type: Number, required: true, default: 30, min: 10 },
    workingHours: [
      {
        day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Doctor: Model<IDoctor> = mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;