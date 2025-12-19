import { Document, Types, Model } from 'mongoose';
export interface ISlot extends Document {
    doctorId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    date: Date;
}
declare const Slot: Model<ISlot>;
export default Slot;
//# sourceMappingURL=slotModel.d.ts.map