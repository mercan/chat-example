const jwt = require('jsonwebtoken');
const cfg = require('../config/token');

module.exports = name => {
	return jwt.sign(
		{
			name,
		},
		config.SECRET_KEY,
		{
			expiresIn: '30d' // 30 gün.
		} 
	);
};