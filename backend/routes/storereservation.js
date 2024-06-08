//Storing every reservation entry to the MongoDB database

const express = require('express')
const Reservation = require('../models/reservation')
const router = express.Router()

router.post('/', async (req, res) => {
    const reservationData = req.body
    console.log(reservationData)

    try{
        const reservation = await Reservation.create(reservationData)
        res.status(200).json(reservation)

    } catch(error){
        res.status(400).json({error: error.message})
    }
})

  
module.exports = router