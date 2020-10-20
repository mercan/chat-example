require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors')
require('./helpers/Database')();

app.use(cors());

app.set('view engine', 'ejs')
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Sockets
const socketServer = require('./sockets');
const io = socketServer.io;
io.attach(server);

// Routes
const indexRoute = require('./routes/index');
const register = require('./auth/register');

app.use('/', indexRoute);
app.use('/', register);

server.listen(process.env.PORT || 3000, () => console.log("Sunucu Başlatıldı!"));