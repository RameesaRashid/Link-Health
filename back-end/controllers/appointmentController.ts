import { type Request, type Response } from 'express';
import Slot from '../models/slotModel.js';
import Appointment from '../models/appointmentModel.js';
import Doctor from '../models/doctorModel.js';
import { type AuthRequest } from '../types/custom.js';
import mongoose from 'mongoose'


// export const bookAppointment = (req: Request, res: Response) => {

//     console.log('Received booking request:', req.body);

//     res.status(201).json({
//         message: 'Booking Request received successfully (Placeholder)',
//         appointmentId: 'mock-12345',
//         status: 'booked'

//     })
    
// }

export const searchAvailableSlots = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { date, specialty, doctorId } = req.query;

        const query: any = { 
            isBooked: false,
            startTime: { $gte: new Date() } 
        };
        
        if (date) {
            const searchStart = new Date(date as string);
            searchStart.setHours(0, 0, 0, 0); 
            const nextDayStart = new Date(searchStart);
            nextDayStart.setDate(searchStart.getDate() + 1); 

            query.startTime = { $gte: searchStart, $lt: nextDayStart };
        }
        

        if (doctorId) {    
            try {
                query.doctorId = new mongoose.Types.ObjectId(doctorId as string); 
            } catch (e) {
                console.error("Invalid Doctor ID received:", doctorId);
                return res.status(400).json({ message: "Invalid Doctor ID format." });
            }
        } else if (specialty) {
            
            const doctors = await Doctor.find({ specialty: specialty as string }).select('_id');
            const doctorIds = doctors.map(doc => doc._id);
            query.doctorId = { $in: doctorIds };
        }
        
        
        const slots = await Slot.find(query)
            .populate({
                path: 'doctorId',
                select: 'name specialty fees',
                model: Doctor 
            })
            .sort('startTime');

        return res.status(200).json(slots);

    } catch (error) {
        console.error("Search Slots Error:", error);
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const bookAppointment = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const patientId = req.user?.userId;
        const { slotId } = req.body;

        if (!patientId || req.user?.role !== 'patient') {
            return res.status(403).json({ message: "Forbidden: Only authenticated patients can book appointments." });
        }
        
        if (!slotId) {
            return res.status(400).json({ message: "Slot ID is required for booking." });
        }
        
        const patientObjectId = new mongoose.Types.ObjectId(patientId);
        const slotObjectId = new mongoose.Types.ObjectId(slotId);
        
        const updatedSlot = await Slot.findOneAndUpdate(
            
            { _id: slotObjectId, isBooked: false },
            { $set: { isBooked: true, patientId: patientObjectId } }, 
            { new: true }
        );

        if (!updatedSlot) {
            console.warn(`Booking attempt failed: Slot ${slotId} already booked or not found.`);
            return res.status(409).json({ message: "Slot is already booked or does not exist." });
        }
        
        const newAppointment = new Appointment({
            patientId: patientObjectId, 
            doctorId: updatedSlot.doctorId,
            slotId: updatedSlot._id,

            startTime: updatedSlot.startTime,
            endTime: updatedSlot.endTime,

            status: 'Confirmed',

            reason: 'Initial Booking'
        });

        await newAppointment.save();

        // populating the doctor details before sending response
        const populatedAppointment = await Appointment.findById(newAppointment._id).populate({
            path: 'doctorId',
            select: 'name specialty fees',
            model: Doctor
        }).exec();

        return res.status(201).json({
            message: "Appointment booked successfully!",
            appointment: populatedAppointment
        });

    } catch (error) {
        
        console.error("Booking Slot Critical Error:", error); 
        return res.status(500).json({ message: (error as Error).message });
    }
};


export const viewPatientAppointments = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const patientId = req.user?.userId;

        if (!patientId || req.user?.role !== 'patient') {
            return res.status(403).json({ message: "Forbidden: Only authenticated patients can view their appointments." });
        }

        const patientObjectId = new mongoose.Types.ObjectId(patientId);

        
        const appointments = await Appointment.find({ patientId: patientObjectId })
            .populate({
                path: 'doctorId',
                select: 'name specialty fees',
                model: Doctor 
            })
            .sort({ startTime: 1 }); 

        if (appointments.length === 0) {
            return res.status(200).json({ message: "You have no appointments booked yet.", appointments: [] });
        }

        return res.status(200).json(appointments);

    } catch (error) {
        console.error("View Appointments Error:", error);
        
        if (error instanceof Error && error.name === 'CastError') {
             return res.status(400).json({ message: "Invalid Patient ID format." });
        }
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<Response> => {
    try{
        const appointmentId = req.params.id;
        const patientId = req.user?.userId;

        const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            return res.status(404).json({
                message: "Appointment not found."
            })
        }

        if (appointment.patientId.toString() !== patientId){
            return res.status(403).json({message: "Unathorized: You can only cancel you own appoinments."})
        }

        await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

        // await Appointment.findByIdAndDelete(appointmentId);
        appointment.status = 'Cancelled';
        await appointment.save()

        return res.status(200).json({
            message: "Appointment cancelled successfully. The slot is now available for others"
        })
    }
    catch(err){
        console.error("Cancel Appointment Error:", err);
        return res.status(500).json({message: (err as Error).message});
    }
}

export const getDoctorAppointments = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user){
            return res.status(401).json({ message: "Unauthorized: No user found."})
        }

        const doctorId = req.user.userId; 
        

        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'name email') 
            .sort({ startTime: 1 }); 

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
