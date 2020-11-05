const router = require('express').Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/chat', (req, res) => {
	res.render('chat');
});

router.get('/register', (req, res) => {
	res.render('register');
});

router.get('/create_room', (req, res) => {
	res.render('createRoom');
})

module.exports = router;