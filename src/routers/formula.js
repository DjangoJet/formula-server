const express = require('express')
const Formula = require('../models/formula')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/formulas', auth, async (req, res) => {
    const formula = new Formula({
        ...req.body,
        owner: req.user._id
    })
    console.log(formula)
    try {
        await formula.save()
        res.status(201).send(formula)
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

router.get('/formulas', async (req, res) => {
    try {
        const formulas = await Formula.find().populate('variables')
        res.send(formulas)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/formulas/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const formula = await Formula.findOne({ _id, owner: req.user._id }).populate('variables')
        if (!formula) {
            return res.status(404).send()
        }
        res.send(formula)
    } catch (e) {
        res.send(500).send()
    }
})

router.patch('/formulas/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['section', 'name', 'variables']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const formula = await Formula.findOne({ _id: req.params.id, owner: req.user._id })
        if (!formula) {
            return res.status(404).send()
        }
        updates.forEach((update) => formula[update] = req.body[update])
        await formula.save()
        res.send(formula)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/formulas/:id', auth, async (req, res) => {
    try {
        const formula = await Formula.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!formula) {
            return res.status(404).send()
        }
        res.send(formula)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router