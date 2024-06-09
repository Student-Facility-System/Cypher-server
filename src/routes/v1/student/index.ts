import express from 'express';
import studentController from '../../../../controllers/student.controller.js';
import studentValidators from '../../../../middlewares/validators/student.validators.js';
import {upload} from '../../../../lib/multer.js';

const router = express.Router();

// POST /api/v1/student/
router.post(
    '/',
    express.urlencoded({ extended: true }),
    studentValidators.initializeStudentValidator,
    studentController.initializeStudent);


// POST /api/v1/student/send-password-reset-email
router.post(
    '/send-password-reset-email',
    express.urlencoded({ extended: true }),
    studentValidators.sendPasswordResetEmailValidator,
    studentController.sendPasswordResetEmail);

// POST /api/v1/student/send-verification-email
router.post(
    '/send-verification-email',
    express.urlencoded({ extended: true }),
    studentValidators.sendVerificationEmailValidator,
    studentController.sendVerificationEmail);


// POST /api/v1/student/aadhaar
// This route is only for adding aadhaar image to the student profile. not replacing/updating it
router.post('/aadhaar',
    upload.single('aadhaar_image'), studentValidators.aadhaarImageUploadValidator , studentController.saveAadhaarImg);


// POST /api/v1/student/profileImage
router.post(
    '/profileImage',
    upload.single('profile_image'),
    studentValidators.profileImageUploadValidator,
    studentController.saveProfileImg);


// GET /api/v1/student/profileImage/:studentFirebaseId
router.get(
    '/profileImage/:studentFirebaseId',
    studentController.sendProfileImg);


export default router;