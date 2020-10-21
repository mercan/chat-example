const dayjs = require('dayjs');
require('dayjs/locale/tr')

function formatMessage(username, message, time) {
  return {
    username,
    message,
    time: time || dayjs().locale('tr').format('MMMM D, HH:mm'),
  };
}

module.exports = {
	formatMessage,
}