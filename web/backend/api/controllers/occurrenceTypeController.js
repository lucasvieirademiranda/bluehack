const { Router } = require('express');
const occurrenceTypeService = require("../services/occurrenceTypeService");

let router = Router();

router.get('/getOccurrenceTypes', (request, response) => {

    occurrenceTypeService.getOccurrenceTypes(function(data, error) {

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