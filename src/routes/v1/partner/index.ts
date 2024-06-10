import express from 'express';
import partnerController from '../../../controllers/partner.controller.js';
import partnerValidators from '../../../middlewares/validators/partner.validators.js';
import {upload} from '../../../lib/multer.js';

const router = express.Router();

// POST /api/v1/partner/
router.post(
    '/',
    express.urlencoded({ extended: true }),
    partnerValidators.initializePartnerValidator,
    partnerController.initializePartner);


// POST /api/v1/partner/send-password-reset-email
router.post(
    '/send-password-reset-email',
    express.urlencoded({ extended: true }),
    partnerValidators.sendPasswordResetEmailValidator,
    partnerController.sendPasswordResetEmail);

// POST /api/v1/partner/send-verification-email
router.post(
    '/send-verification-email',
    express.urlencoded({ extended: true }),
    partnerValidators.sendVerificationEmailValidator,
    partnerController.sendVerificationEmail);


// POST /api/v1/partner/aadhaar
// This route is only for adding aadhaar image to the partner profile. not replacing/updating it
router.post('/aadhaarImage',
    upload.single('aadhaarImage'), partnerValidators.aadhaarImageUploadValidator , partnerController.saveAadhaarImg);

// PATCH /api/v1/partner/aadhaarImage
router.patch(
    '/aadhaarImage',
    upload.single('aadhaarImage'),
    partnerValidators.aadhaarImageUploadValidator,
    partnerController.updateAadhaarImg);


// GET /api/v1/partner/profileImage/:partnerFirebaseId
router.get(
    '/profileImage/:partnerFirebaseId',
    partnerController.sendProfileImg);


// POST /api/v1/partner/profileImage
router.post(
    '/profileImage',
    upload.single('profileImage'),
    partnerValidators.profileImageUploadValidator,
    partnerController.saveProfileImg);

// PATCH /api/v1/partner/profileImage
router.patch(
    '/profileImage',
    upload.single('profileImage'),
    partnerValidators.profileImageUploadValidator,
    partnerController.updateProfileImg);



// GET /api/v1/partner/:partnerFirebaseId?img=true/false
router.get(
    ':/partnerFirebaseId',
    partnerValidators.getPartnerValidator,
    partnerController.getPartner
);

// PATCH /api/v1/partner/:partnerFirebaseId/enable
router.post(
    '/:partnerFirebaseId/enable',
    partnerValidators.enablePartnerValidator,
    partnerController.enablePartner
);

// POST /api/v1/partner/:partnerFirebaseId/disable
router.post(
    '/:partnerFirebaseId/disable',
    partnerValidators.disablePartnerValidator,
    partnerController.disablePartner
);

export default router;