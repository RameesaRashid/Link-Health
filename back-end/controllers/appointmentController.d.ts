import { type Request, type Response } from 'express';
import { type AuthRequest } from '../types/custom.js';
export declare const searchAvailableSlots: (req: Request, res: Response) => Promise<Response>;
export declare const bookAppointment: (req: AuthRequest, res: Response) => Promise<Response>;
export declare const viewPatientAppointments: (req: AuthRequest, res: Response) => Promise<Response>;
export declare const cancelAppointment: (req: AuthRequest, res: Response) => Promise<Response>;
export declare const getDoctorAppointments: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=appointmentController.d.ts.map