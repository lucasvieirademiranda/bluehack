const { Router } = require('express');
const occurrenceTypeService = require("../services/occurrenceTypeService");

let router = Router();

router.get('/getOccurrenceTypes', (request, response) => {

    occurrenceTypeService.getOccurrenceTypes(function(data, error) {

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