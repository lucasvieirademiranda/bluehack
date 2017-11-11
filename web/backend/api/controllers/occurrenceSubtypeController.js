const { Router } = require('express');
const occurrenceSubtypeService = require("../services/occurrenceSubtypeService");

let router = Router();

router.get('/getOccurrenceSubtypes', (request, response) => {

    occurrenceSubtypeService.getOccurrenceSubtypes(function(data, error) {

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