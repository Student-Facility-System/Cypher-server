import {check} from "express-validator";

const sendPasswordResetEmailValidator = [
    check('email').isEmail().withMessage('A valid email is required.'),
]

const sendVerificationEmailValidator = [
    check('email').isEmail().withMessage('A valid email is required.'),
]

export default {
    sendPasswordResetEmailValidator,
    sendVerificationEmailValidator,
}