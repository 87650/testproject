const mongoose = require('mongoose');
const config = require('config');

const dbString = config.get('db');

const connect = async () => {
  try {
    await mongoose.connect(dbString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Database connected');
  }
  catch (error) {
    console.error('Database connection error:', error);
    }
    };
    
    module.exports = { connect };
    
    