const router = require('express').Router();

// Models
const User = require('../models/User');

// User Redis
const UserRedis = require('../src/lib/Users');

router.get('/users', async (req, res) => {
	const activeUsers = [];
	const rooms = await UserRedis.keys();
	
	await rooms.forEach(async room => {
		const username = (await UserRedis.list(room)).map(({ meta }) => meta.username);
		activeUsers.push(...username);
	});

	const users = (await User.find({}, 'username')).reduce((acc, { username }) => {
		activeUsers.includes(username) ?
			acc.push({ username, active: true }) :
			acc.push({ username, active: false });

		return acc;
	}, []);
	
	res.render('users', { users });
});

module.exports = router;