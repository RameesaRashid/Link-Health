import mongoose, { Document, Schema, Model } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    role: {
        type: String,
        required: true,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
}, {
    timestamps: true,
});
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=userModel.js.map