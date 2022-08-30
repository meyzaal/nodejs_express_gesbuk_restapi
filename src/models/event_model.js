const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest'
    }]
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)