const readXlsxFile = require('read-excel-file/node')

const Guest = require('../models/guest_model')
const Event = require('../models/event_model')

class GuestController {
    createGuest(req, res) {
        const id = req.id

        res.status(404).json({
            message: 'Belom dibikin'
        })
    }

    async importGuestFromExcel(req, res) {
        try {
            const eventId = req.params.eventId

            if (req.file == undefined) return res.status(400).json({
                message: 'Hanya file excel yang diperbolehkan'
            })

            let path = './uploads/guest-list/' + req.file.filename
            let rows = await readXlsxFile(path)
            let data = []

            rows.shift()
            rows.forEach(row => {
                let doc = {
                    name: row[0],
                    category: row[1],
                    address: row[2],
                    eventId: eventId
                }
                data.push(doc)
            })

            let guest = await Guest.insertMany(data)

            res.status(201).json({
                message: 'Berhasil import guest dari excel',
                data: guest
            })

            const listGuestId = guest.map(a => a._id)

            let event = await Event.findById(eventId)
            event.guestList = listGuestId

            event.save()
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getGuestByEventId(req, res) {
        try {
            const eventId = req.params.eventId
            let result = await Guest.find({ eventId: eventId })

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

    async guestCheckin(req, res) {
        try {
            const guestId = req.params.guestId
            let result = await Guest.findById(guestId)

            if (result == null || result.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            const checkInTime = req.body.checkInTime
            if (checkInTime == null) return res.sendStatus(400)

            result.checkInTime = checkInTime

            let saveGuest = await result.save()

            res.status(201).json({
                message: 'Guest berhasil check in',
                data: saveGuest
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async guestPicture() {}

    addGuest(req, res) {
        const eventId = req.params.eventId
        const { name, category, checkInTime } = req.body
    }
}

module.exports = new GuestController