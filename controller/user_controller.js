const user = require('../models/user_model')

class UserController {
    async getAllUser(req, res) {
        await user.find()
            .then(result => {
                if (result.length < 0) {
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
                res.status(500).json(err.message)
            })
    }

    async getUserById(req, res) {
        const userId = req.params.userId

        await user.findById(userId)
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
                res.status(500).json(err.message)
            })
    }
}

module.exports = new UserController