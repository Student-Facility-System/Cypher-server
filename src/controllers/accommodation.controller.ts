import {NextFunction, Request, Response} from 'express';
import {validationResult} from "express-validator";
import AccommodationBuilding from "../database/schema/accommodation.building.js";
import AccommodationRoom from "../database/schema/accommodation.room.js";

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
    ac: boolean;
    attachedWashroom: boolean;
    laundry: boolean;
    fans: boolean;
    food: boolean;
    parking: boolean;
    waterCooler: boolean;
    wifi: boolean;
    firebaseUser: string;
}
const addBuilding = async (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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



interface addRoomRequest {
    roomNumber: number;
    roomSize: string;
    floor: number;
    rent: number;
    rentType: string;
    deposit: number;
    availability: boolean;
    visible: boolean;
    // amenities
    ac: boolean;
    attachedWashroom: boolean;
    laundry: boolean;
    fans: boolean;
    food: boolean;
    parking: boolean;
    waterCooler: boolean;
    wifi: boolean;

}
// has multiple images
const addRoom = async (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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
            availability: data.availability,
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
        const building = await AccommodationBuilding.findById(buildingId)
        if (!building) {

            res.status(400).json({ message: 'Invalid building ID. No building found.' });
            return;
        }

        await newRoom.save({  });
        const responseObject = newRoom.toObject();
        delete responseObject.images;



        res.status(201).json({message: 'Room added successfully', room: {...responseObject}});
        return;

    } catch (err) {

        next(err);
    } finally {


    }
};





export default {
    building : {addBuilding},
    room: {addRoom}
}