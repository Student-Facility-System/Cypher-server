import { Request, Response, NextFunction } from 'express';
import firebase from '../firebase/index.js';
import { validationResult } from 'express-validator';


interface sendPasswordResetEmailRequest {
    email: string;
}

interface sendVerificationEmailRequest {
    email: string;
}

export const sendPasswordResetEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }

        const { email } = req.body as sendPasswordResetEmailRequest;
        const user = await firebase.student.auth.getUserByEmail(email);

        if (!user || !user.email) {
            res.status(204).send(); // No content
            return;
        }

        await firebase.student.auth.generatePasswordResetLink(email);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }

        const { email } = req.body as sendVerificationEmailRequest;
        const user = await firebase.student.auth.getUser(email);

        console.log(user, email)
        if (!user || !user.email) {
            return next(new Error(`No user associated with provided email ${email}`));
        }

        await firebase.student.auth.generateEmailVerificationLink(email);
        res.status(200).send({
            message: `Verification email sent to ${email}`
        });
    } catch (error) {
        next(error);
    }
};

export default {
    sendPasswordResetEmail,
    sendVerificationEmail,
};
