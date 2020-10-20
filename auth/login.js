const router = require('express').Router();

// Models
const { User } = require('../../models/User');

// Token Create
const tokenCreate = require('../../helpers/tokenCreate');

router.post('/login', limiter, async (req, res) => {
	const user = await User.findOne({ username });

	if (!user) {
		return res.status(400).json({
			code: 400,
			message: 'Username not found.',
		});
	}

	const token = tokenCreate(username);

	return res.status(200).json({
		code: 200,
		auth_token: token,
	});
});

module.exports = router;