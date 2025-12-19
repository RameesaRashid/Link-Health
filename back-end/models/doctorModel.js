import mongoose, { Document, Schema, Types, Model } from 'mongoose';
const DoctorSchema = new Schema({
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
}, {
    timestamps: true,
});
const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
//# sourceMappingURL=doctorModel.js.map