const express = require('express');
const querystring = require('querystring');
const path = require('path')
var mysql = require("mysql");
var bodyParser = require('body-parser');
const dbManage = require('./app/dbManage');

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
    response.status(200).json(request.query);
});

app.post('/saveFirebaseLogInfo', function (req, res) {
    const resObj = {'status': 200, 'message': 'OK'}
    let json = null;
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        json = JSON.parse(chunk);
    });
    req.on('end', function() {
        insertEmployees(json);
        res.status(200).json(resObj);
    });
});

const insertEmployees = async (data) => {
    const sql = "insert into firebase values(NULL, '"+data['deviceId']+"', '"+data['deviceName']+"', '"+data['deviceType']+"', '"+data['appVersion']+"', '"+data['eventMessage']+"')";
    dbManage.query(sql, function (err, result) {
        if (err) console.log(sql);
        console.log("1 record inserted");
    });
}

app.listen(port, () => {
    console.log(`firebase_log_sys server listening on port ${port}`)
});