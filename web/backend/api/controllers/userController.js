const { Router } = require('express');
const userService = require("../services/userService");

let router = Router();

router.get('/getUsers', (request, response) => {

    userService.getUsers(function(data, error) {

        if (error)
        {
            response.status(500)
                    .type("application/json")
                    .json({
                        Success: false,
                        Message: error
                    });

            return;
        }
        
        response.status(200)
                .type("application/json")
                .json({
                    Success: true,
                    Data: data
                });

    });

});

module.exports = router;