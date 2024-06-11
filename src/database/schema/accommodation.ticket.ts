import mongoose from "mongoose";

// active means room is on hold, expired means no longer on hold. booked means the user has paid and the room is now booked.
// NOTE: currently tickets are only used for testing, so only roomId, buildingId, ownedBy, status are required.

// when a user sends a get request on a room. the room is checked for active tickets. if there are any, then the user is shown that the room is on hold.
// at that time, if previous ticket is expired, it will be disassociated from the room and the room will be available again.
// this process will not be done via a cron job, but will be done on the fly when a user requests a room. although, a cron job can be added later.

const AccommodationTicket:mongoose.Schema = new mongoose.Schema({
    roomId: {type: mongoose.Types.ObjectId, ref: "Room", required: true},
    buildingId: {type: mongoose.Types.ObjectId, ref: "Building", required: true},
    ownedBy: {type: String, ref: "Student", required: true},
    validTill: {type: Date, required: true, max: Date.now() + 1000*60*60*24*4}, // 4 days
    status: {type: String, required: false, default:"active", enum:['active', 'booked', 'expired']},
    price: {type: Number, required: false},
    active: {type: Boolean, default: true},
}, {timestamps: true
})

export default mongoose.model('AccommodationTicket', AccommodationTicket);