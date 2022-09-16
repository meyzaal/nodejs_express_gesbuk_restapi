const {
    getAuth: getClientAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    createUserWithEmailAndPassword,
    updateProfile,
} = require("firebase/auth")

const User = require('../models/user_model')

class AuthController {
    async googleValidate(req, res) {
        try {
            let firebaseUser = req.firebaseUser
            let user = req.userData

            if (!firebaseUser) return res.sendStatus(403)

            const { email, name, picture } = firebaseUser
            if (!user) {
                let newUser = new User({
                    name: name,
                    email: email,
                    role: 'user',
                    picture: picture
                })
                user = await newUser.save();
            }

            delete user.password

            res.status(200).json({
                message: 'Berhasil login',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async registerAdmin(req, res) {
        try {
            const { name, email, password, picture } = req.body

            if ((name && email && password) == null) return res.status(400).json({
                message: 'Semua field wajib di isi'
            })

            const credential = await createUserWithEmailAndPassword(
                getClientAuth(),
                email,
                password
            );

            await updateProfile(credential.user, {
                displayName: titleCase(full_name).trim(),
                emailVerified: false,
            });

            let result = await User.findOne({ email: email })
            if (result != null) return res.status(400).json({
                message: 'Email sudah terdaftar'
            })

            const newAdmin = new User({
                name: name,
                email: email,
                role: 'admin',
                picture: picture ?? `https://ui-avatars.com/api/?name=${name}&length=1&bold=true&font-size=0.33`
            });

            await newAdmin.save()

            const user = getClientAuth().currentUser;
            await sendEmailVerification(user);

            res.status(201).json({
                message: 'Berhasil mendaftar. Silakan verifikasi email Anda dengan mengklik link verifikasi di kotak masuk email Anda.',
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    // resetPassword(req, res) {
    //     const { newPassword, confirmPassword, email } = req.body
    //     const id = req.id

    //      User.findById(id)
    //         .then(result => {
    //             if (result != null) {
    //                 if (result.role != 'Admin') return res.sendStatus(403)
    //                 if ((newPassword && confirmPassword && email) == null) return res.status(400).json({ message: 'Semua field wajib di isi!' })

    //                 user.findOne({ email: email })
    //                     .then(async docs => {
    //                         if (docs != null) {
    //                             if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Password dan Konfirmasi Password tidak cocok!' })

    //                             const salt = await bcrypt.genSalt()
    //                             const hashPassword = await bcrypt.hash(newPassword, salt)

    //                             docs.password = hashPassword
    //                             docs.save()
    //                                 .then(doc => {
    //                                     res.status(201).json({
    //                                         message: 'Reset password berhasil',
    //                                         data: doc
    //                                     })
    //                                 })
    //                         } else {
    //                             res.status(404).json({
    //                                 message: 'Data tidak ditemukan'
    //                             })
    //                         }
    //                     })
    //                     .catch(err => {
    //                         res.status(500).json({
    //                             message: err.message
    //                         })
    //                     })
    //             } else {
    //                 res.sendStatus(403)
    //             }
    //         })
    // }
}

module.exports = new AuthController