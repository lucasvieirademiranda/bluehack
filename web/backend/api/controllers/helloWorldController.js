const { Router } = require('express');

var router = Router();

router.get('/hello', (request, response) => {
	response.status(200).send('Olá Rotta');
});

module.exports = router;