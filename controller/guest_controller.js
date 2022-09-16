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

            console.log(data)

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

    addGuest(req, res) {
        const eventId = req.params.eventId
        const { name, category, checkInTime } = req.body
    }
}

module.exports = new GuestController