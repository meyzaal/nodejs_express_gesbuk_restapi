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
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest'
    }]
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)