const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const db = require('./models')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

const photosRouter = require('./routes/photos')
app.use("/photos", photosRouter)

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running...")
    })
})