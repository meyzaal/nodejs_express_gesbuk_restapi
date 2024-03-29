const mongoose = require('mongoose')

const guestSchema = mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['vip', 'reguler'],
        default: 'reguler'
    },
    checkInTime: Date,
    picture: String,
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
}, { timestamps: true })

module.exports = mongoose.model('Guest', guestSchema)