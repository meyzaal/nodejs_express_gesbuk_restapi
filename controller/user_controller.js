const user = require('../models/user_model')

class UserController {
    getAllUser(req, res) {
        const id = req.id
        user.findById(id)
            .then(result => {
                if (result == null) return res.sendStatus(401)
                if (result.role != 'Admin') return res.sendStatus(403)

                user.find()
                    .then(result => {
                        if (result.length > 0) {
                            res.status(200).json({
                                message: 'Berhasil mendapatkan data',
                                data: result
                            })
                        } else {
                            res.status(404).json({
                                message: 'Data tidak ditemukan'
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message
                        })
                    })
            })
    }

    getUserById(req, res) {
        const userId = req.id

        user.findById(userId)
            .then(result => {
                if (result != null) {
                    res.status(200).json({
                        message: 'Berhasil mendapatkan data',
                        data: result
                    })
                } else {
                    res.status(404).json({
                        message: 'Data tidak ditemukan'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                })
            })
    }

    editUserInfo(req, res) {
        const id = req.id
        const { name, email } = req.body

        user.findById(id)
            .then(result => {
                if (result == null) return res.status(404).json({
                    message: 'Data tidak ditemukan'
                })
                if (result.length < 1) return res.status(404).json({
                    message: 'Data tidak ditemukan'
                })

                result.name = name ?? result.name
                result.email = email ?? result.email

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
    }

    changePassword(req, res) {
        const { recentPassword, newPassword, confirmPassword } = req.body
        const id = req.id

        if ((recentPassword, newPassword, confirmPassword) == null) {
            res.status(400).json({
                message: 'Semua field wajib di isi!'
            })
        } else {
            user.findById(id)
                .then(async result => {
                    if (result != null) {
                        const match = await bcrypt.compare(recentPassword, result.password);

                        if (!match) return res.status(400).json({ message: 'Password lama salah' })
                        if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Password dan Konfirmasi Password tidak cocok!' })

                        result.password = newPassword
                        result.save()
                            .then(docs => {
                                res.status(200).json({
                                    message: 'Password berhasil diganti',
                                    data: docs,
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: err.message
                                })
                            })

                    } else {
                        res.status(404).json({
                            message: 'Data tidak ditemukan'
                        })
                    }
                })
        }
    }

    deleteUser(req, res) {
        const id = req.id
        const userId = req.params.userId

        user.findById(id)
            .then(result => {
                if (result == null) return res.sendStatus(403)
                if (result.role !== 'Admin') return res.sendStatus(403)

                user.deleteOne({ _id: userId })
                    .then(doc => {
                        if (doc == null) return res.sendStatus(400)
                        if (doc.deletedCount == 0) return res.status(404).json({
                            message: 'Akun tidak ditemukan'
                        })
                        res.status(201).json({
                            message: 'Data berhasil dihapus',
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

module.exports = new UserController