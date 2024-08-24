module.exports = {
    LCL: {
        username: process.env.LCL_MYSQL_USER,
        password: process.env.LCL_MYSQL_PASS,
        database: process.env.LCL_MYSQL_DB,
        host: process.env.LCL_MYSQL_HOST,
        port: process.env.LCL_MYSQL_PORT,
        logging: false,
        dialect: 'mysql'
    }
};
