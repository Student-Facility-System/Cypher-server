// NOTE: mounted at /api/v1/accommodation
import { Router } from 'express';
import multer from "../../../lib/multer.js"
import accommodationController from "../../../controllers/accommodation.controller.js";
import accommodationValidators from "../../../middlewares/validators/accommodation.validators.js";

const router = Router();


/*
* POST /api/v1/accommodation/building
* */
router.post(
    '/building',
    multer.upload.single('thumbnail'),
    accommodationValidators.building.addBuilding,
    accommodationController.building.addBuilding);

/*
* GET /api/v1/accommodation/building
* */
router.get(
    '/building',
    accommodationController.building.searchBuildings);


/*
* GET /api/v1/accommodation/building/:buildingId
* get specific building info
* */
router.get(
    '/building/:buildingId',
    accommodationController.building.getBuildingInfo)

// update building info (with amenities)
router.patch(
    '/building/:buildingId')

// delete a building
router.delete(
    '/building/:buildingId',
    accommodationController.building.deleteBuilding)


// get all tickets for a building
// GET /api/v1/accommodation/building/:buildingId/tickets?populate=true/false
router.get(
    '/building/:buildingId/tickets',
    accommodationController.building.getAllTickets)


// AMENITIES
// get all amenities
router.get(
    '/building/:buildingId/amenities')

// patch amenities
router.patch(
    '/building/:buildingId/amenities')


// ROOMS
// get all rooms of a building (search)
router.get(
    '/building/:buildingId/rooms',
    accommodationController.room.searchRooms)

// Add room
router.post(
    '/building/:buildingId/rooms',
    multer.upload.array('images', 6),
    accommodationValidators.room.addRoom,
    accommodationController.room.addRoom)

// uses an array to delete. if any invalid roomId is present, then the correct ones are still deleted.

router.delete(
    '/building/:buildingId/rooms',
    accommodationValidators.room.deleteRoom,
    accommodationController.room.deleteRooms)


// ROOM ID
router.get('/building/:buildingId/rooms/:roomId', accommodationController.room.getRoomInfo)

router.patch('/building/:buildingId/rooms/:roomId')

router.delete('/building/:buildingId/rooms/:roomId', accommodationController.room.deleteRoom)

// hold a room
router.post(
    '/building/:buildingId/rooms/:roomId/hold',
    accommodationValidators.room.holdRoom,
    accommodationController.room.holdRoom)

// release a room
router.post('/building/:buildingId/rooms/:roomId/release', accommodationController.room.releaseRoom)

export default router;