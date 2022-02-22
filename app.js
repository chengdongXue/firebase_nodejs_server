const express = require('express');
const querystring = require('querystring');
const path = require('path')
var mysql = require("mysql");
var bodyParser = require('body-parser');

const app = express();
const port = 8888;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/getFirebaseLogInfo', (request, response) => {
    console.log(JSON.stringify(request.query));
    response.status(200).json(request.query);
});

app.post('/saveFirebaseLogInfo', function (req, res) {
    const resObj = {'status': 200, 'message': 'OK'}
    req.rawBody = '';
    let json={};
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function() {
        console.log(JSON.stringify(req.rawBody));
        insertEmployees(JSON.stringify(req.rawBody))
        res.status(200).json(resObj);
    });
});

const insertEmployees = (data) => {
    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: "15.15.161.127",
        port: 3306,
        user: "hpsa_tester",
        password: "TEST@rocks_335",
        database: "hpsa_test_data"
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = "insert into firebase values(NULL, '32323232323', 'Iphone 13 ProMax', 'IOS', '2.2.2', '"+data+"')";
        con.query(sql, function (err, result) {
            if (err) console.log(sql);
            console.log("1 record inserted");
        });
    });
}

app.listen(port, () => {
    console.log(`firebase_log_sys server listening on port ${port}`)
});