import {check} from "express-validator";
import firebase from "../../firebase/index.js";
import mongodb from "mongodb";
import {isValidObjectId} from "mongoose";

const initializeStudentValidator = [
    check('uid').isString().withMessage('A valid uid is required.')
        .custom(async (value) => {
            if (!await firebase.student.auth.getUser(value)) {
                throw new Error('No Student account associated with provided uid.');
            }
        }),
    check('dob').isDate({strictMode: false, format: "dd-MM-YYYY"}).withMessage('A valid date of birth is required.'),
    check('name').isString().withMessage('A valid name is required.'),
    check('phone').isNumeric().withMessage('A valid phone number is required.'),
    check('aadhaar').custom((value) => {
        if (isValidObjectId(value)) {
            return true;
        } else {
            throw new Error('The aadhaar field must pass a valid object Id for the image.');
        }
    }),
    check('profile_image').custom((value) => {
        if (isValidObjectId(value)) {
            return true;
        } else {
            throw new Error('The profile_img field must pass a valid object Id for the image.');
        }
    }),
    check('address').isString().withMessage('A valid address is required.'),
    check('postal_code').isNumeric().withMessage('A valid postal code is required.'),
    check('city').isString().withMessage('A valid city is required.'),
    check('state').isString().withMessage('A valid state is required.'),
    check('country').isString().withMessage('A valid country is required.'),
]

const sendPasswordResetEmailValidator = [
    check('email').isEmail().withMessage('A valid email is required.'),
]

const sendVerificationEmailValidator = [
    check('email').isEmail().withMessage('A valid email is required.'),
]

const aadhaarImageUploadValidator = [
    // Aadhaar image is checked by multer.
    check('uid').isString().withMessage('A valid uid is required.').custom(async (value) => {
            if (!await firebase.student.auth.getUser(value)) {
                throw new Error('No Student account associated with provided uid.');
            }
        })
]

const profileImageUploadValidator = [
    // Profile image is checked by multer.
    check('uid').isString().withMessage('A valid uid is required.').custom(async (value) => {
            if (!await firebase.student.auth.getUser(value)) {
                throw new Error('No Student account associated with provided uid.');
            }
        })
]


export default {
    sendPasswordResetEmailValidator,
    sendVerificationEmailValidator,
    initializeStudentValidator,
    aadhaarImageUploadValidator,
    profileImageUploadValidator,
}