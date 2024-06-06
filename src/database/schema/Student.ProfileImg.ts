import mongoose, {Schema} from "mongoose";

const student:Schema = new mongoose.Schema(
    {
        uid: {type: String, required: true, ref:"Student"},
        image_data: {type: Buffer, required: true},
        mimetype: {type:String, required: true},
        size: {type:Number, required: true},
    })


export default mongoose.model('StudentProfileImage', student);