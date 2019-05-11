const mongoose = require('mongoose')

const variableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    symbol: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    section: {
        type: String,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
})

const Variable = mongoose.model('Variable', variableSchema)

module.exports = Variable