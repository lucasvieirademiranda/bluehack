const { Router } = require('express');
const userService = require("../services/userService");

let router = Router();

router.get('/getUsers', (request, response) => {

    userService.getUsers(function(data, error) {

        if (error)
        {
            response.status(500)
                    .json(error);

            return;
        }
        
        response.status(400)
                .json(data);

    });

});

module.exports = router;