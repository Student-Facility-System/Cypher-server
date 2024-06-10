import mongoose, {Schema} from "mongoose";

const student:Schema = new mongoose.Schema(
    {
        uid: {type: String, required: true},
        name : {type: String, required: true},
        phone: {type: Number, required: true, unique: true},
            gender: {type: String, required: true},
        aadhaarImage: {type: mongoose.Types.ObjectId, ref: 'studentAadhaar', required:true},
            profileImage: {type: mongoose.Types.ObjectId, ref:"studentProfileImage",  required: true},
        address: {type: String, required: true}, // where the student lives.
        postalCode: {type: Number, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        dob: {type: Date, required: true},
    })


export default mongoose.model('Student', student);