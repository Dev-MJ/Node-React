var express = require('express');
var router = express.Router();

//
router.get('/', function(req,res){  //url : localhost:300/posts
//    res.send('post app');

    //뷰 설정하기
    res.render('posts/list');

    //app.js에 보면 view에 대한 기본 설정이 있따.
    // view engine setup
    // app.set('views', path.join(__dirname, 'views'));  //__dirname : 현재 있는 폴더
    // app.set('view engine', 'ejs');      //view템플릿 엔진 설정
    //따라서 우리가 만들어 줄 view도 저 경로 안에 만들어줘야 함
});

router.get( '/write',function(req,res){     //url : localhost:300/posts/write
    res.render('posts/edit');
});

module.exports = router

