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
        enum: ['user', 'admin'],
    },
    phone: String,
    picture: String
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)