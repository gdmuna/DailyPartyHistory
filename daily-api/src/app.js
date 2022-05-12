const express = require('express');
const fs = require('fs');
const app = express();

// 创建 application/json 编码解析
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// 定义Node Express服务器
var server = app.listen(6666, 'localhost', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server running at http://%s:%s", host, port)
})

// 设置允许跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})



/**
 * @API API主页
 * @method GET,POST
 * @return <text/html>
 */
app.all('/', function (req, res) {
    //res.json("Welcome to 'Daily Party History' ! Here is our Back-End's apis.");
    res.setHeader('Content-Type', 'text/html');
    res.sendFile('public/index.html', { root: __dirname + "/../" });
    console.log('API home page visited.');
})



/**
 * @API 获取接口信息（名称、版本号、仓库地址）
 * @method GET
 * @param null
 * @return {JSONP}
 */
app.get('/info', function (req, res) {
    ProjectName = "DailyPartyHistory"; // 项目名称
    Version = "v2.0.0"; // 版本号
    Repository = "Github: https://github.com/gdmuna/DailyPartyHistory"; // 仓库地址
    const printInfo = "console.log(" +
                                "`%c " + ProjectName + " %c " + Version + " %c " + Repository + "`, " +
                                "'background: #ff6d6d; padding: 4px; border-radius: 3px 0 0 3px; color: #fff', " +
                                "'padding: 3px; border-radius: 0 3px 3px 0; color: #409eff; border: 1px solid #d9ecff; background-color: #ecf5ff;', " +
                                "'background: transparent'" +
                                ");";
    res.send(printInfo);
    console.log('Output api info successfully.');
})



/**
 * @API 获取“今日党史”内容
 * @method POST
 * @param {month: MONTH, day: DAY}
 * @return {id: 一年中的第几天, Date: 月-日, content: 党史内容}
 */
app.post('/cpcContent', jsonParser, function (req, res) {

    date_m = req.body.month; // 获取前端传回的月份
    date_d = req.body.day; // 获取前端传回的日期

    fs.readFile('./db/PartyHistory-m' + date_m + '.json', 'utf-8', function (err, data) {
        x = JSON.parse(data); // 解析读取到的json文件（转换为JSON对象）

        var response = x.word[date_d - 1]; // 获取对应日期的党史内容
        res.json(response); // 以JSON字符串的格式返回给前端

        console.log(response);
    })
})



/**
 * @API 获取随机的团史内容
 * @method GET,POST
 * @return {title: 团史标题, content: 团史内容}
 */
app.all('/ccylContent', function (req, res) {
    fs.readFile('./db/ccylHistory.json', 'utf-8', function (err, data) {
        x = JSON.parse(data); // 解析读取到的json文件（转换为JSON对象）
        n = Math.floor(Math.random() * x.word.length) // 获得一个随机数n

        // 获取随机的团史内容
        var response = {
            title: x.word[n].title,
            content: x.word[n].content
        };
        res.json(response); // 以JSON字符串的格式返回给前端

        console.log(response);
    })
})