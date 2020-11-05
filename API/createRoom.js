const router = require('express').Router();

const tokenVerify = require('../middleware/tokenVerify');

// Model
const Room = require('../models/Room');

router.get('/create_room', tokenVerify, async (req, res) => {
	const { name } = req.query;

	if (name && name.length >= 3) {
		const room = await Room.findOne({ room: name }, '_id')

		if (!room) {
			await new Room({ room: name }).save();

			return res.status(201).json({
				code: 201,
				message: 'Created room',
				redirect: `https://chatsocket-example.herokuapp.com/chat?room=${name}`,
			});
		}
		
		return res.status(400).json({
			code: 400,
			message: `${name} kullanılıyor.`,
		});
	}

	return res.status(400).json({
		code: 400,
		message: 'Room name minimum length 3',
	});
});

module.exports = router;