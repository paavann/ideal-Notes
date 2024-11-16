const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
//importing mongoose-sequence and initializing it with mongoose



const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, //stores object id of a specific user from a schema which is being referenced below
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
}, 
{
    timestamps: true
})

//plugin() method(specific to mongoose) is used to add additional tools to mongoose
noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket', //name/field
    id: 'ticket_id',
    start_seq: 500 //start sequence
})



module.exports = mongoose.model('Note', noteSchema)