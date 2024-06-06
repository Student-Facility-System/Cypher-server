import express from 'express';
import studentController from '../../../../controllers/student.controller.js';
import studentValidators from '../../../../middlewares/validators/student.validators.js';
const router = express.Router();
import multer from 'multer';


// Configure Multer with custom error handling
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }, // Optional: Set a file size limit (in bytes)
    fileFilter: (req, file, cb) => {
        // Optional: Check for allowed file types (e.g., image/jpeg)
        if (!file.mimetype.startsWith('image/')) {
            return cb(new multer.MulterError(<"LIMIT_PART_COUNT" | "LIMIT_FILE_SIZE" | "LIMIT_FILE_COUNT" | "LIMIT_FIELD_KEY" | "LIMIT_FIELD_VALUE" | "LIMIT_FIELD_COUNT" | "LIMIT_UNEXPECTED_FILE">'LIMIT_FILE_TYPE', 'Only image files are allowed.'));
        }
        cb(null, true);
    }
});


router.post('/',express.urlencoded({ extended: true }), studentValidators.initializeStudentValidator, studentController.initializeStudent);


// POST /api/v1/student/send-password-reset-email
router.post('/send-password-reset-email',express.urlencoded({ extended: true }), studentValidators.sendPasswordResetEmailValidator, studentController.sendPasswordResetEmail);

// POST /api/v1/student/send-verification-email
router.post('/send-verification-email',express.urlencoded({ extended: true }), studentValidators.sendVerificationEmailValidator, studentController.sendVerificationEmail);



// this route is only for adding aadhaar image to the student profile. not replacing/updating it
// POST /api/v1/student/aadhaar
router.post('/aadhaar', upload.single('aadhaar_image'), studentValidators.aadhaarImageUploadValidator , studentController.saveAadhaarImg);


router.get('/aadhaar/:studentFirebaseId',  studentController.sendAadhaarImg);


router.post('/profileImage', upload.single('profile_image'), studentValidators.profileImageUploadValidator , studentController.saveProfileImg);


router.get('/profileImage/:studentFirebaseId',  studentController.sendProfileImg);



export default router;
