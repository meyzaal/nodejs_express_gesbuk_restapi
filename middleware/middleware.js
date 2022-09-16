const jwt = require('jsonwebtoken');
const firebase = require('../services/firebase');
const user = require('../models/user_model')

class Middleware {
    async verifyFirebaseToken(req, res, next) {
        try {
            const authHeader = req.headers['authorization']
            const firebaseToken = authHeader && authHeader.split(' ')[1]

            let firebaseUser
            if (firebaseToken) {
                firebaseUser = await firebase.auth.verifyIdToken(firebaseToken)
            }

            if (!firebaseUser) return res.sendStatus(401)

            req.firebaseUser = firebaseUser
            req.userData = await user.findOne({
                email: firebaseUser.email
            })
            next()
        } catch (err) {
            res.status(401).json({ message: err.message })
        }
    }

    async verifyAdmin(req, res, next) {
        try {
            let user = req.userData
            if (!user) return res.sendStatus(403)
            if (user.role != 'admin') res.sendStatus(403)

            req.userData = user
            next()
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async verifyUser(req, res, next) {
        try {
            let user = req.userData
            if (!user) return res.sendStatus(403)
            if (user.role != 'user') res.sendStatus(403)

            req.userData = user
            next()
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    verifyAccessToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: err.message });
            req.id = decoded.id;

            next();
        })
    }
}

module.exports = new Middleware
