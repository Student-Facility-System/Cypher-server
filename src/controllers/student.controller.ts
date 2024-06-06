import {Request, Response, NextFunction} from 'express';
import firebase from '../firebase/index.js';
import {validationResult} from 'express-validator';
import Student from "../database/schema/Student.js";
import {MulterError} from "multer";
import StudentAadhaar from "../database/schema/Student.Aadhaar.js";
import StudentProfileImg from "../database/schema/Student.ProfileImg.js";
import logger from "../logger/index.js";
interface studentInitializationRequest {
    uid: string;
    name: string;
    phone: number;
    aadhaar: string;
    profile_image: string;
    address: string;
    postal_code: number;
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
            , profile_image
            , address
            , postal_code
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
            profile_image,
            address,
            postal_code,
            city,
            state,
            country
        })

        await newStudent.save();
        logger.info(`Student initialized successfully`, {student: newStudent})
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
        logger.info(`Password reset email sent to ${email}`);
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
        logger.info(`Verification email sent to ${email}`);
        res.status(200).send({
            message: `Verification email sent to ${email}`
        });
    } catch (error) {
        next(error);
    }
};


interface saveAadhaarImgRequest {
    // FILE included.
    uid: string;
}

const saveAadhaarImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }

    try {


    //     Check for duplicated in DB
    const {uid} = req.body as saveAadhaarImgRequest;
    const existingAadhaarImg = await StudentAadhaar.findOne({uid});
    if (existingAadhaarImg) {
        logger.alert('Aadhaar image already exists', {uid: existingAadhaarImg.uid})
        res.status(409).send({
            message: 'Aadhaar image already exists',
            aadhaar_imageId: existingAadhaarImg._id,
        });
        return;
    }


    //     THE user is a valid student. already verified by the validator
    const file = req.file;

    if (!file) {
         next(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'));
         return;
    }

    const newAadhaarImageEntry = new StudentAadhaar({
        uid,
        image_data: file.buffer,
        mimetype: file.mimetype,
        size: file.size
    });

    await newAadhaarImageEntry.save();
    logger.info('Aadhaar image uploaded successfully', {aadhaar_imageId: newAadhaarImageEntry._id})
    res.status(201).send({
        message: 'Aadhaar image uploaded successfully',
        aadhaar_imageId: newAadhaarImageEntry._id
    });

    return;


    } catch (error) {
        next(error);

    }
}


// NO INTERFACE FOR REQUEST. JUST PARAMS
const sendAadhaarImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {studentFirebaseId} = req.params;

        const aadhaarImg = await StudentAadhaar.findOne({uid: studentFirebaseId});

        if (!aadhaarImg) {
            next(new Error('Requested Resource found.'));
        } else {
            logger.info('Aadhaar image accessed for download', {uid: studentFirebaseId, imageId: aadhaarImg._id})
            res.setHeader('Content-Type', `${aadhaarImg.mimetype}`); // cast to string.
            res.send(aadhaarImg.image_data);
        }

    } catch (error) {
        next(error);
    }
}


interface saveProfileImgRequest {
    // FILE included.
    uid: string;

}

const saveProfileImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }

    try {


        //     Check for duplicated in DB
        const {uid} = req.body as saveProfileImgRequest;
        const existingProfileImg = await StudentProfileImg.findOne({uid});
        if (existingProfileImg) {
            logger.alert('Profile image already exists', {uid: existingProfileImg.uid})
            res.status(409).send({
                message: 'Profile image already exists',
                profile_imageId: existingProfileImg._id,
            });
            return;
        }


        //     THE user is a valid student. already verified by the validator
        const file = req.file;

        console.log("file", file)
        if (!file) {
            next(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'));
            return;
        }

        const newProfileImageEntry = new StudentProfileImg({
            uid,
            image_data: file.buffer,
            mimetype: file.mimetype,
            size: file.size
        });

        await newProfileImageEntry.save();
        logger.info('Profile image uploaded successfully', {profile_imageId: newProfileImageEntry._id})
        res.status(201).send({
            message: 'Profile image uploaded successfully',
            profile_imageId: newProfileImageEntry._id
        });

        return;


    } catch (error) {
        next(error);

    }
}


// NO INTERFACE FOR REQUEST. JUST PARAMS
const sendProfileImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {studentFirebaseId} = req.params;

        const profileImg = await StudentProfileImg.findOne({uid: studentFirebaseId});

        if (!profileImg) {
            next(new Error('Requested Resource found.'));
        } else {
            logger.info('Profile image accessed for download', {uid: studentFirebaseId, imageId: profileImg._id})
            res.setHeader('Content-Type', `${profileImg.mimetype}`); // cast to string.
            res.send(profileImg.image_data);
        }

    } catch (error) {
        next(error);
    }
}


export default {
    sendPasswordResetEmail,
    sendVerificationEmail,
    initializeStudent,
    saveAadhaarImg,
    sendAadhaarImg,
    saveProfileImg,
    sendProfileImg,
};

