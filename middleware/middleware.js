const jwt = require('jsonwebtoken');
const firebase = require('../services/firebase');

class Middleware {
    async verifyFirebaseToken(req, res, next) {
        try {
            const firebaseToken = req.body

            let firebaseUser
            if (firebaseToken) {
                firebaseUser = await firebase.auth.verifyIdToken(firebaseToken)
            }

            if (!firebaseUser) return res.sendStatus(401)

            req.firebaseUser = firebaseUser
            next()
        } catch (err) {
            res.status(401).json({ message: err.message })
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
