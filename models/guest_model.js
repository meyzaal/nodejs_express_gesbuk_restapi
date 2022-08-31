const mongoose = require('mongoose')

const guestSchema = mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    category: {
        type: String,
        enum: ['VIP, Reguler'],
        default: 'Reguler'
    },
    checkInTime: Date,
    picture: String,
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
}, { timestamps: true })

module.exports = mongoose.model('Guest', guestSchema)