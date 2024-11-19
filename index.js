const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/db.connect');
const { BusLocation } = require('./models/busLocation.model');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize database
initializeDatabase();

// Test route
app.get('/', (req, res) => {
    res.send('Hello Express!');
});

// POST: Add a new bus location
app.post('/bus/location', async (req, res) => {
    const { busId, latitude, longitude, speed, time, date } = req.body;

    // Validate request body
    if (!busId || !latitude || !longitude || !speed ) {
        return res.status(400).json({ error: 'All fields (busId, latitude, longitude, speed, time, date) are required' });
    }

    try {
        const newLocation = new BusLocation({ busId, latitude, longitude, speed, time, date });
        await newLocation.save();
        res.status(201).json({ message: 'Location added successfully', location: newLocation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save location', details: error.message });
    }
});

// GET: Fetch all bus locations
app.get('/bus/location', async (req, res) => {
    try {
        const allBusLocations = await BusLocation.find();
        if (allBusLocations.length === 0) {
            return res.status(404).json({ error: 'No bus locations found' });
        }
        res.status(200).json(allBusLocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch locations', details: error.message });
    }
});

// GET: Fetch specific bus location by busId
app.get('/bus/location/:busId', async (req, res) => {
    const { busId } = req.params;

    try {
        const busLocations = await BusLocation.find({ busId });
        if (busLocations.length === 0) {
            return res.status(404).json({ error: `No data found for busId: ${busId}` });
        }
        res.status(200).json(busLocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bus location', details: error.message });
    }
});

// DELETE: Delete a bus location by ID
app.delete('/bus/location/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLocation = await BusLocation.findByIdAndDelete(id);
        if (!deletedLocation) {
            return res.status(404).json({ error: 'Bus location not found' });
        }
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete location', details: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
