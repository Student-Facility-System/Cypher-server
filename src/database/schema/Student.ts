import mongoose, {Mongoose, Schema} from "mongoose";

const student:Schema = new mongoose.Schema(
    {
        uid: {type: String, required: true},
        name : {type: String, required: true},
        phone: {type: Number, required: true, unique: true},
        aadhaar: {type: mongoose.Types.ObjectId, ref: 'student-aadhaar', required:true},
            profile_image: {type: mongoose.Types.ObjectId, ref:"student-profileImg",  required: true},
        address: {type: String, required: true}, // where the student lives.
        postal_code: {type: Number, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        dob: {type: Date, required: true},
    })


export default mongoose.model('Student', student);