require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
require('./helpers/Database')();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Sockets
const socketServer = require('./sockets');
socketServer.io.attach(server);

app.use(cors({
  origin: 'http://chatsocket-example.herokuapp.com'
}));

// Routes
const indexRoute = require('./routes/index');
const register = require('./auth/register');
const users = require('./routes/users');

app.use('/', indexRoute);
app.use('/', register);
app.use('/', users);

// API
const apiCreateRoom = require('./API/createRoom');

app.use('/api', apiCreateRoom);

server.listen(process.env.PORT || 3000, () => console.log("Sunucu Başlatıldı!"));