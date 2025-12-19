import mongoose, { Document, Schema, Model } from 'mongoose';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface IUser extends Document {
  name: string;     
  email: string;
  password?: string;
  role: UserRole;
}

const UserSchema: Schema = new Schema(
  {
    
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    
    password: { type: String, required: false, select: false }, 
    role: { 
      type: String, 
      required: true, 
      enum: ['patient', 'doctor', 'admin'], 
      default: 'patient' 
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;