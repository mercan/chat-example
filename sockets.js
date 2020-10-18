const socketConnectVerify = require('./middleware/socketConnectVerify');
const sockets = {};

const { getRealRooms, getUserJoinedRoom, getRoomOnlineCount } = require('./utils/socket');
const { formatMessage } = require('./utils/message');
const { userJoin, userLeave, getRoomUsers } = require('./utils/user');


const botName = 'Chat Bot';

sockets['/chat'] = server => {
	const io = require('socket.io')(server);
	//io.use(socketConnectVerify);

	io.on('connection', socket => { 
		
		socket.on('joinRoom', item => {
			socket.username = item.username;
			userJoin(socket.id, item);
			socket.join(item.room);

			// Kendisine Gönderiyor sadece.
			socket.emit('message', formatMessage(botName, `Welcome to ${item.username}`));

			// Kendisi hariç diğer kişilere gönderiyor.
			socket.broadcast.to(item.room)
      .emit(
       'message',
        formatMessage(botName, `${item.username} has joined the chat`)
      );

      io.to(item.room).emit('roomUsers', {
     		room: item.room,
     		users: getRoomUsers(item.room)
    	});

    	io.to(item.room).emit('onlineCount', {
     		onlineCount: getRoomOnlineCount(io, "/", item.room),
    	});
		});

		socket.on('chatMessage', message => {
    	io.to(getUserJoinedRoom(io, socket.id)).emit('message', formatMessage(socket.username, message));
		});

		socket.on('disconnecting', () => {
	  	const user = userLeave(socket.id);

	  	if (user) {
	      io.to(user.room).emit(
	        'message',
	        formatMessage(botName, `${user.username} has left the chat`)
	      );

	      io.to(user.room).emit('onlineCount', {
     			onlineCount: getRoomOnlineCount(io, "/", user.room) - 1,
    		});

	      // Send users and room info
	      io.to(user.room).emit('roomUsers', {
	        room: user.room,
	        users: getRoomUsers(user.room)
	      });
    	}
	  });

	});
}

module.exports = sockets;