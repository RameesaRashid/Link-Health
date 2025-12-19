import { type Request, type Response } from 'express';
import { type AuthRequest } from '../types/custom.js';
import { type IWorkingHour } from '../models/doctorModel.js';
interface DoctorProfileRequest extends AuthRequest {
    body: {
        name: string;
        specialty: string;
        fees: number;
        slotDuration: number;
        workingHours: IWorkingHour[];
    };
}
interface GenerateSlotsRequest extends AuthRequest {
    body: {
        startDate: string;
        endDate: string;
    };
}
export declare const getAllDoctors: (req: Request, res: Response) => Promise<Response>;
export declare const createDoctorProfile: (req: DoctorProfileRequest, res: Response) => Promise<Response>;
export declare const generateAvailableSlots: (req: GenerateSlotsRequest, res: Response) => Promise<Response>;
export {};
//# sourceMappingURL=doctorController.d.ts.map