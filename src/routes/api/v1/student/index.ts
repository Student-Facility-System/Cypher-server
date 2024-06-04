import express from 'express';
import studentController from '../../../../controllers/student.controller.js';
import studentValidators from '../../../../middlewares/validators/student.validators.js';
const router = express.Router();


router.use(express.urlencoded({ extended: true }));


// POST /api/v1/student/send-password-reset-email
router.post('/send-password-reset-email', studentValidators.sendPasswordResetEmailValidator, studentController.sendPasswordResetEmail);

// POST /api/v1/student/send-verification-email
router.post('/send-verification-email', studentValidators.sendVerificationEmailValidator, studentController.sendVerificationEmail);





export default router;
