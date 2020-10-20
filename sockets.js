const socketio = require('socket.io');
const io = socketio();
const socketApi = { io };

const socketConnectVerify = require('./middleware/socketConnectVerify');

const { getClients } = require('./utils/socket');
const { formatMessage } = require('./utils/message');

// Models
const User = require('./models/User');

// Libs
const Users = require('./src/lib/Users');

const botName = 'Chat Bot';

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter(process.env.REDIS_URL, {
	password: process.env.REDIS_PASS,
	no_ready_check: true,
}));


io.use(socketConnectVerify);

io.on('connection', socket => { 
	
	socket.on('joinRoom', async ({ room }) => {
		socket.join(room);
		socket.joinedRoom = room;

		Users.upsert(room, socket.decode.userId, { socketId: socket.id, username: socket.decode.username });
		
		const returnUsername = [];
		const users = await Users.list(room);
		users.forEach(i => returnUsername.push(i.meta.username));
		
		socket.emit('message', formatMessage(botName, `Welcome to ${socket.decode.username}`));

		socket.broadcast.to(room)
    .emit(
     	'message',
     	formatMessage(botName, `${socket.decode.username} has joined the chat`)
    );

    io.to(room).emit('roomUsers', {
    	room,
    	users: returnUsername,
    });

  	io.to(room).emit('onlineCount', {
  		onlineCount: [returnUsername.length]
  	});
	});

	socket.on('chatMessage', message => {
    io.to(socket.joinedRoom).emit(
    	'message',
    	formatMessage(socket.decode.username, message)
    );
	});

	socket.on('disconnecting', async () => {
		const room = socket.joinedRoom;

	  if (room) {
	  	Users.remove(room, socket.decode.userId);

	  	const returnUsername = [];
			const users = await Users.list(room);
			users.forEach(i => returnUsername.push(i.meta.username));

	    io.to(room).emit(
	   	 'message',
	    	formatMessage(botName, `${socket.decode.username} has left the chat`)
	    );

	    io.to(room).emit('onlineCount', { onlineCount: [returnUsername.length] });

	    // Send users and room info
	    io.to(room).emit('roomUsers', {
	    	room,
	    	users: returnUsername
	    });
    }
	});

});

module.exports = socketApi;