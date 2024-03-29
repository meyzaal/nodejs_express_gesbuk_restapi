const mongoose = require('mongoose')

const reportEventSchema = mongoose.Schema({
    guestPresent: {
        type: Number,
        required: true,
        default: 0
    },
    guestAbsent: {
        type: Number,
        required: true,
        default: 0
    },
    percentage: {
        type: Number,
        required: true,
        default: 0
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
}, { timestamps: true })

module.exports = mongoose.model('ReportEvent', reportEventSchema)