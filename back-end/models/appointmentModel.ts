import mongoose, { Document, Schema, Types, Model } from 'mongoose';
// import { type IUser } from './userModel.js'; 
// import { type ISlot } from './slotModel.js'; 


export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';

export interface IAppointment extends Document {
  patientId: Types.ObjectId; 
  doctorId: Types.ObjectId;
  slotId: Types.ObjectId; 
  status: AppointmentStatus;
  reason: string; 
  startTime: Date;
  endTime: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    patientId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
    slotId: {
      type: Types.ObjectId,
      ref: 'Slot',
      required: true,
      unique: true, 
    },
    status: {
      type: String,
      required: true,
      enum: ['Confirmed', 'Completed', 'Cancelled', 'Pending'],
      default: 'Pending',
    },
    reason: {
      type: String,
      maxlength: 255,
    }
  },
  {
    timestamps: true,
  }
);

const Appointment: Model<IAppointment> = mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;