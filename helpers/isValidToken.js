const jwt = require('jsonwebtoken');
const cfg = require('../config/token');

module.exports = token => {
	if (!token) {
		return false;
	}

	try {
		const [decode, _]  = [jwt.verify(token, cfg.SECRET_KEY)];
		return decode;
	} catch (error) {
		return false;
	}
};