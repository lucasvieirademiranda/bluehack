const { Router } = require('express');
const occurrenceSubtypeService = require("../services/occurrenceSubtypeService");

let router = Router();

router.get('/getOccurrenceSubtypes', (request, response) => {

    occurrenceSubtypeService.getOccurrenceSubtypes(function(data, error) {

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