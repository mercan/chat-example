const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
	room: { type: String, required: true, inique: true },

	username: { type: String, required: true },

	message: [
		{
			type: String,
			required: true,
			minlength: 8,
		}
	],

	time: { type: Date, required: true },

	createdAt: { type: Date, default: Date.now() }
}, { versionKey: false });

module.exports = mongoose.model('message', Message);