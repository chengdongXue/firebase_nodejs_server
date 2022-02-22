var mysql = require('mysql');
// 建立连接池
const pool = mysql.createPool({
    host: "15.15.161.127",
    user: "hpsa_tester",
    password: "TEST@rocks_335",
    database: "hpsa_test_data",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

exports.query = function(sql, cb) {
    // 从池子里面取一个可用连接
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        // 执行sql
        connection.query(sql, function(err, rows, fields) {
            // 释放连接（一定要在错误处理前，不然出错的时候也会导致该连接得不到释放）
           connection.release();
            if (err) {
                return cosole.error(err);
            }
            cb(rows);
        });
    });
};