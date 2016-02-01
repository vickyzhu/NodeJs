/**
 * Created by vickyzhu on 2016/1/5.
 */
var express=require('express');
var port=process.env.PORT || 3000;
var path=require('path');
var app=express();
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');



//var MongoStore=require('connect-mongo')(express);
var connect = require('connect');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
//本地变量
app.locals.moment = require('moment');

app.set('views','./app/views/pages');
//app.use(express.bodyParser());
var dbUrl='mongodb://localhost/movie';
mongoose.connect(dbUrl);

app.use(multipart());
app.use(bodyParser.json());
//表单解析为对象
app.use(bodyParser.urlencoded({ extended: true, uploadDir:'./public/images'}));
app.use(cookieParser());
app.use(session({
    secret:'movie',
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })

}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','jade');
//环境配置
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    app.use(logger(':method :url :status'));
    //代码不压缩
    app.locals.pretty = true;
    mongoose.set('debug',true);
}
//引入路由文件
require('./config/routes')(app);
app.listen(port);

console.log("listening at the port "+port);

