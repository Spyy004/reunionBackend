const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./api/routes/users');
const postsRouter = require('./api/routes/posts');


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }


// Configure middleware

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Import routes


// Use routes

mongoose.connect(process.env.mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


module.exports = app;