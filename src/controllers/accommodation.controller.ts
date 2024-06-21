import {NextFunction, Request, Response} from 'express';
import {validationResult} from "express-validator";
import AccommodationBuilding from "../database/schema/accommodation.building.js";
import AccommodationRoom from "../database/schema/accommodation.room.js";
import AccommodationTicket from "../database/schema/accommodation.ticket.js";
// single image
interface addBuildingRequest {
    name: string;
    ownerName: string;
    ownerPhone: number;
    caretakerName: string;
    caretakerPhone: number;
    address: string;
    postalCode: number;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    type: string;
    // amenities
    ac: string;
    attachedWashroom: string;
    laundry: string;
    fans: string;
    food: string;
    parking: string;
    waterCooler: string;
    wifi: string;
    firebaseUser: string;
}
const addBuilding = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        if (!req.file) {
            res.status(400)
                .json({message: 'Thumbnail is required. No file received.' +
                        'Typically this will be caught by multer but just in case it is not,' +
                        'we are checking inside addBuilding function in controller.'});
            return;
        }


        const thumbnail = req.file;
        const data:addBuildingRequest = req.body;
        console.log(data)
        const building = new AccommodationBuilding({
            name: data.name,
            ownerName: data.ownerName, ownerPhone: data.ownerPhone,
            caretakerName: data.caretakerName, caretakerPhone: data.caretakerPhone,
            address: data.address, postalCode: data.postalCode, city: data.city,
            state: data.state, country: data.country, latitude: data.latitude, longitude: data.longitude,
            type: data.type,
            thumbnail: {
                imageData: thumbnail.buffer, mimetype: thumbnail.mimetype, size: thumbnail.size
            },
            amenities: {
                ac: data.ac,attachedWashroom: data.attachedWashroom, laundry: data.laundry, fans: data.fans,
                food: data.food, parking: data.parking, waterCooler: data.waterCooler, wifi: data.wifi
            },
            firebaseUser: data.firebaseUser
        });


        await building.save({});
        const responseObject = building.toObject();
        delete responseObject.thumbnail;


        res.status(201).json({message: 'Building added successfully', building: {...responseObject}});
        return;

    } catch (err) {
        next(err);

    } finally {


    }

};


const searchBuildings = async (req:Request, res:Response, next:NextFunction) => {
    res.status(200).json({message: 'Route is in development.'});
}

const getBuildingInfo = async (req:Request, res:Response, next:NextFunction) => {
//     there are no validation checks here.
    console.log(req.body)

    try {
        const buildingId = req.params.buildingId;
        const buildingData = await AccommodationBuilding.findById(buildingId);
        if (!buildingData) {
            res.status(400).json({message: 'Invalid building ID. No building found.'});
            return;
        }

        res.status(200).json({message: 'Building info found.', building: buildingData});

    } catch (err) {
        next(err);
    }
}

const deleteBuilding = async (req:Request, res:Response, next:NextFunction) => {
    try {
        console.log(req.body)

        const buildingId = req.params.buildingId;
    //     get all rooms of building
        const allRooms = await AccommodationRoom.find({buildingId: buildingId});

        // delete all rooms
        await AccommodationRoom.deleteMany({buildingId: buildingId});

        // delete building
        await AccommodationBuilding.deleteOne({_id: buildingId});

        res.status(200).json({message: 'Building deleted successfully', roomsDeleted: allRooms.length});

    } catch (err) {
        next(err);
    }
}



// ////////////////////////////////////////////ROOMS////////////////////////////////////////////

interface addRoomRequest {
    roomNumber: number;
    roomSize: string;
    floor: number;
    rent: number;
    rentType: string;
    deposit: number;
    visible?: string;
    // amenities
    ac: string;
    attachedWashroom: string;
    laundry: string;
    fans: string;
    food: string;
    parking: string;
    waterCooler: string;
    wifi: string;

}
// has multiple images
const addRoom = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)


    try {
        const buildingId = req.params.buildingId;
        console.log(buildingId);

        if (!buildingId) {
            res.status(400)
                .json({message: 'Building ID is required. No ID received form url.'});
            return;
        }



        const data:addRoomRequest = req.body;
        const images = req.files as Express.Multer.File[];

        if (!images) {
            res.status(400)
                .json({message: 'Images are required. No files received.' +
                        'Typically this will be caught by multer but just in case it is not,' +
                        'we are checking inside addRoom function in controller.'});
            return;
        }

        const newRoom = new AccommodationRoom({
            buildingId: buildingId,
            roomNumber: data.roomNumber,
            roomSize: data.roomSize,
            floor: data.floor,
            rent: data.rent,
            rentType: data.rentType,
            deposit: data.deposit,
            visible: data.visible,
            amenities: {
                ac: data.ac, attachedWashroom: data.attachedWashroom, laundry: data.laundry, fans: data.fans,
                food: data.food, parking: data.parking, waterCooler: data.waterCooler, wifi: data.wifi
            },
            images: images.map((image:Express.Multer.File) => {
                return {
                    imageData: image.buffer, mimetype: image.mimetype, size: image.size
                }

            })
        });




        // Check if building exists
        const building = await AccommodationBuilding.findById(buildingId);
        if (!building) {

            res.status(400).json({ message: 'Invalid building ID. No building found.' });
            return;
        }

        await newRoom.save({  });

        // Push new room to building
        await AccommodationBuilding.updateOne(
            { _id: buildingId },
            { $addToSet: { rooms: newRoom._id } }
        ).exec();

        const responseObject = newRoom.toObject();
        delete responseObject.images;



        res.status(201).json({message: 'Room added successfully', room: {...responseObject}});
        return;

    } catch (err) {

        next(err);
    } finally {


    }
};


const searchRooms = async (req:Request, res:Response, next:NextFunction) => {
    res.send('Route is in development');
    return;
}

// array of roomIds (accepted via JSON)
interface deleteRoomsRequest {
    roomIds: string[];
}

const deleteRooms = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        const buildingId = req.params.buildingId;
        const data:deleteRoomsRequest = req.body;
        const roomIds = data.roomIds;

        const deletedRooms = await AccommodationRoom.deleteMany({_id: {$in: roomIds}});

        // remove rooms from building
        await AccommodationBuilding.updateOne(
            {_id: buildingId},
            {$pull: {rooms: {$in: roomIds}}}
        ).exec();

        res.status(200).json({message: 'Rooms deleted successfully', roomsDeleted: deletedRooms.deletedCount});


    } catch (err) {
        next(err);
    }
}

const deleteRoom = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        const buildingId = req.params.buildingId;
        const roomId = req.params.roomId;

        const deletedRoom = await AccommodationRoom.findByIdAndDelete(roomId);
        if (!deletedRoom) {
            res.status(400).json({message: 'Invalid room ID. No room found.'});
            return;
        }

        // remove room from building
        await AccommodationBuilding.updateOne({_id: buildingId}, {$pull: {rooms: roomId}});




        res.status(200).json({message: 'Room deleted successfully', roomDeleted: deletedRoom});
        return;

    } catch (err) {
        next(err);
    }
}


const getRoomInfo = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        const roomId = req.params.roomId;
        const roomData = await AccommodationRoom.findById(roomId);
        if (!roomData) {
            res.status(400).json({message: 'Invalid room ID. No room found.'});
            return;
        }

        res.status(200).json({message: 'Room info found.', room: roomData});
        return;

    } catch (err) {
        next(err)
    }
}


interface holdRoomRequest {
    // roomId: string;
    // buildingId: string;
    ownedBy: string;
    // status: string;
    price: number;
    active: boolean;
}

const holdRoom = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        const roomId = req.params.roomId;
        const buildingId = req.params.buildingId;
        const reqData:holdRoomRequest = req.body;

        const roomData = await AccommodationRoom.findById(roomId);
        if (!roomData) {
            res.status(400).json({message: 'Invalid room ID. No room found.'});
            return;
        }

        if (roomData.booked) {
            res.status(400).json({message: 'Room is already booked.'});
            return;
        }

        // create new ticket
        const newTicket = new AccommodationTicket({
           roomId, buildingId, ownedBy: reqData.ownedBy, price: reqData.price, active: reqData.active
        });

        await newTicket.save({});
        // add ticket to room
        await AccommodationRoom.updateOne(
            { _id: roomId },
            {
                $set: {
                    activeTicket: newTicket._id,
                    booked: true
                }
            }
        ).exec();

        res.status(200).json({message: 'Room held successfully', ticket: newTicket});




    } catch (err) {
        next(err);

    }
}

const releaseRoom = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        const roomId = req.params.roomId;
        const roomData = await AccommodationRoom.findOne({_id: roomId});

        if (!roomData) {
            res.status(400).json({message: 'Invalid room ID. No room found.'});
            return;
        }

        // check to see if ticket's time expired. if it did, then release room. else throw err
        const ticket = await AccommodationTicket.findOne({roomId: roomId, active: true});
        if (!ticket) {
            res.status(400).json({message: 'No active ticket found for room.'});
            return;
        }

        // check if ticket is expired
        if (ticket.status === 'expired' && ticket.active === false) {
            res.status(200).json({message: 'Ticket is expired. Room is already released.'});
            return;
        }

        // if room is booked
        // room will never be booked because we haven't implemented booking yet.
        if (roomData.booked) {
            res.status(400).json({message: 'Room is already booked.'});
            return;
        }

        // release room
        await AccommodationRoom.updateOne(
            { _id: roomId },
            {
                $set: {
                    activeTicket: null,
                    booked: false
                }
            }).exec();

        // release ticket
        await AccommodationTicket.updateOne(
            { roomId: roomId, active: true },
            {
                $set: {
                    active: false,
                    status: 'expired'
                }
            }).exec();

        res.status(200).json({message: 'Room released successfully'});
        return;

    } catch (err) {
        next(err);
    }
}


/////////////////////////////////////////////TICKETS////////////////////////////////////////////


const getAllTickets = async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body)

    try {
        const buildingId = req.params.buildingId;
        const populated = req.query.populate === 'true'; // can be true or false

        const tickets = await AccommodationTicket.find(
            {buildingId: buildingId},
            {},
            {
                populate: populated ? 'ownedBy roomId' : ''
            });

        res.status(200).json({message: 'Tickets found.', tickets: tickets});
        return

    } catch (err) {
        next(err)
    }
}

export default {
    building : {addBuilding, searchBuildings, getBuildingInfo, deleteBuilding, getAllTickets},
    room: {addRoom, searchRooms, deleteRooms, deleteRoom, getRoomInfo, holdRoom, releaseRoom},
    tickets: {}
}