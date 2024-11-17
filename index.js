const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/db.connect');
const { BusLocation } = require('./models/busLocation.model');

const app = express();

app.use(express.json());
app.use(cors());

// Initialize the database connection
initializeDatabase()

// Route to test the API
app.get('/bus', (req, res) => {
    res.send('Hello Express!');
});

// Route to handle bus location updates
app.post('/bus/location', async (req, res) => {
    const { busId, latitude, longitude, speed } = req.body;

    try {
        const newLocation = new BusLocation({ busId, latitude, longitude, speed, timestamp: new Date() });
        await newLocation.save();
        res.status(201).json({ message: 'Location added successfully', location: newLocation });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Failed to save location', details: error.message });
    }
});

// GET API - All buses
app.get('/bus/location/', async (req, res) => {
  
  try {
      const allBusLocations = await BusLocation.find();  
      if (allBusLocations.length === 0) {
          return res.status(404).json({ error: 'Bus not found' });
      }
      res.status(200).json(allBusLocations);
  } catch (err) {
      console.error(err);  
      res.status(500).json({ error: 'Failed to fetch location', details: err.message });
  }
});

// DELETE API - by ID
app.delete('/bus/location/:id', async (req, res) => {
  const locationId = req.params.id;
  
  try {
      const busLocationToDelete = await BusLocation.findByIdAndDelete(locationId);  
      if (!busLocationToDelete) {
          return res.status(404).json({ error: 'Bus location not found' });
      }
      res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
      console.error(err);  
      res.status(500).json({ error: 'Failed to delete location', details: err.message });
  }
});


// Route to fetch the location of a bus
app.get('/bus/location/:busId', async (req, res) => {
    const { busId } = req.params;
    
    try {
        const busLocation = await BusLocation.find({ busId });  
        if (busLocation.length === 0) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        
        res.status(200).json(busLocation);
    } catch (err) {
        console.error(err);  
        res.status(500).json({ error: 'Failed to fetch location', details: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
