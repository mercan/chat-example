const mongoose = require('mongoose');

module.exports = () => {
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
	mongoose.set('useUnifiedTopology', true);

	mongoose.connect(process.env.DATABASE_URL);
	mongoose.connection.on('open',  () => console.log('MongoDB: Connected'));
	mongoose.connection.on('error', error => console.log('MongoDB: Error ', error));
};