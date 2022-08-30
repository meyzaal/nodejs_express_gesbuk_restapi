const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

require('dotenv').config();

const db = require('./config/db')

const app = express()
const port = 5000

db(`mongodb+srv://meyza:${process.env.MONGO_DB_PASSWORD}@cluster0.ryj8i.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ origin: true }))
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => res.send('Hello world'))

app.listen(port, () => console.log(`App listening on PORT ${port}`))
