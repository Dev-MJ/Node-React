var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  //mongoose v4 이상의 버전부터 mongoose의 save()와 쿼리같은 비동기 동작에서는 Promises/A+ conformant pomises를 반환하게 되어있다.
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;   //몽고db에 연결
db.on( 'error', console.error); //db 연결에 실패했을 떄
db.once('open',function(){  //db에 연결되었을때
    console.log("MongoDB connect");
});
var connect = mongoose.connect('mongodb://127.0.0.1/fastcampus'); //몽고디비에서 fastcampus라는 db를 자동으로 생성함. or 여기에 접속
autoIncrement.initialize(connect);  //autoincrement 설정







var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));   //__dirname : 현재 있는 폴더
app.set('view engine', 'ejs');      //view템플릿 엔진 설정

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/posts',posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
