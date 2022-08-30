const mongoose = require('mongoose')

module.exports = async function (connectionString) {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const db = mongoose.connection
    db.on('error', (err) => console.log(err))
    db.once('open', () => console.log('Database Connected'))

    mongoose.Promise = global.Promise
}