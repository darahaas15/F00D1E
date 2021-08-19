const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
//Database connection
const url = 'mongodb://localhost/F00D1E';
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once('open', () => {
    console.log('Database connected...');
  })
  .catch((err) => {
    console.log('Connection failed...');
  });
// assets
app.use(express.static('public'));

// set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// routes
require('./routes/web')(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
