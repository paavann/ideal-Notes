const mongoose = require('mongoose')



const userSchema = new mongoose.Schema({ //Schema() is a class of mongoose
    username: { //data/field(type and complusory)
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{  //array because multiple roles. if one, same as before.
        type: String, //each element
        default: 'Employee' //default
    }],
    active: {
        type: Boolean,
        default: true
    }
})



module.exports = mongoose.model('User', userSchema) //model using the schema and then exported