import mongoose from "mongoose";
import { addDays, startOfDay, addMinutes, format } from "date-fns";
import dotenv from "dotenv";
import Doctor from "./models/doctorModel.js";
import Slot from "./models/slotModel.js";
dotenv.config();
const seedSlotsForExistingDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");
        const doctors = await Doctor.find({ status: "approved" });
        console.log(`Generating slots for ${doctors.length} doctors...`);
        const allSlots = [];
        const startDate = startOfDay(new Date());
        const daysToGenerate = 7;
        for (const doctor of doctors) {
            for (let i = 0; i < daysToGenerate; i++) {
                const currentDate = addDays(startDate, i);
                const dayName = format(currentDate, "EEEE");
                const schedule = doctor.workingHours.find((wh) => wh.day === dayName);
                if (schedule) {
                    const [startHour = 0, startMinute = 0] = schedule.startTime
                        .split(":")
                        .map(Number);
                    const [endHour = 0, endMinute = 0] = schedule.endTime
                        .split(":")
                        .map(Number);
                    let slotStartTime = new Date(currentDate);
                    slotStartTime.setHours(startHour, startMinute, 0, 0);
                    const scheduleEndTime = new Date(currentDate);
                    scheduleEndTime.setHours(endHour, endMinute, 0, 0);
                    while (addMinutes(slotStartTime, doctor.slotDuration) <= scheduleEndTime) {
                        const slotEndTime = addMinutes(slotStartTime, doctor.slotDuration);
                        allSlots.push({
                            doctorId: doctor._id,
                            startTime: new Date(slotStartTime),
                            endTime: new Date(slotEndTime),
                            date: startOfDay(slotStartTime),
                            isBooked: false,
                        });
                        slotStartTime = slotEndTime;
                        // prevent memory overflow
                        if (allSlots.length >= 5000) {
                            await Slot.insertMany(allSlots);
                            allSlots.length = 0;
                            console.log("Inserted batch of 5000 slots...");
                        }
                    }
                }
            }
        }
        // Insert remaining slots
        if (allSlots.length > 0) {
            await Slot.insertMany(allSlots);
        }
        console.log("Successfully generated slots for all doctors!");
        process.exit();
    }
    catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};
seedSlotsForExistingDoctors();
//# sourceMappingURL=seedDoctors.js.map