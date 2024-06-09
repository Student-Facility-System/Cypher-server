import express from 'express';
import studentController from '../../../controllers/student.controller.js';
import studentValidators from '../../../middlewares/validators/student.validators.js';
import {upload} from '../../../lib/multer.js';

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
router.post('/aadhaarImage',
    upload.single('aadhaarImage'), studentValidators.aadhaarImageUploadValidator , studentController.saveAadhaarImg);

// PATCH /api/v1/student/aadhaarImage
router.patch(
    '/aadhaarImage',
    upload.single('aadhaarImage'),
    studentValidators.aadhaarImageUploadValidator,
    studentController.updateAadhaarImg);


// GET /api/v1/student/profileImage/:studentFirebaseId
router.get(
    '/profileImage/:studentFirebaseId',
    studentController.sendProfileImg);


// POST /api/v1/student/profileImage
router.post(
    '/profileImage',
    upload.single('profileImage'),
    studentValidators.profileImageUploadValidator,
    studentController.saveProfileImg);

// PATCH /api/v1/student/profileImage
router.patch(
    '/profileImage',
    upload.single('profileImage'),
    studentValidators.profileImageUploadValidator,
    studentController.updateProfileImg);



// GET /api/v1/student/:studentFirebaseId?img=true/false
router.get(
    ':/studentFirebaseId',
    studentValidators.getStudentValidator,
    studentController.getStudent
);

// PATCH /api/v1/student/:studentFirebaseId/enable
router.post(
    '/:studentFirebaseId/enable',
    studentValidators.enableStudentValidator,
    studentController.enableStudent
);

// POST /api/v1/student/:studentFirebaseId/disable
router.post(
    '/:studentFirebaseId/disable',
    studentValidators.disableStudentValidator,
    studentController.disableStudent
);

export default router;