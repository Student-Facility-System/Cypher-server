import {check, ValidationChain} from "express-validator";
import firebase from "../../firebase/index.js";
import {FirebaseError} from "firebase/app";

// SECTION 1 ///////////// BUILDING //////////////////
const validBuildingTypes:string[] = ['hostel', 'pg', 'dorm', 'apartment', 'flat']
const addBuilding:ValidationChain[] = [
    check(['name', 'ownerName', 'caretakerName']).
    isString().
    withMessage('All Names must be a non empty string.'),

    check(['ownerPhone', 'caretakerPhone']).isMobilePhone('en-IN').withMessage('Invalid Phone Number'),

    check('address').
    isString().
    withMessage('Address must be a non empty string.'),

    check(['city', 'state', 'country']).
    isString().
    withMessage('Invalid City, State or Country'),

    check('postalCode').
    isPostalCode('IN').
    withMessage('Invalid Postal Code. Must be a valid Indian Postal Code (INT)'),

    check('type').
    isString().
    isIn(validBuildingTypes),

    check(['latitude', 'longitude']).
    isNumeric().
    withMessage('Invalid Coordinates').
    custom((value) => {
        if (value > 90 || value < -90) {
            throw new Error('Invalid Latitude or Longitude. values must be between -90 and 90');
        } else {
            return true;
        }
    }),

    check(['ac', 'attachedWashroom', 'laundry', 'fans', 'food', 'parking', 'waterCooler', 'wifi']).
        isBoolean().withMessage('Invalid Value for Amenities. expected Boolean.'),

    check('firebaseUser').isString().custom(async (value) => {
        const user = await firebase.partner.auth.getUser(value);
        if (user.disabled) {
            throw new Error('User is disabled');
        }
    })

]

// SECTION 2 ///////////// ROOM //////////////////
const validRoomTypes:string[] = ['single', 'double', 'triple', 'quad', 'shared']
const validRentTypes:string[] = ['monthly', 'yearly']
//add room
const addRoom:ValidationChain[] = [
    check('roomNumber').
    isNumeric().
    withMessage('Invalid Room Number'),

    check('roomSize').
    isString().
    isIn(validRoomTypes).
    withMessage('Invalid Room Size'),

    check('floor').
    isNumeric().
    withMessage('Invalid Floor Number'),

    check('rent').
    isNumeric().
    withMessage('Invalid Rent'),

    check('rentType').
    isString().
    isIn(validRentTypes).
    withMessage('Invalid Rent Type'),

    check('deposit').
    isNumeric().
    withMessage('Invalid Deposit'),

    check('visible').
    isBoolean().
    withMessage('Invalid Value for Visibility'),

    check(['ac', 'attachedWashroom', 'laundry', 'fans', 'food', 'parking', 'waterCooler', 'wifi']).
    isBoolean().
    withMessage('Invalid Value for Amenities')

]

// delete room
const deleteRoom:ValidationChain[] = [
    check('roomIds').isArray().withMessage('roomIds must be an array of strings')]

const holdRoom:ValidationChain[] = [
    check('ownedBy').
    isString(),

    check('price').
    isNumeric().
    custom((value) => {if (value < 0) throw new Error('Price must be a positive number')}),

    check('active').
    isBoolean()
]

export default {
    building : {addBuilding},
    room: {addRoom, deleteRoom, holdRoom}
}