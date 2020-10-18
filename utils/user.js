const users = [];

function userJoin(id, { username, room }) {
  users.push({ id, username, room });
  return { id, username, room };
}

function userLeave(id) {
  const deleteIndex = users.findIndex(user => user.id === id);
  return deleteIndex > -1 ? users.splice(deleteIndex, 1)[0] : false;
}

function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
	userJoin,
	userLeave,
	getRoomUsers,
};