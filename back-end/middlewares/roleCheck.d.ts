import { type Request, type Response, type NextFunction } from 'express';
import { type UserRole } from '../models/userModel.js';
declare const roleCheck: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response | void;
export default roleCheck;
//# sourceMappingURL=roleCheck.d.ts.map