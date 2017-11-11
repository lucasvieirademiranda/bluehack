const database = require("../database");

exports.getOccurrenceSubtypes = (callback) => {

    database.connection((request, error) => {

        let sql = 'SELECT * FROM OCCURRENCE_SUBTYPE';

        if (error)
        {
            callback(null, error);
            return;
        }

        request.query(sql, (error, result) => {

            if(error)
                callback(null, error);

            let occurrenceSubtypes = [];

            result.recordset.forEach((current) => {

                occurrenceSubtypes.push({
                    Id: current.ID,
                    OccurrenceTypeId: current.OCCURRENCE_TYPE_ID,
                    Name: current.NAME
                });              

            });

            callback(occurrenceSubtypes, null);

        });

    });

};