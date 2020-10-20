const router = require('express').Router();

// Models
const User = require('../models/User');

// Token Create
const tokenCreate = require('../helpers/tokenCreate');

router.post('/register', async (req, res) => {
	const { username } = req.body;

	const user = await User.findOne({ username });

	if (user) {
		return res.status(400).json({
			code: 400,
			message: 'Username used.',
		});
	}

	const newUser = await new User({ username }).save();
	
	const token = tokenCreate(newUser._id, username);

	return res.status(200).json({
		code: 200,
		auth_token: token,
	});
});

module.exports = router;