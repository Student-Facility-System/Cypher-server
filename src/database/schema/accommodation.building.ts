import mongoose, {Schema} from "mongoose";

const validBuildingTypes:string[] = ['hostel', 'pg', 'dorm', 'apartment', 'flat']

const building:Schema = new mongoose.Schema(
    {
        name: {type: String},
        ownerName: {type: String},
        ownerPhone: {type: Number},
        caretakerName: {type: String},
        caretakerPhone: {type: Number},
        address: {type: String},
        postalCode: {type: Number},
        city: {type: String},
        state: {type: String},
        country: {type: String},
        latitude: {type: Number},
        longitude: {type: Number},
        type: {type: String, required: true, enum: validBuildingTypes},
        thumbnail: {
            imageData: {type: Buffer, required: true},
            mimetype: {type: String, required: true},
            size: {type: Number, required: true},
        },
        rooms: [{type: mongoose.Types.ObjectId, ref: "Room"}],
        amenities: {
            ac: {type: String, required:true},
            attachedWashroom: {type: String, required:true},
            laundry: {type: String, required:true},
            fans: {type: String, required:true},
            food: {type: String, required:true},
            parking: {type: String, required:true},
            waterCooler: {type: String, required:true},
            wifi: {type: String, required:true},
        },
    firebaseUser: {type:String, ref: "Partner"}, // firebase UID
    }, {timestamps: true})


export default mongoose.model('Building', building);