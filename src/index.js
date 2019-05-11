const express = require('express')
require('./db/mongoose') // dolacza plik laczacy z baza danych
const cors = require('cors')

// routery
const userRouter = require('./routers/user')
const variableRouter = require('./routers/variable')
const formulaRouter = require('./routers/formula')
const packRouter = require('./routers/pack')
const collectionRouter = require('./routers/collection')

const app = express()
const port = process.env.PORT || 3000 // konkretny port na ktorym dostepne sa endpointy

app.use(cors())
app.use(express.json())

app.use(userRouter)
app.use(variableRouter)
app.use(formulaRouter)
app.use(packRouter)
app.use(collectionRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})