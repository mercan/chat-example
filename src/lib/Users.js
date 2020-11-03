const redis = require('redis');

function Users() {
	// Heroku
	this.client = redis.createClient(process.env.REDIS_URL, {
		password: process.env.REDIS_PASS,
		no_ready_check: true,
	});

	this.client.on('connect', () => {
   	console.log('Redis Connected');
	});

	this.client.on('error', console.error);  
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

Users.prototype.keys = function() {
	return new Promise((resolve, reject) => {

		this.client.keys('*', (err, keys) => {
			if (err) reject(err);		
			
			resolve(keys);
		});
	});
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