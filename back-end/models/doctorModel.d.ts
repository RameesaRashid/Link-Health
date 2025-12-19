import { Document, Types, Model } from 'mongoose';
export interface IWorkingHour {
    day: string;
    startTime: string;
    endTime: string;
}
export interface IDoctor extends Document {
    userId: Types.ObjectId;
    name: string;
    fees: number;
    slotDuration: number;
    workingHours: IWorkingHour[];
    status: 'pending' | 'approved' | 'rejected';
}
declare const Doctor: Model<IDoctor>;
export default Doctor;
//# sourceMappingURL=doctorModel.d.ts.map