function getClients(io, ns, roomName, returnUser) {
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
	getClients,
	getUserJoinedRoom,
	getRealRooms,
};