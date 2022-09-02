const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const user = require('../models/user_model')

class AuthController {
    registerAdmin(req, res) {
        const { name, email, password, confirmPassword } = req.body

        if ((name && email && password && confirmPassword) == null) {
            res.status(400).json({
                message: 'Semua field wajib di isi'
            })
        } else {
            user.findOne({ email: email })
                .then(async result => {
                    if (result != null) {
                        res.status(400).json({
                            message: 'Email sudah terdaftar'
                        })
                    } else if (password !== confirmPassword) {
                        res.status(400).json({
                            message: 'Password dan Konfirmasi Password tidak cocok!'
                        })
                    } else {
                        let salt = await bcrypt.genSalt()
                        let hashPassword = await bcrypt.hash(password, salt)

                        const newAdmin = new user({
                            name: name,
                            email: email,
                            password: hashPassword,
                            role: 'Admin'
                        });

                        newAdmin.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'Berhasil membuat akun Admin',
                                    data: result
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: err.message
                                })
                            })
                    }
                })
        }
    }

    registerUser(req, res) {
        const { name, email, password = '123456' } = req.body

        if ((name && email && password) == null) {
            res.status(400).json({
                message: 'Semua field wajib di isi'
            })
        } else {
            user.findOne({ email: email })
                .then(async result => {
                    if (result != null) {
                        res.status(400).json({
                            message: 'Email sudah terdaftar'
                        })
                    } else {
                        const salt = await bcrypt.genSalt()
                        const hashPassword = await bcrypt.hash(password, salt)

                        const newUser = new user({
                            name: name,
                            email: email,
                            password: hashPassword,
                            role: 'User'
                        })

                        newUser.save()
                            .then(docs => {
                                res.status(201).json({
                                    message: 'Berhasil membuat akun User',
                                    data: docs
                                })
                            })
                            .catch(err => {
                                res.status(500).json({ message: err.message })
                            })
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        message: err.message
                    })
                })
        }
    }

    login(req, res) {
        const { email, password } = req.body;

        if ((email && password) == null) {
            res.status(400).json({
                message: 'Semua field wajib di isi!'
            })
        } else {
            user.findOne({ email: email })
                .then(async result => {
                    if (result != null) {
                        const match = await bcrypt.compare(password, result.password);
                        if (!match) {
                            res.status(400).json({
                                message: 'Password Salah'
                            })
                        } else {
                            const id = result._id
                            const email = result.email
                            const role = result.role
                            const accessToken = jwt.sign({ id, email, role }, process.env.ACCESS_TOKEN_SECRET)

                            result.accessToken = accessToken

                            result.save()
                                .then(docs => {
                                    res.status(200).json({
                                        message: 'Berhasil Login',
                                        data: docs,
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json(err)
                                });
                        }
                    } else {
                        res.status(400).json({
                            message: 'Email salah'
                        })
                    }
                }).catch(err => {
                    res.status(500).json({
                        message: err.message
                    })
                })
        }
    }

    resetPassword(req, res) {
        const { newPassword, confirmPassword, email } = req.body
        const id = req.id

        user.findById(id)
            .then(result => {
                if (result != null) {
                    if (result.role != 'Admin') return res.sendStatus(403)
                    if ((newPassword && confirmPassword && email) == null) return res.status(400).json({ message: 'Semua field wajib di isi!' })

                    user.findOne({ email: email })
                        .then(async docs => {
                            if (docs != null) {
                                if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Password dan Konfirmasi Password tidak cocok!' })

                                const salt = await bcrypt.genSalt()
                                const hashPassword = await bcrypt.hash(newPassword, salt)

                                docs.password = hashPassword
                                docs.save()
                                .then(doc => {
                                    res.status(201).json({
                                        message: 'Reset password berhasil',
                                        data: doc
                                    })
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
                } else {
                    res.sendStatus(403)
                }
            })
    }
}

module.exports = new AuthController