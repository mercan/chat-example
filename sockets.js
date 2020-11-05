const socketio = require('socket.io');
const io = socketio();

const dayjs = require('dayjs');
require('dayjs/locale/tr');

const socketApi = { io };

const socketConnectVerify = require('./middleware/socketConnectVerify');

const { formatMessage } = require('./utils/message');

// Models
const Room = require('./models/Room');

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
		const roomControl = await Room.findOne({ room }, '_id');

		if (!roomControl) {
			return socket.emit('roomErrorRedirect');
		}
	
		socket.join(room);
		socket.joinedRoom = room;

		const { userId, username } = socket.decode;
		const users = [];

		Users.upsert(room, userId, { socketId: socket.id, username });
		
		(await Users.list(room)).forEach(i => users.push(i.meta.username));
	
		// Kendisine gönderiyor.
		socket.emit('message', formatMessage(botName, `Welcome to ${username}`));

		// Kendisi hariç odada ki kişilere gönderiyor.
		socket.broadcast.to(room)
    .emit('message', formatMessage(botName, `${username} has joined the chat`));

    // Herkese gönderiyor.
    io.to(room).emit('roomUsers', { room, users });

    // Herkese gönderiyor.
  	io.to(room).emit('onlineCount', { onlineCount: [users.length] }); // value kısmında noktaya izin vermiyor.

  	// Daha önce atılmış mesajlar için.
  	const roomMessages = await Room.findOne({ room }, {
			messages: 1,
		});

		// Kendisine gönderiyor.
		for (let { username, message, date } of roomMessages.messages) {
			socket.emit('message', formatMessage(username, message, date));
		}
	});

	socket.on('typing', () => {
		if (!socket.joinedRoom) return;
		
		socket.broadcast.to(socket.joinedRoom).emit('typingUser', {
			username: socket.decode.username
		});
	});

	socket.on('chatMessage', async message => {
		if (!socket.joinedRoom) return;
	
		const { room, messages } = await Room.findOne({ room: socket.joinedRoom }, {
			messages: { $slice: 1 },
			room: 1,
		});

		const date = dayjs().locale('tr').format('MMMM D, HH:mm');
		const { userId, username } = socket.decode;

		if (room) {
			await Room.updateOne({ room }, {
				$push: {
					messages: { userId, username, message, date }
				}
			});
		}

		// Herkese gönderiyor.
    io.to(room).emit('message', formatMessage(username, message));
	});

	socket.on('disconnect', async () => {
		const room = socket.joinedRoom;

	  if (room) {	  
	  	const { userId, username } = socket.decode;
			const users = [];

	  	Users.remove(room, userId);
	  	
			(await Users.list(room)).forEach(i => users.push(i.meta.username));

			// Herkese gönderiyor. (Kendisi ayrıldığı için göremiyor broadcast de yapılabilir.)
	    socket.broadcast.to(room).emit(
	    	'message',
	    	formatMessage(botName, `${username} has left the chat`)
	    );

	    // Kendisi hariç diğer kişilere gönderiyor.
	    socket.broadcast.to(room).emit('onlineCount', { onlineCount: [users.length] });

	    // Kendisi hariç diğer kişilere gönderiyor.
	    socket.broadcast.to(room).emit('roomUsers', { room, users });
    }
	});

});

module.exports = socketApi;