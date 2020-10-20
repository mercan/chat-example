const redis = require('redis');

class Users {

	constructor() {
		// Heroku
		this.client = redis.createClient(process.env.REDIS_URL);

		/* // Localhost
		this.client = redis.createClient({
			host: process.env.REDIS_URI, 
			port: process.env.REDIS_PORT,
			
		});
		*/
	}

}

Users.prototype.upsert = function(room, userId, meta) {
	this.client.hset(
		room,
		userId,
		JSON.stringify({
			socketId: meta.socketId,
			meta,
			when: Date.now()
		}),
		err => {
			if (err)
				throw err;
		}
	);
};

Users.prototype.remove = function(room, userId) {
	this.client.hdel(
		room,
		userId,
		err => {
			if (err)
				throw err;
		}
	);
};

Users.prototype.list = function(room) {
	return new Promise((resolve, reject) => {
		const active = [];

		this.client.hgetall(room, (err, users) => {
			if (err) reject(err);		
			
			for (let user in users) {
				active.push(JSON.parse(users[user]));
			}
			
			resolve(active);
		});
	});
};

module.exports = new Users();