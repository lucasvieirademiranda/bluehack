const { Router } = require('express');
const institutionService = require("../services/institutionService");

let router = Router();

router.get('/getInstitutions', (request, response) => {

    institutionService.getInstitutions(function(data, error) {

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