const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
// variable name app

const PORT = process.env.PORT || 3000;

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
