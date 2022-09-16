const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

require('dotenv').config();

const db = require('./config/db')
const route = require('./routes/route')

const app = express()
const port = process.env.PORT

db(`mongodb+srv://meyza:${process.env.MONGO_DB_PASSWORD}@cluster0.ryj8i.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`)

app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(route)
app.use(bodyParser.json())
app.use(cors({ origin: true }))

app.listen(port, () => console.log(`App listening on PORT ${port}`))
