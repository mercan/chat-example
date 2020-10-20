const jwt = require('jsonwebtoken');
const cfg = require('../config/token');

module.exports = (userId, username) => {
	return jwt.sign(
		{
			userId, username,
		},
		cfg.SECRET_KEY,
		{
			expiresIn: '30d' // 30 gün.
		} 
	);
};