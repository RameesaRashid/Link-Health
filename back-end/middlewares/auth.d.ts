import { type Request, type Response, type NextFunction } from 'express';
import { type UserRole } from '../models/userModel.js';
export interface JwtPayload {
    userId: string;
    role: UserRole;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
declare const auth: (req: Request, res: Response, next: NextFunction) => Response | void;
export default auth;
//# sourceMappingURL=auth.d.ts.map