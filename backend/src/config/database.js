const mongoose = require('mongoose');

// Connect to MongoDB database
mongoose.connect(process.env.mongodb_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
