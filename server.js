require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');

// Database connection
mongoose.connect(process.env.MENUS_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const connection = mongoose.connection;
connection
  .once('open', () => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('Database connection failed');
  });

// Session store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: 'sessions',
});

// Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Session configuration
app.use(
  session({
    secret: process.env.COOKIE,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hour
  })
);

//Passport configuration
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// routes
require('./routes/web')(app);
app.use((req, res) => {
  res.status(404).render('errors/404.ejs');
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});

// Socket.io

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  // Join
  socket.on('join', (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data);
});
