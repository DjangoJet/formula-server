const express = require('express')
const User = require('../models/user')

const auth = require('../middleware/auth')
const router = new express.Router()

// tworzy uzytkownika
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(user)

    try {
        await user.save()
        //const token = await user.generateAuthToken()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// pobiera wszystkich uzytkownikow
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})

// loguje uzytkownika
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send()
    }
})

// wylogowuje uzytkownika
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// pokazuje dane zalogowanego uzytkownika
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// update danych uzytkownika
router.patch('/users/me', auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// usuwa uzytkownika
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/owned/variables', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('variables')
        res.send(user.variables)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/owned/formulas', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('formulas')
        res.send(user.formulas)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/owned/packs', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('packs')
        res.send(user.packs)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router