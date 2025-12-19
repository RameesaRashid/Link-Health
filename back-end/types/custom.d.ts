import { type Request } from 'express';
import { type IWorkingHour } from '../models/doctorModel.js';
import { type UserRole } from '../models/userModel.js';
export interface JwtPayload {
    userId: string;
    role: UserRole;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export { type IWorkingHour };
//# sourceMappingURL=custom.d.ts.map