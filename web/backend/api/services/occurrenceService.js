const database = require("../database");

let buildExpression = (sql, column, operator, value) => {

    if(sql.includes("WHERE"))
    {
        sql += ` AND ${column} ${operator} ${value}`;
    }
    else
    {
        sql += ` WHERE ${column} ${operator} ${value}`;
    }

};

exports.getOccurrences = function(parameters, callback)
{
    database.connection(function(request, error) {

        if (error)
        {
            callback(null, error);
            return;
        }

        let sql = 'SELECT * FROM OCCURRENCE';

        if (parameters.occurrence_type_id)
            buildExpression(sql, 'OCCURRENCE_TYPE_ID', '=', parameters.occurrence_type_id);

        if (parameters.occurrence_subtype_id)
            buildExpression(sql, 'OCCURRENCE_SUBTYPE_ID', '=', parameters.occurrence_subtype_id);

        if (parameters.start_date)
            buildExpression(sql, 'CREATE_DATE', '>=', parameters.start_date);

        if (parameters.finish_date)
            buildExpression(sql, 'CREATE_DATE', '<=', parameters.finish_date);

        if (parameters.responsable_user_id)
            buildExpression(sql, 'RESPONSABLE_USER_ID', '=', parameters.responsable_user_id);

        if (parameters.status)
            buildExpression(sql, 'RESPONSABLE_USER_ID', '=', parameters.status);

        request.query(sql, (error, data) => {

            if (error)
            {
                callback(null, error);
                return;   
            }

            callback(data, null);

        });

    });
}
