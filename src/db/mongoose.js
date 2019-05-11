const mongoose = require('mongoose')

// łaczy z konkretna baza danych
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/FormulaApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})