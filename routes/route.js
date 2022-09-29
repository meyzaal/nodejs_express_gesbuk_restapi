const express = require('express');

const uploadFile = require('../utils/upload_file')

const Middleware = require('../middleware/middleware')

const AuthController = require('../controller/auth_controller')
const UserController = require('../controller/user_controller')
const EventController = require('../controller/event_controller')
const GuestController = require('../controller/guest_controller');

const route = express.Router()
const api = '/api/v1'

route.get('/', (req, res) => {
    res.send('hello world')
});

// auth
route.post(api + '/auth/google-validate', Middleware.verifyFirebaseToken, AuthController.googleValidate)
route.post(api + '/auth/register-admin', AuthController.registerAdmin)

// user
route.get(api + '/user', Middleware.verifyFirebaseToken, UserController.getUser)
route.get(api + '/user/all-user', Middleware.verifyFirebaseToken, Middleware.verifyAdmin, UserController.getAllUser)
route.patch(api + '/user', Middleware.verifyFirebaseToken, UserController.editUserInfo)

// event
route.post(api + '/event', Middleware.verifyFirebaseToken, Middleware.verifyAdmin, EventController.createEvent)
route.get(api + '/event', Middleware.verifyFirebaseToken, Middleware.verifyUser, EventController.getEventUser)
route.get(api + '/event/all-event', Middleware.verifyFirebaseToken, Middleware.verifyAdmin, EventController.getAllEvent)
route.get(api + '/event/:eventId', Middleware.verifyFirebaseToken, EventController.getEventById)
route.patch(api + '/event/:eventId', Middleware.verifyFirebaseToken, EventController.editEventInfo)
route.put(api + '/event/add-user', Middleware.verifyFirebaseToken, Middleware.verifyUser, EventController.addUserToEvent)

// guest
route.post(api + '/guest/import-guest/:eventId', Middleware.verifyFirebaseToken, Middleware.verifyAdmin, uploadFile('excel').single('uploadFile'), GuestController.importGuestFromExcel)
route.get(api + '/guest/from-event/:eventId', Middleware.verifyFirebaseToken, GuestController.getGuestByEventId)
route.get(api + '/guest/from-event/:eventId/search', GuestController.searchGuest)
route.patch(api + '/guest/check-in/:guestId', Middleware.verifyFirebaseToken, GuestController.guestCheckin)

module.exports = route
