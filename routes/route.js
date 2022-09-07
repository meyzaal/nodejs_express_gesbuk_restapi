const express = require('express');

const uploadFile = require('../utils/upload_file')

const Middleware = require('../middleware/middleware')

const AuthController = require('../controller/auth_controller')
const UserController = require('../controller/user_controller')
const EventController = require('../controller/event_controller')
const GuestController = require('../controller/guest_controller')

const route = express.Router()
const api = '/api'

route.get('/', (req, res) => {
    res.send('hello world')
});

// user
route.get(api + '/user', Middleware.verifyAccessToken, UserController.getUserById)
route.get(api + '/user/all-user', Middleware.verifyAccessToken, UserController.getAllUser)
route.patch(api + '/user/change-password', Middleware.verifyAccessToken, UserController.changePassword)
route.patch(api + '/user', Middleware.verifyAccessToken, UserController.editUserInfo)
route.delete(api + '/user/:userId', Middleware.verifyAccessToken, UserController.deleteUser)

// auth
route.post(api + '/auth/register-admin', AuthController.registerAdmin)
route.post(api + '/auth/register-user', AuthController.registerUser)
route.post(api + '/auth/reset-password', Middleware.verifyAccessToken, AuthController.resetPassword)
route.post(api + '/auth/login', AuthController.login)

// event
route.post(api + '/event', Middleware.verifyAccessToken, EventController.createEvent)
route.get(api + '/event', Middleware.verifyAccessToken, EventController.getAllEvent)
route.get(api + '/event/:eventId', Middleware.verifyAccessToken ,EventController.getEventById)
route.patch(api + '/event/:eventId', Middleware.verifyAccessToken, EventController.editEventInfo)
route.put(api + '/event/add-user', Middleware.verifyAccessToken, EventController.addUserToEvent)

route.post(api + '/guest/import-guest/:eventId', uploadFile('excel').single('uploadFile'), GuestController.importGuestFromExcel)

module.exports = route
