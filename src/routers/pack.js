const express = require('express')
const Pack = require('../models/pack')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/packs', auth, async (req, res) => {
    const pack = new Pack({
        ...req.body,
        owner: req.user._id
    })
    console.log(pack)
    try {
        await pack.save()
        res.status(201).send(pack)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/packs', async (req, res) => {
    try {
        const packs = await Pack.find().populate('struct')
        res.send(packs)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/packs/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const pack = await Pack.findOne({ _id, owner: req.user._id }).populate({ path: 'struct', populate: { path: 'formulas', populate: { path: 'variables' } } })
        if (!pack) {
            return res.status(404).send()
        }
        res.send(pack)
    } catch (e) {
        res.send(500).send()
    }
})

router.patch('/packs/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['section', 'name', 'variables'] // other elements
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const pack = await Pack.findOne({ _id: req.params.id, owner: req.user._id })
        if (!pack) {
            return res.status(404).send()
        }
        updates.forEach((update) => pack[update] = req.body[update])
        await pack.save()
        res.send(pack)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/packs/:id', auth, async (req, res) => {
    try {
        const pack = await Pack.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!pack) {
            return res.status(404).send()
        }
        res.send(pack)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router