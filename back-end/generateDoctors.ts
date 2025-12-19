import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Doctor from "./models/doctorModel.js";

dotenv.config();

const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Oncology"];

const createFakeDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB for seeding...");

    const fakeDoctors = [];
    for (let i = 0; i < 10; i++) {
      fakeDoctors.push({
        userId: new mongoose.Types.ObjectId(), // Creates a unique ID for each doctor
        name: `Dr. ${faker.person.fullName()}`,
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
        fees: faker.number.int({ min: 50, max: 200 }),
        slotDuration: 30,
        status: "approved", // Must be "approved" to show on frontend
        workingHours: [
          { day: "Monday", startTime: "09:00", endTime: "17:00" },
          { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
          { day: "Friday", startTime: "09:00", endTime: "17:00" }
        ]
      });
    }

    await Doctor.insertMany(fakeDoctors);
    console.log("Successfully generated 10 doctors!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

createFakeDoctors();