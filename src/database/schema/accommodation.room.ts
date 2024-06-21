import mongoose from "mongoose";

const validRoomTypes:string[] = ['single', 'double', 'triple', 'quad', 'shared']
const validRentTypes:string[] = ['monthly', 'yearly']

// images needs to be uploaded together.

const room:mongoose.Schema = new mongoose.Schema({
    buildingId: {type: mongoose.Types.ObjectId, ref: "Building", required: true},
    roomNumber: {type: Number, required: true},
    roomSize: {type: String, required: true, enum: validRoomTypes},
    floor: {type: Number, required: false},
    rent: {type: Number, required: true}, // INR
    rentType: {type: String, required: true, enum:validRentTypes}, // Per month, Per year
    deposit: {type: Number, required: true}, // INR
    booked: {type: Boolean, default: false}, // defaults to false
    visible: {type: Boolean, default: false}, // defaults to False
    images: {type: [{
        imageData: {type: Buffer, required: true},
        mimetype: {type: String, required: true},
        size: {type: Number, required: true}
        }], required: true},
    activeTicket: {type: mongoose.Types.ObjectId, ref: "AccommodationTicket"},
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
}, {timestamps: true})




export default mongoose.model('Room', room);