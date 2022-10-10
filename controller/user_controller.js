const User = require('../models/user_model')

class UserController {
    async getAllUser(req, res) {
        try {
            let user = await User.find()
            if (user == null || user.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getUser(req, res) {
        try {
            const userData = req.userData

            if (userData == null || userData.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            res.status(200).json({
                message: 'Berhasil mendapatkan data',
                data: userData
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async editUserInfo(req, res) {
        try {
            const userData = req.userData
            const id = userData._id
            const { name, email, picture, phone } = req.body

            let user = await User.findById(id)
            if (user == null || user.length < 1) return res.status(404).json({
                message: 'Data tidak ditemukan'
            })

            user.name = name ?? user.name
            user.email = email ?? user.email
            user.picture = picture ?? user.picture
            user.phone = phone ?? user.phone ?? null

            let saveUser = await user.save()
            res.status(201).json({
                message: 'Data berhasil diubah',
                data: saveUser
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async testUploadFile(req, res) {
        try {
            if (req.file == undefined) return res.status(400).json({
                message: 'Hanya file image yang diperbolehkan'
            })

            let path = './uploads/guest-picture/' + req.file.filename

            res.status(201).json({
                message: 'Berhasil import guest dari excel',
                data: path
            })

            await unlink(path)
        } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = new UserController