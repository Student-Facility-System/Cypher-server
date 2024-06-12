import {check, ValidationChain} from "express-validator";
import firebase from "../../firebase/index.js";
import {isValidObjectId} from "mongoose";

const checkValidPartnerUID =
    check('uid').isString().withMessage('A valid uid is required.')
        .custom(async (value) => {
            if (!await firebase.partner.auth.getUser(value)) {
                throw new Error('No Partner account associated with provided uid.');
            }
        })



const validServiceTypes:string[] = [
    'accommodation',
    'education',
    'fooding',
    'medical',
    'transportation'
]

const initializePartnerValidator:ValidationChain[] = [
    checkValidPartnerUID,
    check('dob').isDate({strictMode: false, format: "dd-MM-YYYY"}).withMessage('A valid date of birth is required.'),
    check('name').isString().withMessage('A valid name is required.'),
    check('phone').isNumeric().withMessage('A valid phone number is required.'),
    check('gender').isString().withMessage('Please enter a valid input for "gender" field.'),
    check('aadhaarImage').custom((value) => {
        if (isValidObjectId(value)) {
            return true;
        } else {
            throw new Error('The aadhaar field must pass a valid object Id for the image.');
        }
    }),
    check('profileImage').custom((value) => {
        if (isValidObjectId(value)) {
            return true;
        } else {
            throw new Error('The profile_img field must pass a valid object Id for the image.');
        }
    }),

    check('serviceType')
        .isString()
        .withMessage('A service type is undefined or null required.')
        .isIn(validServiceTypes)
        .withMessage(`Invalid service type. valid Types : ${validServiceTypes.join(', ')} `),


    // Home address
    check('homeAddress').isString().withMessage('A valid home address is required.'),
    check('homePostalCode').isNumeric().withMessage('A valid home postal code is required.'),
    check('homeCity').isString().withMessage('A valid home city is required.'),
    check('homeState').isString().withMessage('A valid home state is required.'),
    check('homeCountry').isString().withMessage('A valid home country is required.'),


    check('businessAddress').isString().withMessage('A valid business address is required.'),
    check('businessPostalCode').isNumeric().withMessage('A valid business postal code is required.'),
    check('businessCity').isString().withMessage('A valid business city is required.'),
    check('businessState').isString().withMessage('A valid business state is required.'),
    check('businessCountry').isString().withMessage('A valid business country is required.'),
]

const sendPasswordResetEmailValidator = [
    check('email').isEmail().withMessage('A valid partner email is required.'),
]

const sendVerificationEmailValidator = [
    check('email').isEmail().withMessage('A valid partner email is required.'),
]

const aadhaarImageUploadValidator = [
    // Aadhaar image is checked by multer.
    check('uid').isString().withMessage('A valid uid is required.').custom(async (value) => {
        if (!await firebase.partner.auth.getUser(value)) {
            throw new Error('No Student account associated with provided uid.');
        }
    })
]

const profileImageUploadValidator = [
    // Profile image is checked by multer.
    check('uid').isString().withMessage('A valid uid is required.').custom(async (value) => {
        if (!await firebase.partner.auth.getUser(value)) {
            throw new Error('No Partner account associated with provided uid.');
        }
    })
]


export default {
    sendPasswordResetEmailValidator,
    sendVerificationEmailValidator,
    initializePartnerValidator,
    aadhaarImageUploadValidator,
    profileImageUploadValidator,
    enablePartnerValidator:checkValidPartnerUID,
    disablePartnerValidator:checkValidPartnerUID,
    getPartnerValidator:checkValidPartnerUID
}