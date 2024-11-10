const express = require('express')
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandling')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const app = express()
const PORT = process.env.PORT || 3500


//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use(logger)
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))

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

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
