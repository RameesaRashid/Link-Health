import mongoose, { Document, Schema, Types, Model } from 'mongoose';
const SlotSchema = new Schema({
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
}, {
    timestamps: true,
});
const Slot = mongoose.model('Slot', SlotSchema);
export default Slot;
//# sourceMappingURL=slotModel.js.map