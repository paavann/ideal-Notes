const allowedOrigins = require('./allowedOrigins')



const originOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("origin not allowed"))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}



module.exports = originOptions
