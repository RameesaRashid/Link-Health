import { Document, Types, Model } from 'mongoose';
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
declare const Appointment: Model<IAppointment>;
export default Appointment;
//# sourceMappingURL=appointmentModel.d.ts.map