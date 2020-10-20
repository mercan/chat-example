const CryptoJS = require('crypto-js');


function createRandomRoom() {
	const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	let str = '';

	for (let i = 0; i < 20; i++) {
		const random = arr[Math.floor(Math.random() * arr.length)];
		i === 0 ? str = String(random) : str += String(random);
	}

	return str;
}

function getClients(io, ns, roomName, returnUser, socketUsername) {
	const client = io.nsps[ns].adapter.rooms[roomName];
	
	if (client) {
		if (!returnUser) {
			return client.length;
		}

		
		return {
			onlineCount: client.length,
			users: Object.keys(client.sockets),
		}
	}

	return 0;
}

function getUserJoinedRoom(io, id) {
	return Object.keys(io.sockets.adapter.sids[id])[1];
}

function getRealRooms(io) {
	return Object.keys(io.sockets.adapter.rooms)
		.reduce((filtered, key) => {
			!io.sockets.adapter.rooms[key].sockets.hasOwnProperty(key) ?
				filtered.push(key) : false;
					
			return filtered;
	}, []);
}


module.exports = {
	createRandomRoom,
	getClients,
	getUserJoinedRoom,
	getRealRooms,
};