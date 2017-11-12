const database = require("../database");

exports.getInstitutions = (callback) => {

    database.connection((request, error) => {

        let sql = 'SELECT * FROM INSTITUTION';

        if (error)
        {
            callback(null, error);
            return;
        }

        request.query(sql, (error, result) => {

            if(error)
                callback(null, error);

            let institutions = [];

            result.recordset.forEach((current) => {

                institutions.push({
                    Id: current.ID,
                    Name: current.NAME,
                    Phone: current.PHONE,
                    Email: current.EMAIL,                    
                });              

            });

            callback(institutions, null);

        });

    });

};