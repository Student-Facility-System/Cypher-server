import {Request, Response, NextFunction} from 'express';
import firebase from '../firebase/index.js';
import {validationResult} from 'express-validator';
import Partner from "../database/schema/Partner.js";
import {MulterError} from "multer";
import PartnerAadhaar from "../database/schema/Partner.Aadhaar.js";
import PartnerProfileImg from "../database/schema/Partner.ProfileImg.js";
import {QueryOptions} from "mongoose";
interface partnerInitializationRequest {
    uid: string;
    name: string;
    phone: number;
    gender: string;
    aadhaarImage: string;
    profileImage: string;
    serviceType: string;
    // HOME ADDRESS
    homeAddress: string;
    homePostalCode: number;
    homeCity: string;
    homeState: string;
    homeCountry: string;
    // BUSINESS ADDRESS
    businessAddress: string;
    businessPostalCode: number;
    businessCity: string;
    businessState: string;
    businessCountry: string;

    dob: Date;
}


const initializePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            uid, dob, name, phone, gender, aadhaarImage, profileImage,serviceType,
            homeAddress, homeCity, homeCountry, homePostalCode, homeState,
            businessAddress, businessCity, businessCountry, businessPostalCode, businessState,

        } = req.body as partnerInitializationRequest;

        const newPartner = new Partner({
            uid, dob, name, phone, gender, aadhaarImage, profileImage, serviceType,
            homeAddress, homeCity, homeCountry, homePostalCode, homeState,
            businessAddress, businessCity, businessCountry, businessPostalCode, businessState,

        })

        await newPartner.save();
        res.status(201).send({
            message: 'Partner initialized successfully',
            partner: newPartner
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
        const user = await firebase.partner.auth.getUserByEmail(email);

        if (!user || !user.email) {
            res.status(204).send(); // No content
            return;
        }

        await firebase.partner.auth.generatePasswordResetLink(email);
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
        const user = await firebase.partner.auth.getUser(email);

        console.log(user, email)
        if (!user || !user.email) {
            return next(new Error(`No user associated with provided email ${email}`));
        }

        await firebase.partner.auth.generateEmailVerificationLink(email);
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
        const existingAadhaarImg = await PartnerAadhaar.findOne({uid});
        if (existingAadhaarImg) {
            res.status(409).send({
                message: 'Aadhaar image already exists',
                aadhaarImageObjectId: existingAadhaarImg._id,
            });
            return;
        }


        //     THE user is a valid Partner. already verified by the validator
        const file = req.file;

        if (!file) {
            next(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'));
            return;
        }

        const newAadhaarImageEntry = new PartnerAadhaar({
            uid,
            image_data: file.buffer,
            mimetype: file.mimetype,
            size: file.size
        });

        await newAadhaarImageEntry.save();
        res.status(201).send({
            message: 'Aadhaar image uploaded successfully',
            aadhaarImageObjectId: newAadhaarImageEntry._id
        });

        return;


    } catch (error) {
        next(error);

    }
}

const updateAadhaarImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }

    try {
        const {uid} = req.body as saveAadhaarImgRequest;
        const existingAadhaarImg = await PartnerAadhaar.findOne({uid});
        if (!existingAadhaarImg) {
            res.status(404).send({
                message: 'Aadhaar image not found. Please use POST Request instead.',
            });
            return;
        }

        const file = req.file;

        if (!file) {
            next(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'));
            return;
        }

        existingAadhaarImg.image_data = file.buffer;
        existingAadhaarImg.mimetype = file.mimetype;
        existingAadhaarImg.size = file.size;

        await existingAadhaarImg.save();
        res.status(200).send({
            message: 'Aadhaar image updated successfully',
            aadhaarImageObjectId: existingAadhaarImg._id
        });

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
        const existingProfileImg = await PartnerProfileImg.findOne({uid});
        if (existingProfileImg) {
            res.status(409).send({
                message: 'Profile image already exists',
                profileImageObjectId: existingProfileImg._id,
            });
            return;
        }


        //     THE user is a valid Partner. already verified by the validator
        const file = req.file;

        console.log("file", file)
        if (!file) {
            next(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'));
            return;
        }

        const newProfileImageEntry = new PartnerProfileImg({
            uid,
            image_data: file.buffer,
            mimetype: file.mimetype,
            size: file.size
        });

        await newProfileImageEntry.save();
        res.status(201).send({
            message: 'Profile image uploaded successfully',
            profileImageObjectId: newProfileImageEntry._id
        });

        return;


    } catch (error) {
        next(error);

    }
}


// NO INTERFACE FOR REQUEST. JUST PARAMS
const sendProfileImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {partnerFirebaseId} = req.params;

        const profileImg = await PartnerProfileImg.findOne({uid: partnerFirebaseId});

        if (!profileImg) {
            next(new Error('Requested Resource found.'));
        } else {
            res.setHeader('Content-Type', `${profileImg.mimetype}`); // cast to string.
            res.send(profileImg.image_data);
        }

    } catch (error) {
        next(error);
    }
}

const updateProfileImg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }

    try {
        const {uid} = req.body as saveProfileImgRequest;
        const existingProfileImg = await PartnerProfileImg.findOne({uid});
        if (!existingProfileImg) {
            res.status(404).send({
                message: 'Profile image not found. Please use POST Request instead.',
            });
            return;
        }

        const file = req.file;

        if (!file) {
            next(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'));
            return;
        }

        existingProfileImg.image_data = file.buffer;
        existingProfileImg.mimetype = file.mimetype;
        existingProfileImg.size = file.size;

        await existingProfileImg.save();
        res.status(200).send({
            message: 'Profile image updated successfully',
            profileImageObjectId: existingProfileImg._id
        });

    } catch (error) {
        next(error);
    }
}

// TODO: enable remove of their service entries as well (for future versions).
const enablePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    try {
        const {partnerFirebaseId} = req.params;
        await firebase.partner.auth.updateUser(partnerFirebaseId, {disabled: false})
        res.sendStatus(204);
        return
    } catch (err) {
        next(err);
    }
}


const disablePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    try {
        const {partnerFirebaseId} = req.params;
        await firebase.partner.auth.updateUser(partnerFirebaseId, {disabled: true})
        res.sendStatus(204);
        return
    } catch (err) {
        next(err);
    }

}

const getPartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    try {
        const {partnerFirebaseId} = req.params;
        const {img} = req.query;

        let options:QueryOptions = {maxTimeMS: 10000}
        img === 'true' ? options.populate = 'aadhaarImage profileImage' : null; // max limit of 10 seconds.


        const partner = await Partner.findOne(
            {uid: partnerFirebaseId},
            {},
            options
        );

        res.status(200).send({message: 'Partner found.',
            partner
        })

    } catch (e) {
        next(e);
    }
}


export default {
    sendPasswordResetEmail,
    sendVerificationEmail,
    initializePartner,
    saveAadhaarImg,
    saveProfileImg,
    sendProfileImg,
    updateAadhaarImg,
    updateProfileImg,
    enablePartner,
    disablePartner,
    getPartner,
};

