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
    role: {
        type: String,
        enum: ['User', 'Admin'],
        required: true
    },
    firebaseUid: String,
    picture: String,
    accessToken: String
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)