const mongoose = require('mongoose')

const formulaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    formula: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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
    },
    variables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variable'
    }]
}, {
    timestamps: true
})

formulaSchema.pre('save', async function (next) {
    const formula = this
    if (formula === null) {
        throw new Error('Formulas are invalid')
    }

    next()
})

const Formula = mongoose.model('Formula', formulaSchema)

module.exports = Formula