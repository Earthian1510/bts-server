
require('dotenv').config()
const mongoose = require('mongoose')

const mongoURL = process.env.MONGODB 

const initializeDatabase = async () => {
   
    try{
        const connect = await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        
        if(connect){
            console.log('MongoDB connected successfully.')
        }
    }
    catch(error){
        console.error('Database connection failed.', error)
    } 

}

module.exports = { initializeDatabase }
