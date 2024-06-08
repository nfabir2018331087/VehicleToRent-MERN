// Fetching vehicle's information from MongoDB to show in the Home page

const express = require('express')
const Vehicle = require('../models/vehicle')
const router = express.Router()
const axios = require('axios')

router.get('/', async (req, res) => {
    try {
      const cars = await Vehicle.find()
      const carTNames = [], carTypes = new Set()
      
      cars.forEach((el) => {
        carTypes.add(el.type)
    })
      console.log(carTypes)
      carTypes.forEach((el) => {
        carTNames.push(el)
      })
      console.log(carTNames)
      res.status(200).json({data: cars, types: carTNames})
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch cars.' })
    }
  });


  module.exports = router