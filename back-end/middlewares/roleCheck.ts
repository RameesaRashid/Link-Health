import { type Request, type Response, type NextFunction } from 'express';
import { type UserRole } from '../models/userModel.js';


//@param allowedRoles An array of roles ('admin', 'doctor') that are permitted access.

const roleCheck = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
        
        
        if (!req.user || !req.user.role) {
            return res.status(500).json({ message: 'Authentication context missing.' });
        }

        const userRole = req.user.role;
        
        if (allowedRoles.includes(userRole)) {
            
            next();
        } else {
            
            return res.status(403).json({ 
                message: `Access forbidden. Role '${userRole}' is not permitted to access this resource.` 
            });
        }
    };
};

export default roleCheck;