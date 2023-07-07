const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: String,
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    key: String,
    isEnrolled: {
        type: Boolean,
        default: false
    },
    eventType: {
        type: String,
        enum: ['birthday', 'concert', 'wedding', 'seminar', 'event'],
        default: 'event'
    },
    guestCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reportEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReportEvent'
    }
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)