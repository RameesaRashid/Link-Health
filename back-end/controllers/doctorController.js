import {} from 'express';
import Doctor from '../models/doctorModel.js';
import User from '../models/userModel.js';
import Slot from '../models/slotModel.js';
import { addMinutes, startOfDay, getDay } from 'date-fns';
import {} from '../types/custom.js';
import {} from '../models/doctorModel.js';
const dayIndexToName = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};
export const getAllDoctors = async (req, res) => {
    try {
        const { name, specialty, page = 1, limit = 10 } = req.query; // pagination
        const query = { status: 'approved' };
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const doctors = await Doctor.find(query)
            .select('-workingHours -userId')
            .sort({ name: 1 })
            .limit(Number(limit))
            .skip(skip);
        // return total count
        const total = await Doctor.countDocuments(query);
        return res.status(200).json({
            doctors,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalDoctors: total
        });
    }
    catch (error) {
        console.error("Fetch Doctors Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const createDoctorProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found." });
        }
        const { name, specialty, fees, slotDuration, workingHours } = req.body;
        const existingProfile = await Doctor.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Doctor profile already exists." });
        }
        if (!specialty || fees == null || !workingHours || !slotDuration || !name) {
            return res.status(400).json({ message: "All profile fields are required." });
        }
        if (req.user?.role !== 'doctor') {
            return res.status(403).json({ message: "Only users with 'doctor' role can create a doctor profile." });
        }
        // const baseUser = await User.findById(userId);
        // if (baseUser?.role !== 'doctor') {
        //     return res.status(403).json({ message: "Only users with the 'doctor' role can create a doctor profile." });
        // }
        const newDoctor = new Doctor({
            userId,
            name,
            specialty,
            fees,
            slotDuration,
            workingHours,
            status: 'approved'
        });
        const doctorProfile = await newDoctor.save();
        return res.status(201).json({
            message: "Doctor profile created successfully. Awaiting admin approval.",
            data: doctorProfile
        });
    }
    catch (error) {
        console.error("Create Doctor Profile Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const generateAvailableSlots = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found." });
        }
        const { startDate: startStr, endDate: endStr } = req.body;
        if (!startStr || !endStr) {
            return res.status(400).json({ message: "Start date and end date are required." });
        }
        const doctorProfile = await Doctor.findOne({ userId });
        if (!doctorProfile || doctorProfile.status !== 'approved') {
            return res.status(403).json({ message: "Doctor profile not approved or missing/unapproved." });
        }
        const workingHours = doctorProfile.workingHours;
        const slotDuration = doctorProfile.slotDuration;
        if (!workingHours || workingHours.length === 0) {
            return res.status(400).json({ message: "Doctor has not set working hours." });
        }
        const start = startOfDay(new Date(startStr));
        const end = startOfDay(new Date(endStr));
        const newSlots = [];
        let currentDate = start;
        await Slot.deleteMany({
            doctorId: doctorProfile._id,
            date: { $gte: start, $lte: end },
            isBooked: false
        });
        while (currentDate <= end) {
            const dayOfWeek = dayIndexToName[getDay(currentDate)];
            const dailySchedule = workingHours.find(wh => wh.day === dayOfWeek);
            if (dailySchedule) {
                const [startHour, startMinute] = dailySchedule.startTime.split(':').map(Number);
                const [endHour, endMinute] = dailySchedule.endTime.split(':').map(Number);
                let slotStartTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startHour, startMinute);
                let scheduleEndTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), endHour, endMinute);
                while (addMinutes(slotStartTime, slotDuration) <= scheduleEndTime) {
                    const slotEndTime = addMinutes(slotStartTime, slotDuration);
                    newSlots.push({
                        doctorId: doctorProfile._id,
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                        isBooked: false,
                        date: startOfDay(slotStartTime),
                    });
                    slotStartTime = slotEndTime;
                }
            }
            currentDate = addMinutes(currentDate, 24 * 60);
        }
        if (newSlots.length > 0) {
            await Slot.insertMany(newSlots);
        }
        return res.status(200).json({
            message: `Successfully generated ${newSlots.length} available slots between ${startStr} and ${endStr}.`,
            count: newSlots.length,
            startDate: startStr,
            endDate: endStr
        });
    }
    catch (error) {
        console.error("Slot Generation Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=doctorController.js.map