import mongoose, {Schema} from "mongoose";

const validServiceTypes = [
    'accommodation',
    'education'
]

const partner: Schema = new mongoose.Schema(
    {
        uid: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: Number, required: true, unique: true},
        gender: {type: String, required: true},
        serviceType: {type: String, required: true, enum: validServiceTypes},
        aadhaarImage: {type: mongoose.Types.ObjectId, ref: 'PartnerAadhaar', required: true},
        profileImage: {type: mongoose.Types.ObjectId, ref: "PartnerProfileImage", required: true},
        homeAddress: {type: String, required: true}, // where the Partner lives.
        homePostalCode: {type: Number, required: true},
        homeCity: {type: String, required: true},
        homeState: {type: String, required: true},
        homeCountry: {type: String, required: true},
        businessAddress: {type: String, required: true}, // where the Partner works.
        businessPostalCode: {type: Number, required: true},
        businessCity: {type: String, required: true},
        businessState: {type: String, required: true},
        businessCountry: {type: String, required: true},
        dob: {type: Date, required: true},
    })


export default mongoose.model('Partner', partner);