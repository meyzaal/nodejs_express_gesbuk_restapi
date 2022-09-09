const readXlsxFile = require('read-excel-file/node')

const guest = require('../models/guest_model')
const event = require('../models/event_model')

class GuestController {
    createGuest(req, res) {
        const id = req.id

        res.status(404).json({
            message: 'Belom dibikin'
        })
    }

    importGuestFromExcel(req, res) {
        const eventId = req.params.eventId

        if (req.file == undefined) return res.status(400).json({
            message: 'Hanya file excel yang diperbolehkan'
        })

        let path = './uploads/guest-list/' + req.file.filename

        readXlsxFile(path)
            .then(rows => {
                rows.shift()

                let data = []

                rows.forEach(row => {
                    let doc = {
                        name: row[0],
                        category: row[1],
                        address: row[2],
                        eventId: eventId
                    }

                    data.push(doc)
                })

                guest.insertMany(data)
                    .then(result => {
                        res.status(201).json({
                            message: 'Berhasil import guest dari excel',
                            data: result
                        })

                        let listGuestId = result.map(a => a._id)

                        event.findById(eventId)
                            .then(docs => {
                                docs.guestList = listGuestId

                                docs.save()
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


            })

    }

    addGuest(req, res) {
        const eventId = req.params.eventId
        const { name, category, checkInTime } = req.body
    }
}

module.exports = new GuestController