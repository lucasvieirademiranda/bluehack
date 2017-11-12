const { Router } = require('express');
const occurrenceService = require("../services/occurrenceService");

let router = Router();

router.post('/getOccurrences', (request, response) => {
    
    let parameters = request.body;

    occurrenceService.getOccurrences(parameters, function(data, error) {

        if (error)
        {
            response.status(500)
                    .type("application/json")
                    .json({
                        Success: false,
                        Error: error
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

});router.post('/postOccurrences', (request, response) => {
    
    let parameters = request.body;
    response.status(200).json({});
});



module.exports = router;