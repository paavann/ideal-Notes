const { format } = require('date-fns') //import format function from date-fns library
const { v4: uuid } = require('uuid') //imports v4 property of uuid(universally unique identifier) lib. re-n to uuid
const fs = require('fs')
const fsPromises = require('fs').promises //imports promises property from fs lib. allows to use promises instead cb
const path = require('path')



const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
    
        await fs.promises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (error) {
        console.error("error: ", error)
    }
}

const logger = async (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}



module.exports = { logEvents, logger }
