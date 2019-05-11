const mongoose = require('mongoose')

// const collectionSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     parent: {
//         type: String
//     },
//     formulas: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Formula'
//     }]
// })

const packSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    struct: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }]
}, {
        timestamps: true
    })

packSchema.pre('save', async function (next) {
    const pack = this
    if (pack === null) {
        throw new Error('Pack are invalid')
    }

    next()
})

const Pack = mongoose.model('Pack', packSchema)

module.exports = Pack