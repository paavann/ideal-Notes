const express = require('express')
require('dotenv').config()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandling')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const originOptions = require('./config/originOptions')
const mongoose = require('mongoose')
const { connectDB } = require('./config/dbConn')


const app = express()
const PORT = process.env.PORT || 3500



connectDB()

//middleware
app.use(cors(originOptions))
app.use(express.json())
app.use(cookieParser())

app.use(logger)
//route for serving static files using express.static(). this serves css
app.use('/', express.static(path.join(__dirname, 'public')))
//route for root/homepage
app.use('/', require('./routes/root'))
//user route
app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.status(404).json({ message : "requested page does not exist" })
    } else {
        res.type('txt').send("page not found")
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log("connected to mongodb")
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
}) //executes only 'once' for an event

mongoose.connection.on('error', (error) => {
    logEvents(`${error.no} : ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongodbErrLog.log')
}) //'on' method listens to a specific event