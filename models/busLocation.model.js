
const mongoose = require('mongoose')

const busLocationSchema = new mongoose.Schema({
    busId: String,
    latitude: Number,
    longitude: Number,
    speed: Number,
    timestamp: {
        type: Date, default: Date.now
    }
});

const BusLocation = mongoose.model('BusLocation', busLocationSchema)

module.exports = { BusLocation }