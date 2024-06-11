import express, { Router } from 'express';
import multer from "../../../lib/multer.js"
import accommodationController from "../../../controllers/accommodation.controller.js";

const router = Router();
// TODO: add validators

// NOTE: mounted at /api/v1/accommodation

//add a building
router.post('/building', multer.upload.single('thumbnail'), accommodationController.building.addBuilding);

//get all buildings (search)
router.get('/building')


// /:buildingId (objectId)
// get info of 1 building
router.get('/building/:buildingId')

// update building info (with amenities)
router.patch('/building/:buildingId')

// delete a building
router.delete('/building/:buildingId')

// get all tickets for a building
router.get('/building/:buildingId/tickets')


// AMENITIES
// get all amenities
router.get('/building/:buildingId/amenities')

// patch amenities
router.patch('/building/:buildingId/amenities')


// ROOMS
router.get('/building/:buildingId/rooms')

router.post('/building/:buildingId/rooms', multer.upload.array('images', 6), accommodationController.room.addRoom)

// uses an array to delete. if any invalid roomId is present, then the correct ones are still deleted.
router.delete('/building/:buildingId/rooms')


// ROOM ID
router.get('/building/:buildingId/rooms/:roomId')

router.patch('/building/:buildingId/rooms/:roomId')

router.delete('/building/:buildingId/rooms/:roomId')

// hold a room
router.post('/building/:buildingId/rooms/:roomId/hold')

// release a room
router.post('/building/:buildingId/rooms/:roomId/release')

export default router;