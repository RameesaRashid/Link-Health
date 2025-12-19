import mongoose, { Document, Schema, Types, Model } from 'mongoose';
const AppointmentSchema = new Schema({
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
}, {
    timestamps: true,
});
const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
//# sourceMappingURL=appointmentModel.js.map