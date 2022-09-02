const event = require('../models/event_model')
const user = require('../models/user_model')

class EventController {
    createEvent(req, res) {
        const { name, location, startDate, endDate, userId } = req.body
        const id = req.id

        user.findById(id)
            .then(result => {
                if (result == null) return res.sendStatus(403)
                if (result.role != 'Admin') return res.sendStatus(403)
                if ((name && location && startDate && endDate && userId) == null) return res.status(400).json({ message: 'Semua field wajib di isi' })

                const newEvent = new event({
                    name: name,
                    location: location,
                    startDate: startDate,
                    endDate: endDate,
                    userId: userId
                })

                newEvent.save()
                    .then(docs => {
                        res.status(201).json({
                            message: 'Berhasil menambahkan data',
                            data: docs
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                })
            })
    }

    getAllEvent(req, res) {
        const id = req.id

        user.findById(id)
            .then(result => {
                if (result == null) return res.sendStatus(403)
                if (result.role != 'Admin') return res.sendStatus(403)

                event.find()
                    .then(docs => {
                        if (docs == null) return res.status(404).json({
                            message: 'Data tidak ditemukan'
                        })
                        if (docs.length < 1) return res.status(404).json({
                            message: 'Data tidak ditemukan'
                        })

                        res.status(200).json({
                            message: 'Berhasil mendapatkan data',
                            data: docs
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                })
            })
    }

    getEventById(req, res) {
        const eventId = req.params.eventId

        event.findById(eventId)
            .then(result => {
                if (result == null) return res.status(404).json({
                    message: 'Data tidak ditemukan'
                })
                if (result.length < 1) return res.status(404).json({
                    message: 'Data tidak ditemukan'
                })

                res.status(200).json({
                    message: 'Berhasil mendapatkan data',
                    data: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                })
            })
    }

    editEventInfo(req, res) {
        const eventId = req.params.eventId
        const { name, location, startDate, endDate } = req.body
        const id = req.id

        user.findById(id)
            .then(doc => {
                if (doc == null) return res.sendStatus(403)
                if ((doc._id !== id) && (doc.role !== 'Admin')) return res.sendStatus(403)

                event.findById(eventId)
                    .then(result => {
                        if (result == null) return res.status(404).json({
                            message: 'Data tidak ditemukan'
                        })

                        result.name = name ?? result.name
                        result.location = location ?? result.location
                        result.startDate = startDate ?? result.startDate
                        result.endDate = endDate ?? result.endDate

                        result.save()
                            .then(docs => {
                                res.status(201).json({
                                    message: 'Data berhasil diubah',
                                    data: docs
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: err.message
                                })
                            })

                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                })
            })
    }
}

module.exports = new EventController