const database = require("../database");

let buildExpression = (sql,column,operator,value,value2) => {

	if(operator == 'between') {

		sql += ` AND ${column} ${operator} ${value} AND ${value2}`;

	} else {

		if(sql.includes("WHERE"))
	    {
	        sql += ` AND ${column} ${operator} ${value}`;
	    }
	    else
	    {
	        sql += ` WHERE ${column} ${operator} ${value}`;
	    }

    }

}

exports.getStatistics = function(parameters, callback)
{
	database.connection((request,error) => {

		if (error)
        {
            callback(null, error);
            return;
        }

        let sql = `SELECT 		COALESCE(COUNT(O.ID),0) AS TOTAL
				   FROM 		OCCURRENCE O
				   INNER JOIN   OCCURRENCE_TYPE OT 
				   ON 			OT.ID = O.OCCURRENCE_TYPE_ID
				   INNER JOIN 	OCCURRENCE_SUBTYPE OS 
				   ON 			OT.ID = O.OCCURRENCE_SUBTYPE_ID`;

		if(parameters.city) {
			buildExpression(sql,'O.CITY','=',parameters.city,null);
		}

		if(parameters.occurrence) {
			buildExpression(sql,'OS.NAME','=',parameters.occurrence,null);
		}

		if(parameters.period1 && parameters.period2) {
			buildExpression(sql,'EXTRACT(YEAR FROM O.CREATE_DATE)','between',parameters.period1,parameters.period2)
		} else if(parameters.period1) {
			buildExpression(sql,'EXTRACT(YEAR FROM O.CREATE_DATE)','between',parameters.period1,null);
		}

		request.query(sql, (error, data) => {

            if (error) {
                callback(null, error);
                return;   
            }

            callback(data, null);

        });

	});

};