const isValidToken = require('../helpers/isValidToken');

module.exports = (socket, next) => {
  const tokenVerify = isValidToken(socket.handshake.query.token);
  
  if (tokenVerify) {
  	socket.decode = tokenVerify;
    return next();
  }

  return next(new Error('Authentication error'));
};