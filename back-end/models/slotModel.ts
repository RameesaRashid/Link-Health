
import mongoose, { Document, Schema, Types, Model } from 'mongoose';
// import { type IDoctor } from './doctorModel.js';


export interface ISlot extends Document {
  doctorId: Types.ObjectId; 
  startTime: Date; 
  endTime: Date; 
  isBooked: boolean;
  date: Date; 
}

const SlotSchema: Schema = new Schema(
  {
    doctorId: {
      type: Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slot: Model<ISlot> = mongoose.model<ISlot>('Slot', SlotSchema);

export default Slot;