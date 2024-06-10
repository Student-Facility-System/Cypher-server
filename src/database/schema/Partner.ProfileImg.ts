import mongoose, {Schema} from "mongoose";

const student:Schema = new mongoose.Schema(
    {
        uid: {type: String, required: true, ref:"Partner"},
        image_data: {type: Buffer, required: true},
        mimetype: {type:String, required: true},
        size: {type:Number, required: true},
    })


export default mongoose.model('PartnerProfileImage', student);