const jwt = require('jsonwebtoken');
const cfg = require('../config/token');

module.exports = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];

	if (!bearerHeader) {
		return res.status(403).json({
			code: 403,
			message: 'No token provided!',
		});
	}

	const bearer = bearerHeader.split(' '),
 	bearerToken = bearer[1];
  req.token = bearerToken;

  const [decode, err]  = [jwt.verify(bearerToken, cfg.SECRET_KEY)];

	if (err) {
		return res.status(401).json({ 
			code: 401,
			message: 'Unauthorized!',
		});
	}
		
	req.decode = decode;
	next();
};