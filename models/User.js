const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	username: { type: String, unique: true, maxlength: 40, minlength: 3 },

	messages: [
		{
			room: { type: String, required: true, unique: true },
			message: [
				{
					text: { type: String },
					date: { type: String },
					createdAt: { type: Date, default: Date.now() },
					deleteMessage: { type: Boolean, default: false }
				}
			]
		}
	],

	createdAt: { type: Date, default: Date.now() }
}, { versionKey: false });

module.exports = mongoose.model('user', User);