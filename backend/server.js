require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const resRoutes = require('./routes/storereservation')
const fetchRoute = require('./routes/fetchandstore')
const availableCars = require('./routes/availableCars')


const app = express()

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// DB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB & Listening to port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error);
    })


// for routes
app.use('/api/fetchandstore', fetchRoute)
app.use('/api/availablecars', availableCars)
app.use('/api/storereservation', resRoutes)
