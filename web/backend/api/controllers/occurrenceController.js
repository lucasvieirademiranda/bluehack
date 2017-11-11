const { Router } = require('express');
const occurrenceService = require("../services/occurrenceService");

let router = Router();

router.post('/getOccurrences', (request, response) => {
    
    let parameters = request.body;

    occurrenceService.getOccurrences(parameters, function(data, error) {

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