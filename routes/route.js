const express = require('express');

const middleware = require('../middleware/middleware')

const AuthController = require('../controller/auth_controller')
const UserController = require('../controller/user_controller')
const EventController = require('../controller/event_controller')

const route = express.Router()
const api = '/api'

route.get('/', (req, res) => {
    res.send('hello world')
});

// user
route.get(api + '/user', middleware.verifyToken, UserController.getUserById)
route.get(api + '/user/all-user', middleware.verifyToken, UserController.getAllUser)
route.patch(api + '/user/change-password', middleware.verifyToken, UserController.changePassword)
route.patch(api + '/user', middleware.verifyToken, UserController.editUserInfo)
route.delete(api + '/user/:userId', middleware.verifyToken, UserController.deleteUser)

// auth
route.post(api + '/auth/register-admin', AuthController.registerAdmin)
route.post(api + '/auth/register-user', AuthController.registerUser)
route.post(api + '/auth/reset-password', middleware.verifyToken, AuthController.resetPassword)
route.post(api + '/auth/login', AuthController.login)

// event
route.post(api + '/event', middleware.verifyToken, EventController.createEvent)
route.get(api + '/event', middleware.verifyToken, EventController.getAllEvent)
route.get(api + '/event/:eventId', EventController.getEventById)
route.patch(api + '/event/:eventId', middleware.verifyToken, EventController.editEventInfo)

module.exports = route
