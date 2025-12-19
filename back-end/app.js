import express, {} from 'express';
import dotenv from 'dotenv';
import cors from "cors";
if (process.env.MONGO_URI) {
    console.log("MONGO_URI is already set. Proceeding");
}
else {
    console.log("MONGO_URI not found yet. Calling dotenv.config()...");
}
dotenv.config();
if (process.env.MONGO_URI) {
    console.log("SUCCESS: MONGO_URI loaded after dotenv call.");
}
else {
    console.error("FATAL: .env file is failing to load MONGO_URI. Must hardcode path.");
}
// db connection 
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
// import { connect } from 'http2';
import appointmentRoutes from './routes/appointmentRoutes.js';
const app = express();
const PORT = process.env.PORT || '5000';
connectDB();
// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('API is running...');
});
// routes
app.use('/api/users', userRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map