const express = require('express');
const AuthController = require('../controller/auth_controller');
const UserController = require('../controller/user_controller')


const route = express.Router()
const api = '/api'

route.get('/', (req, res) => {
    res.send('hello world')
});

route.get(api + '/user', UserController.getAllUser)
route.get(api + '/user/:userId', UserController.getUserById)

route.post(api + '/register-admin', AuthController.registerAdmin)
route.post(api + '/register-user', AuthController.registerUser)
route.post(api + '/login', AuthController.login)

module.exports = route
