const express = require('express')
const Collection = require('../models/collection')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/collections', auth, async (req, res) => {
    const collection = new Collection({
        ...req.body,
        owner: req.user._id
    })
    console.log(collection)
    try {
        await collection.save()
        res.status(201).send(collection)
    } catch (e) {
        res.status(400).send(e)
    }
})

// SORT:
// createdAt
// type
// -------
// used variables
// used name
// -------
// pagination (limit, ship)

router.get('/collections', async (req, res) => {
    try {
        const collections = await Collection.find().populate({path: 'formulas', populate: {path: 'variables'}})
        res.send(collections)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/collections/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const collection = await Collection.findOne({ _id, owner: req.user._id }).populate({ path: 'formulas', populate: { path: 'variables' } })
        if (!collection) {
            return res.status(404).send()
        }
        res.send(collection)
    } catch (e) {
        res.send(500).send()
    }
})

router.patch('/collections/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['section', 'name', 'variables']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const collection = await Collection.findOne({ _id: req.params.id, owner: req.user._id })
        if (!collection) {
            return res.status(404).send()
        }
        updates.forEach((update) => collection[update] = req.body[update])
        await collection.save()
        res.send(collection)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/collections/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!collection) {
            return res.status(404).send()
        }
        res.send(collection)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router