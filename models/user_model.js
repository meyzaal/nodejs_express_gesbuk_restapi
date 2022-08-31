const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: String,
    role: {
        type: String,
        enum: ['User', 'Admin'],
    },
    accessToken: String
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)