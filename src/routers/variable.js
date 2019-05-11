const express = require('express')
const Variable = require('../models/variable')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/variables', auth, async (req, res) => {
    const variable = new Variable({
        ...req.body,
        owner: req.user._id
    })
    console.log(variable)
    try {
        await variable.save()
        res.status(201).send(variable)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/variables', async (req, res) => {
    try {
        const variables = await Variable.find()
        res.send(variables)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/variables/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const variable = await Variable.findOne({ _id, owner: req.user._id })
        if (!variable) {
            return res.status(404).send()
        }
        res.send(variable)
    } catch (e) {
        res.send(500).send()
    }
})

router.patch('/variables/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['section', 'name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const variable = await Variable.findOne({ _id: req.params.id, owner: req.user._id })
        if (!variable) {
            return res.status(404).send()
        }
        updates.forEach((update) => variable[update] = req.body[update])
        await variable.save()
        res.send(variable)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/variables/:id', auth, async (req, res) => {
    try {
        const variable = await Variable.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!variable) {
            return res.status(404).send()
        }
        res.send(variable)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router