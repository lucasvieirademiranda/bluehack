const database = require("../database");

let buildExpression = (sql, column, operator, value) => {

    if(sql.includes("WHERE"))
    {
        return ` AND ${column} ${operator} ${value}`;
    }
    else
    {
        return ` WHERE ${column} ${operator} ${value}`;
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
            sql += buildExpression(sql, 'OCCURRENCE_TYPE_ID', '=', parameters.occurrence_type_id);

        if (parameters.occurrence_subtype_id)
            sql += buildExpression(sql, 'OCCURRENCE_SUBTYPE_ID', '=', parameters.occurrence_subtype_id);

        if (parameters.start_date)
            sql += buildExpression(sql, 'CREATE_DATE', '>=', parameters.start_date);

        if (parameters.finish_date)
            sql += buildExpression(sql, 'CREATE_DATE', '<=', parameters.finish_date);

        if (parameters.responsable_user_id)
            sql += buildExpression(sql, 'RESPONSABLE_USER_ID', '=', parameters.responsable_user_id);

        if (parameters.status)
            sql += buildExpression(sql, 'RESPONSABLE_USER_ID', '=', parameters.status);

        request.query(sql, (error, result) => {

            if (error)
            {
                callback(null, error);
                return;   
            }

            let occurrences = [];

            result.recordset.forEach((current) => {
                
                occurrences.push({
                     Id: current.ID,
                     Uuid: current.UUID,
                     OccurrenceTypeId: current.OCCURRENCE_TYPE_ID,
                     OccurrenceSubtypeId: current.OCCURRENCE_SUBTYPE_ID,
                     OwnerUserId:   current.OWNER_USER_ID,
                     InstitutionId: current.INSTITUTION_ID,
                     ResponsableUserId: current.RESPONSABLE_USER_ID,
                     Title: current.TITLE,
                     Description: current.DESCRIPTION,
                     CloseDate: current.CLOSE_DATE,
                     CreateDate: current.CREATE_DATE,
                     Status: current.STATUS,
                     Latitude: current.LATITUDE,
                     Longitude: current.LONGITUDE,
                     Cep: current.CEP,
                     City: current.CITY,
                     State: current.STATE,
                     Address1: current.ADDRESS_1,
                     Address2: current.ADDRESS_2,
                     Notified: current.NOTIFIED,
                     Priority: current.PRIORITY,
                     Criticality: current.CRITICALITY
                });

            });

            callback(occurrences, null);

        });

    });
}
