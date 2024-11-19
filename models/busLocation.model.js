
const mongoose = require('mongoose')

const busLocationSchema = new mongoose.Schema({
    busId: String,
    latitude: Number,
    longitude: Number,
    speed: Number,
    date: String,
    time: String,
}
);

const BusLocation = mongoose.model('BusLocation', busLocationSchema)

module.exports = { BusLocation }