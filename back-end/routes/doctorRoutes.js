import express from 'express';
import * as doctorController from '../controllers/doctorController.js';
import auth from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';
const doctorRouter = express.Router();
doctorRouter.get('/', doctorController.getAllDoctors);
// This requires JWT authentication and checks if the user's role is 'doctor'.
doctorRouter.post('/profile', auth, roleCheck(['doctor']), doctorController.createDoctorProfile);
doctorRouter.post('/generate-slots', auth, roleCheck(['doctor']), doctorController.generateAvailableSlots);
export default doctorRouter;
//# sourceMappingURL=doctorRoutes.js.map