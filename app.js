require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.set('view engine', 'ejs')
app.use(express.static('public'))

// Sockets
const socket = require('./sockets');
socket['/chat'](server);

// Routes
const indexRoute = require('./routes/index');

app.use('/', indexRoute);


server.listen(process.env.PORT || 3000, () => console.log("Sunucu Başlatıldı!"));