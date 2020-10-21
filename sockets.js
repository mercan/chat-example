const socketio = require('socket.io');
const io = socketio();

const dayjs = require('dayjs');
require('dayjs/locale/tr')

const socketApi = { io };

const socketConnectVerify = require('./middleware/socketConnectVerify');

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

  	// Daha önce atılmış mesajları için.
  	const roomMessages = await User.find({ 'messages.room': room }, { 
  		'messages.$': true,
			username: true,
			_id: false,
		});

		if (roomMessages) {
			for (let key in roomMessages) {
				for (let { text, date } of roomMessages[key].messages[0].message) {
					io.to(room).emit(
			    	'message',
			    	formatMessage(roomMessages[key].username, text, date)
			    );
				}
			}
		}

	});

	socket.on('chatMessage', async message => {
		if (!socket.joinedRoom) return;
	
		const room = await User.findOne({
			_id: socket.decode.userId,
			'messages.room': socket.joinedRoom,
		},
		{ 
			'messages.$': true 
		});

		let update;

		if (room && room.messages) {
			update = await User.updateOne({
				_id: socket.decode.userId,
				'messages.room': socket.joinedRoom
			},
			{
				$push: {
					'messages.$.message': {
						text: message,
						date: dayjs().locale('tr').format('MMMM D, HH:mm'),
					}
				}
			});
		} else {
			update = await User.updateOne({ _id: socket.decode.userId }, {
				$push: {
					messages: {
						room: socket.joinedRoom,
						message: {
							text: message,
							date: dayjs().locale('tr').format('MMMM D, HH:mm'),
						}
					}
				}
			});
		}

    io.to(socket.joinedRoom).emit(
    	'message',
    	formatMessage(socket.decode.username, message)
    );
	});

	socket.on('disconnect', async () => {
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