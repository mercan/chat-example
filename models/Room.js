const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
	room: { type: String, required: true, unique: true, minlength: 3 },

	messages: [
		{
			userId: Schema.Types.ObjectId,
			username: String,
			message: { type: String, minlength: 3 },
			date: { type: String },
			createdAt: { type: Date, default: Date.now() },
			deleteMessage: { type: Boolean, default: false }
		}
	],

	deletedRoom: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now() },
}, { versionKey: false });

module.exports = mongoose.model('room', Room);