import { Document, Model } from 'mongoose';
export type UserRole = 'patient' | 'doctor' | 'admin';
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=userModel.d.ts.map