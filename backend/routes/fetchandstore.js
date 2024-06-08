// It is for fetching the data from the provided API and then store them to MongoDB database.
// It is supposed to be used only once as data that API provides is static

const express = require('express')
const Vehicle = require('../models/vehicle')
const router = express.Router()
const axios = require('axios')


router.get('/', async (req, res) => {
    try {
      // Fetch data from the API
      const response = await axios.get('https://exam-server-7c41747804bf.herokuapp.com/carsList')
      const behicleData = response.data.data
      
      // Store the fetched data into MongoDB
      const behicles = await Vehicle.insertMany(behicleData)
      res.status(201).json({ status: 'success', data: behicles, message: 'Cars stored successfully.' })
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch or store cars.', error: err.message })
    }
  });

  module.exports = router