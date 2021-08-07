const dayjs = require('dayjs');

function formatMessage(username, message, time) {
  return {
    username,
    message: message.replace(/‎‏‏‎ /g, `Atma bunu güzel kardesim @${username}`),
    time: dayjs().format('MMMM D, HH:mm'),
  };
}

module.exports = {
	formatMessage,
}
