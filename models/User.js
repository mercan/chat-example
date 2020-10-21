const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	username: { type: String, unique: true, maxlength: 40, minlength: 3 },

	createdAt: { type: Date, default: Date.now() }
}, { versionKey: false });

module.exports = mongoose.model('user', User);