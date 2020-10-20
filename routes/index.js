const router = require('express').Router();

router.get('/', async (req, res) => {
	res.render('index');
});

router.get('/chat', async (req, res) => {
	res.render('chat');
});

router.get('/register', async (req, res) => {
	res.render('register');
});

module.exports = router;