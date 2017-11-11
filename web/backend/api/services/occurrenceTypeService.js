const database = require("../database");

exports.getOccurrenceTypes = (callback) => {

    database.connection((request, error) => {

        let sql = 'SELECT * FROM OCCURRENCE_TYPE';

        if (error)
        {
            callback(null, error);
            return;
        }

        request.query(sql, (error, result) => {

            if(error)
                callback(null, error);

            let occurrenceTypes = [];

            result.recordset.forEach((current) => {

                occurrenceTypes.push({
                    Id: current.ID,
                    Name: current.NAME
                });              

            });

            callback(data, null);

        });

    });

};