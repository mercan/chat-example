const dayjs = require('dayjs');
require('dayjs/locale/tr')

function formatMessage(username, message) {
  return {
    username,
    message,
    time: dayjs().locale('tr').format('MMMM D, H:m')
  };
}

module.exports = {
	formatMessage,
}