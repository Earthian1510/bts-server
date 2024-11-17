const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const { initializeDatabase } = require('./db/db.connect')
const { BusLocation } = require('./models/busLocation.model')

const app = express()

app.use(express.json())
app.use(cors())

initializeDatabase()

app.get('/bus', (req, res) => {
    res.send('Location API is running!');
});

app.post('/bus/location', async (req, res) => {
    const { busId, latitude, longitude, speed } = req.body 
    try{
        const newLocation = new BusLocation({ busId, latitude, longitude, speed})
        await newLocation.save()
        
        if(newLocation){
            res.status(201).json({ message: 'Location added successfully'})
        }
        console.log(newLocation)
    }
    catch(error){
        res.status(500).json({error: 'Failed to save location'})
    }
})

app.get('/bus/location/:busId', async (req, res) => {
    const { busId } = req.params;
    try {
      const busLocation = await BusLocation.findOne({ busId });
      if (!busLocation) {
        return res.status(404).json({ error: 'Bus not found' });
      }
      res.status(200).json(busLocation);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch location' });
    }
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})