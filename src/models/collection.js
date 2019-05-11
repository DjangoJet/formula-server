const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    formulas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formula'
    }]
}, {
        timestamps: true
    })

collectionSchema.pre('save', async function (next) {
    const collection = this
    if (collection === null) {
        throw new Error('Collection are invalid')
    }

    next()
})

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection