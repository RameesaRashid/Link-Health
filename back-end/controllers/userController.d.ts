import { type Request, type Response } from 'express';
export declare const googleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
interface AuthRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        role?: 'patient' | 'doctor';
    };
}
export declare const register: (req: AuthRequest, res: Response) => Promise<Response>;
export declare const login: (req: AuthRequest, res: Response) => Promise<Response>;
export declare const getProfile: (req: Request, res: Response) => Promise<Response>;
export {};
//# sourceMappingURL=userController.d.ts.map