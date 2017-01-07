var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



//flash 메세지 관련
var flash = require('connect-flash');
//passport 관련
var passport = require('passport');
var session = require('express-session');




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
var accounts = require('./routes/accounts');

//auth 라우터 설정(facebook)
var auth = require('./routes/auth'); //auth.js파일 만들어야함..

//chatting 라우터 설정(socket.io)
var chat = require('./routes/chat');



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

//업로드 path 추가
app.use('/uploads',express.static('uploads'));  //express의 static으로 uploads라는 폴더를 사용할 것이다. url은 /uploads



/*
//세션관련
app.use(session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));
*/

//채팅 위해 세션 미들웨어 수정
var sessionMiddleWare = session({
  secret: 'fastcampus',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2000 * 60 * 60
  }
});
app.use(sessionMiddleWare);


//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash()); //app.use('/', index) 위에 있어야함



//로그인 정보. 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
app.use(function(req, res, next) {
  app.locals.isLogin = req.isAuthenticated();
  //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
  //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
  next();
});



app.use('/', index);
app.use('/users', users);
app.use('/posts',posts);
app.use('/accounts', accounts);

//auth 관련 설정한 라우터 적용
app.use('/auth',auth);

//chat 관련 설정한 라우터 적용
app.use('/chat',chat);


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




//socket.io 세팅
app.io = require('socket.io')();
/*
app.io.on('connection',function(socket){
  console.log(socket.id); //나의 소켓 아이디
  console.log('socket.io connected....');
});
*/

//socket io passport 접근하기 위한 미들웨어 적용
app.io.use(function(socket, next){
  sessionMiddleWare(socket.request, socket.request.res, next);
});

require('./libs/socketConnection')(app.io);





module.exports = app;
