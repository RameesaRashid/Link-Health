import type { Request, Response } from "express";
import Doctor from "../back-end/models/doctorModel.js"
import Slot from "./models/slotModel.js";

import {
  addMinutes,
  startOfDay,
  getDay,
  addDays,
} from "date-fns";

import {type AuthRequest } from "./types/custom.js";
import { type IWorkingHour } from "./models/doctorModel.js";

const dayIndexToName: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

interface GenerateSlotsRequest extends AuthRequest {
  body: {
    startDate: string;
    endDate: string;
  };
}

export const generateAvailableSlots = async (
  req: GenerateSlotsRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    const start = startOfDay(startDateObj);
    const end = startOfDay(endDateObj);

    const doctor = await Doctor.findOne({ userId, status: "approved" });

    if (!doctor) {
      return res.status(403).json({ message: "Doctor profile not approved or not found" });
    }

    if (!doctor.workingHours?.length) {
      return res.status(400).json({ message: "Doctor working hours not set" });
    }

    await Slot.deleteMany({
      doctorId: doctor._id,
      date: { $gte: start, $lt: addDays(end, 1) },
      isBooked: false,
    });

    const newSlots: any[] = [];
    let currentDate = start;

    while (currentDate <= end) {
      const dayName = dayIndexToName[getDay(currentDate)];

      const schedule = doctor.workingHours.find(
        (wh: IWorkingHour) => wh.day.toLowerCase() === dayName?.toLowerCase()
      );

      if (schedule) {
        // ✅ Fix: Use destructuring with fallbacks to ensure type is 'number'
        const startParts = schedule.startTime.split(":").map(Number);
        const endParts = schedule.endTime.split(":").map(Number);
        
        const startHour = startParts[0] ?? 0;
        const startMinute = startParts[1] ?? 0;
        const endHour = endParts[0] ?? 0;
        const endMinute = endParts[1] ?? 0;

        let slotStart = new Date(currentDate);
        slotStart.setHours(startHour, startMinute, 0, 0);

        const scheduleEnd = new Date(currentDate);
        scheduleEnd.setHours(endHour, endMinute, 0, 0);

        while (addMinutes(slotStart, doctor.slotDuration) <= scheduleEnd) {
          const slotEnd = addMinutes(slotStart, doctor.slotDuration);

          newSlots.push({
            doctorId: doctor._id,
            startTime: new Date(slotStart),
            endTime: new Date(slotEnd),
            date: startOfDay(slotStart),
            isBooked: false,
          });

          slotStart = slotEnd;
        }
      }
      currentDate = addDays(currentDate, 1);
    }

    if (newSlots.length > 0) {
      await Slot.insertMany(newSlots);
    }

    return res.status(200).json({
      message: "Slots generated successfully",
      totalSlots: newSlots.length,
    });
  } catch (error) {
    console.error("Generate Slot Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};