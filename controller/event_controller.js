const makeid = require('../utils/random_string')
const Event = require('../models/event_model')
const Guest = require('../models/guest_model')

class EventController {
    async createEvent(req, res) {
        try {
            const { name, location, startDate, imageUrl, eventType } = req.body

            if ((name && location && startDate && eventType) == null) return res.status(400).json({ message: 'Semua field wajib di isi' })

            let defaultImage

            switch (eventType) {
                case 'wedding':
                    defaultImage = 'https://images.unsplash.com/photo-1553915632-175f60dd8e36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                    break;
                case 'birthday':
                    defaultImage = 'https://images.unsplash.com/photo-1562967005-a3c85514d3e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                    break;
                case 'seminar':
                    defaultImage = 'https://images.unsplash.com/photo-1544531585-f14f463149ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
                    break;
                case 'concert':
                    defaultImage = 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80'
                    break;

                default:
                    defaultImage = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80'
                    break;
            }

            const key = makeid(10)
            let newEvent = new Event({
                name: name,
                location: location,
                startDate: startDate,
                key: key,
                imageUrl: imageUrl ?? defaultImage,
                eventType: eventType
            })

            let saveEvent = await newEvent.save()

            res.status(201).json({
                message: 'Berhasil menambahkan data',
                data: saveEvent
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getAllEvent(req, res) {
        try {
            let result = await Event.find().populate('user').exec()

            // if (result == null || result.length < 1) return res.status(404).json({
            //     message: 'Data tidak ditemukan'
            // })

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: result
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getEventUser(req, res) {
        try {
            const user = req.userData
            let result = await Event.find({ user: user._id }).populate('user').exec()

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: result
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getEventById(req, res) {
        try {
            const eventId = req.params.eventId

            let result = await Event.findById(eventId).populate('user').exec()

            if (result == null || result.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: result
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async editEventInfo(req, res) {
        try {
            const eventId = req.params.eventId
            const { name, location, startDate, imageUrl, eventType } = req.body

            let event = await Event.findById(eventId)
            if (event == null || event.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            const newKey = makeid(10)

            event.name = name ?? event.name
            event.location = location ?? event.location
            event.startDate = startDate ?? event.startDate
            event.imageUrl = imageUrl ?? event.imageUrl
            event.eventType = eventType ?? event.eventType
            event.key = newKey

            let saveEvent = await event.save()

            res.status(201).json({
                message: 'Data berhasil diubah',
                data: saveEvent
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async addUserToEvent(req, res) {
        try {
            const userData = req.userData
            const id = userData._id
            const key = req.query.key

            let event = await Event.findOne({ key: key })
            if (event == null) {
                return res.status(403).json({
                    message: 'Kode event salah',
                })
            }
            if (event.isEnrolled == true) {
                return res.status(403).json({
                    message: 'Event tidak bisa di enroll',
                })
            }

            event.user = id
            event.isEnrolled = true
            event.key = null

            await event.save()

            res.status(201).json({
                message: 'User berhasil ditambahkan ke event',
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getUpcomingEvent(req, res) {
        try {
            const user = req.userData
            let result = await Event.find({ user: user._id }).populate('user').exec()

            if (result == null || result.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            const upcomingEvent = result.filter(event => event.startDate >= Date.now())

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: upcomingEvent
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async deleteEvent(req, res) {
        try {
            const eventId = req.params.eventId
            console.log(eventId);

            let deleteEvent = await Event.findOneAndDelete(eventId)
            console.log(deleteEvent)

            res.status(200).json({
                message: 'Berhasil menghapus data event dan tamunya'
            })

            let deleteGuests = await Guest.deleteMany({ eventId: eventId })
            console.log(deleteGuests)
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = new EventController