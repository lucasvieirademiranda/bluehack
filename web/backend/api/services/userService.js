const database = require("../database");

exports.getUsers = (callback) => {

    database.connection((request, error) => {

        let sql = 'SELECT * FROM [USER]';

        if (error)
        {
            callback(null, error);
            return;
        }

        request.query(sql, (error, result) => {

            if(error)
            {
                callback(null, error);
                return;   
            }

            let users = [];

            result.recordset.forEach((current) => {

                users.push({
                    Id: current.ID,
                    UserName: current.USERNAME,
                    Email: current.EMAIL,
                    Name: current.NAME,
                    Institution: current.INSTITUTION_ID
                });              

            });

            callback(users, null);

        });

    });

};