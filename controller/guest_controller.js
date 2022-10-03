const readXlsxFile = require('read-excel-file/node')

const Guest = require('../models/guest_model')
const Event = require('../models/event_model')
const { unlink } = require('node:fs/promises')

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

            await Guest.deleteMany({ eventId: eventId })

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

            await unlink(path)
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getGuestByEventId(req, res) {
        try {
            const eventId = req.params.eventId
            const { page = 1, limit = 10 } = req.query;

            let result = await Guest.find({ eventId: eventId })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            // get total documents in the Posts collection 
            const count = await Guest.countDocuments();

            if (result == null || result.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: result,
                totalPages: Math.ceil(count / limit),
                currentPage: page
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
            if (guestId == null) return res.sendStatus(400)

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

    async guestPicture() { }

    async searchGuest(req, res) {
        try {
            let keyword = {}
            const eventId = req.params.eventId

            if (!eventId) return res.sendStatus(400)

            if (req.query.keyword) {
                keyword =
                {
                    $or: [
                        { name: { $regex: req.query.keyword, $options: 'i' } },
                        { address: { $regex: req.query.keyword, $options: 'i' } }
                    ]
                }

            }

            let result = await Guest.find({
                $and: [
                    { eventId: eventId },
                    keyword
                ]
            })

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

    addGuest(req, res) {
        const eventId = req.params.eventId
        const { name, category, checkInTime } = req.body
    }
}

module.exports = new GuestController