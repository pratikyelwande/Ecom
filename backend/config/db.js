import snowflake from 'snowflake-sdk';
    import dotenv from 'dotenv';

    dotenv.config(); // Ensure this line is present

    const connection = snowflake.createConnection({
        account: process.env.SNOWFLAKE_ACCOUNT,
        username: process.env.SNOWFLAKE_USERNAME,
        password: process.env.SNOWFLAKE_PASSWORD,
        warehouse: process.env.SNOWFLAKE_WAREHOUSE,
        database: process.env.SNOWFLAKE_DATABASE,
        schema: process.env.SNOWFLAKE_SCHEMA,
        role: process.env.SNOWFLAKE_ROLE,
    });

    let isConnected = false;

    const connect = () => new Promise((resolve, reject) => {
        if (isConnected) return resolve(connection);

        connection.connect((err) => {
            if (err) {
                console.error('Unable to connect to Snowflake:', err);
                reject(err);
            } else {
                console.log('Successfully connected to Snowflake');
                isConnected = true;
                resolve(connection);
            }
        });
    });

    const executeQuery = async (sql, params) => {
        await connect();
        return new Promise((resolve, reject) => {
            connection.execute({
                sqlText: sql,
                binds: params,
                complete: (err, stmt, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            });
        });
    };

    export { connect, executeQuery };