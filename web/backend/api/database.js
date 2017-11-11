//let pool = global.pool;

exports.connection = (callback) => {
    
    let pool = global.pool();

    pool.connect((error) => {

        if (error)
            callback(null, error);

        let request = pool.request();

        callback(request, null);

    });

};

exports.transactionedConnection = (callback) =>
{
    let pool = global.pool();
    
    pool.connect((error) => {

        if (error)
            callback(null, error);

        let transaction = pool.transaction();

        callback(transaction, null);

    });
};