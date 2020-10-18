const router = require('express').Router();

router.get('/', async (req, res) => {
	res.render('index');
});

router.get('/chat', async (req, res) => {
	res.render('chat');
});

module.exports = router;