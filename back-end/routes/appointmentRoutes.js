import express from 'express';
import { bookAppointment } from '../controllers/appointmentController.js';
import auth from '../middlewares/auth.js';
import * as appointmentController from '../controllers/appointmentController.js';
import { cancelAppointment } from "../controllers/appointmentController.js";
const appointmentRouter = express.Router();
appointmentRouter.delete('/:id', auth, cancelAppointment);
appointmentRouter.get('/available-slots', appointmentController.searchAvailableSlots);
// appointmentController.get('/book', appointmentController.bookAppointment)
appointmentRouter.post('/book', auth, bookAppointment);
appointmentRouter.get('/patient', auth, appointmentController.viewPatientAppointments);
export default appointmentRouter;
//# sourceMappingURL=appointmentRoutes.js.map