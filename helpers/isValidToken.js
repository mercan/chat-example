const jwt = require('jsonwebtoken');
const cfg = require('../config/token');

module.exports = token => {
	if (!token) {
		return false;
	}

	try {
		var [decode, err]  = [jwt.verify(token, cfg.SECRET_KEY)];
		return err ? false : decode;
	} catch (error) {
		return false;
	}
};