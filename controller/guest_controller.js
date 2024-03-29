const readXlsxFile = require('read-excel-file/node')

const Guest = require('../models/guest_model')
const Event = require('../models/event_model')
const ReportEvent = require('../models/report_event_model')

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
            if (!eventId) return res.sendStatus(400)

            await Guest.deleteMany({ eventId: eventId })

            if (req.file == undefined) return res.status(400).json({
                message: 'Hanya file excel yang diperbolehkan'
            })

            let path = `./uploads/guest-list/${req.file.filename}`
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

            let event = await Event.findById(eventId)
            event.guestCount = data.length
            await event.save()

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
            if (!eventId) return res.sendStatus(400)

            const { page, limit, keyword } = req.query;

            let search = {}

            if (keyword) {
                search =
                {
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } }
                    ]
                }
            }

            let result = await Guest.find({
                $and: [
                    { eventId: eventId },
                    search
                ]
            })
                .limit(limit * 1)
                .skip((parseInt(page) - 1) * limit)
                .exec()

            // get total documents in the guest(eventId) collection 
            const count = await Guest.find({
                $and: [
                    { eventId: eventId },
                    search
                ]
            }).countDocuments();

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: result,
                currentPage: parseInt(page),
                totalResults: count,
                totalPages: Math.ceil(count / limit),

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
            if (!guestId) return res.sendStatus(400)

            let result = await Guest.findById(guestId)

            if (result == null || result.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            const checkInTime = req.body.checkInTime
            if (!checkInTime) return res.sendStatus(400)

            if (result.checkInTime != null) {
                return res.status(403).json({
                    message: 'Tamu sudah check-in'
                })
            }

            result.checkInTime = checkInTime

            let saveGuest = await result.save()

            const eventId = saveGuest.eventId
            const guestsPresent = await Guest.countDocuments({ eventId: eventId, checkInTime: { $ne: null } })
            const guestsAbsent = await Guest.countDocuments({ eventId: eventId, checkInTime: null })
            const totalGuests = guestsPresent + guestsAbsent
            const percentage = (totalGuests > 0) ? (guestsPresent / totalGuests) * 100 : 0

            const filter = { eventId: eventId }
            const update = {
                guestPresent: guestsPresent,
                guestAbsent: guestsAbsent,
                percentage: percentage
            }
            await ReportEvent.findOneAndUpdate(filter, update);

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

    async uploadGuestPhoto(req, res) {
        try {
            const guestId = req.params.guestId
            if (guestId == null) return res.sendStatus(400)

            let result = await Guest.findById(guestId)

            if (result == null || result.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            if (req.file == undefined) return res.status(400).json({
                message: 'Hanya file image yang diperbolehkan'
            })

            const path = req.file.path
            result.picture = path

            let savedGuest = await result.save()

            res.status(201).json({
                message: 'Berhasil menambahkan foto tamu',
                data: savedGuest
            })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message: error.message
            })
        }
    }

    async addGuest(req, res) {
        try {
            const eventId = req.params.eventId
            if (eventId == null) return res.sendStatus(400)

            let event = await Event.findById(eventId)
            if (event == null || event.length < 1) return res.status(404).json({
                message: 'Event tidak ditemukan'
            })

            const { name, address, category } = req.body
            if ((name && address && category) == null) return res.status(400).json({ message: 'Semua field wajib di isi' })

            let newGuest = new Guest({
                name: name,
                address: address,
                category: category,
                eventId: eventId
            })

            let savedGuest = await newGuest.save()
            let guestId = savedGuest._id

            event.guestList.add(guestId)
            await event.save()

            res.status(201).json({
                message: 'Berhasil menambahkan Guest',
                data: savedGuest
            })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = new GuestController