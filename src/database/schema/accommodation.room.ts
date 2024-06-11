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
    activeTickets: [{type: mongoose.Types.ObjectId, ref: "AccommodationTicket"}],
    amenities: {
        ac: {type: Boolean, required:true},
        attachedWashroom: {type: Boolean, required:true},
        laundry: {type: Boolean, required:true},
        fans: {type: Boolean, required:true},
        food: {type: Boolean, required:true},
        parking: {type: Boolean, required:true},
        waterCooler: {type: Boolean, required:true},
        wifi: {type: Boolean, required:true},
    },
}, {timestamps: true})




export default mongoose.model('Room', room);