import {Request, Response, NextFunction} from 'express';
import firebase from '../firebase/index.js';
import {validationResult} from 'express-validator';
import Student from "../database/schema/Student.js";

interface studentInitializationRequest {
    uid: string;
    name: string;
    phone: number;
    aadhaar: string;
    address: string;
    zipcode: number;
    city: string;
    state: string;
    country: string;
    dob: Date;
}


const initializeStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // NOTE: UID is already checked for existence in the request by the validator

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }

    try {

        const {
            uid,
            dob
            , name
            , phone
            , aadhaar
            , address
            , zipcode
            , city
            , state
            , country

        } = req.body as studentInitializationRequest;

        const newStudent = new Student({
            uid,
            dob,
            name,
            phone,
            aadhaar,
            address,
            zipcode,
            city,
            state,
            country
        })

        await newStudent.save();
        res.status(201).send({
            message: 'Student initialized successfully',
            student: newStudent
        });
    } catch (error) {
        next(error);
    }

}

interface sendPasswordResetEmailRequest {
    email: string;
}


const sendPasswordResetEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }

        const {email} = req.body as sendPasswordResetEmailRequest;
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

interface sendVerificationEmailRequest {
    email: string;
}

const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }

        const {email} = req.body as sendVerificationEmailRequest;
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
    initializeStudent
};

