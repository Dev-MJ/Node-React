var express = require('express');
var router = express.Router();
var postModel = require('../models/postmodel.js');  //생성한 postmodel.js를 가져옴
var CommentModel = require('../models/CommentModel.js');

//로그인 체크 미들웨어 require.
var loginRequired = require('../libs/loginRequired');


//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname, '../uploads'); // __dirname : 현재 위치 return. 현재위치는 routes폴더이므로 이 한단계 위로 간 뒤에 /uploads로 접근
var fs = require('fs'); //node 내장모듈


//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback) {
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) { // filename 규칙 생성
        callback(null, 'posts-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });


// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: false });



//미들웨어 만들기
function myMiddle(req, res, next){
    req.test = "11";
    next();     //이렇게 next()를 해줘야 미들웨어!!
}


//내가 만든 미들웨어 넣어보자(url과 콜백 사이에 들어가는 것들은 전부 미들웨어!! 콜백이 이루어지기 전에 실행된다 . 여러개 생성 가능)
router.get('/', myMiddle, function(req,res){  //url : localhost:300/posts
    console.log(req.test);
//    res.send('post app');
                    //조건이 없으므로 { } 빈칸.
    postModel.find({ }, function(err, posts){   //(error, 내가 받아올 인자들)
        res.render( 'posts/list', { posts: posts });    //list.ejs로 posts를 쏴준다.
    });
    //뷰 설정하기
//    res.render('posts/list');

    //app.js에 보면 view에 대한 기본 설정이 있따.
    // view engine setup
    // app.set('views', path.join(__dirname, 'views'));  //__dirname : 현재 있는 폴더
    // app.set('view engine', 'ejs');      //view템플릿 엔진 설정
    //따라서 우리가 만들어 줄 view도 저 경로 안에 만들어줘야 함
});

        //view에 인자로 넘기기 위해 파라메터 설정  ㄱ
router.get( '/write', loginRequired, parseForm, csrfProtection, function(req,res){     //url : localhost:300/posts/write
    var post = {};      //edit.ejs를 수정에서도 쓰기 떄문에 post를 보내지 않으면 에러가 난다.
    res.render('posts/edit', { post: post, csrfToken: req.csrfToken() });   //views/posts/edit 를 띄우겠다
                                            //ㄴ> view에 post뿐 아니라 csrfToken도 인자로 넘긴다
});
       //thumbnail의 필드명 저장(이 이름은 ejs에서의 name임)  ㄱ    /    받는 쪽에도 csrf 설정 ㄱ (csrf 확인용도. 이게 없으면 csrf 확인 자체를 안함)
router.post( '/write', loginRequired, upload.single('thumbnail'), csrfProtection, function(req,res){   //edit.
//    res.send(req.body); //{title: 123, content : 123} 으로 출력됨

    console.log(req.file);  //request의 file로 날아옴(multer라 file의 파라메터들을 정렬해줌)
    /*
    { fieldname: 'thumbnail',
      originalname: '스크린샷 2016-12-29 오후 9.31.12.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: '/Users/LMJ/dev/Node&React/ex_express/uploads',
      filename: 'posts-1483015543536.png',
      path: '/Users/LMJ/dev/Node&React/ex_express/uploads/posts-1483015543536.png',
      size: 165418
    }
  */
    var post = new postModel({
        title: req.body.title,
        content: req.body.content,
        thumbnail: (req.file) ? req.file.filename : "",      //req.file이 있으면 req.file.filename을 저장, 없으면 "" 공백저장
        username: req.user.username //req.user : 세션정보 접근

    });

    //postModel에 작성한 validator 확인부분
    var validationError = post.validateSync();
    if(validationError){
        res.send(validationError);
    }else{
        post.save(function(err){
        res.redirect('/posts') ; //저장 한 뒤 response로 응답 보냄(조회 페이지로 이동)
    });
    }


});

//      :id(\\d+) 이렇게 하면 정규표현식으로써, 숫자만 받을 수 있음
router.get( '/detail/:id' , function(req,res){          //url : localhost:3000/posts/detail/id
    //주소에 있는 param는 request.params로 받을 수있다.
    postModel.findOne({ id: req.params.id }, function(err, post){   //callback의 parameters(error, result)
        //res.send(post);
        CommentModel.find({ post_id : req.params.id }, function(err, comments){     //로드시 댓글목록도 출력해야 하므로 select
            res.render('posts/detail', { post: post , comments: comments});
        })

    });
});

//글 수정       로그인 체크 미들웨어 넣음 ㄱ
router.get( '/edit/:id', loginRequired, parseForm, csrfProtection, function(req,res){         //url : localhost:3000/posts/edit/id
    postModel.findOne({ id: req.params.id }, function(err, post){

        res.render('posts/edit', { post : post, csrfToken: req.csrfToken() });
    });
});

//글 수정 update
router.post( '/edit/:id', loginRequired,upload.single('thumbnail'), csrfProtection, function(req,res){

    postModel.findOne({ id: req.params.id}, function(err,post){ //기존에 해당 글의 thumbnail 명을 select 해옴.

        if(req.file){       //요청중에 파일이 존재할 시에 지움
            fs.unlinkSync( uploadDir+'/'+post.thumbnail);
        }

        var query = {
            title: req.body.title,  //form에서 넣은 값은 body로 받을 수 있음
            content: req.body.content,
            thumbnail: (req.file) ? req.file.filename : post.thumbnail      //수정이니까 파일 업로드시 새로운 파일이면 덮어씌우고, 없으면 기존 thumbnail명으로 함
        };
                        //조건절, callback
        postModel.update( { id: req.params.id }, { $set: query }, function(err){
            res.redirect('/posts/detail/'+req.params.id);
        });
    });
});


//글 삭제(in detail.ejs)
router.get( '/delete/:id', function(req,res){           //url : localhost:3000/posts/delete/id
                        //조건절, callback
    postModel.remove( { id: req.params.id }, function(err){
        res.redirect( '/posts');
    });
});




//ajax
router.post( '/ajax_comment/insert', function(req,res){
//    res.send(req.body);
    var comment = new CommentModel({
        content: req.body.content,
        post_id: parseInt(req.body.post_id)
    });
    comment.save(function(err, comment){
        if(err){

        }else{      //글 작성시에는 res.redirect or res.render 했었는데 여기선 json으로 response함
            res.json({
                message: "success",
                id: comment.id,
                content: comment.content
            });
        }
    });
});

router.post('/ajax_comment/delete', function(req,res){
    if(req.xhr){    //ajax 응답인지 체크. ajax일떄만 반응하도록 함.
        CommentModel.remove(
            { id: parseInt(req.body.comment_id) },
            function(err){
                res.json({message: "success"});
            }
        );
    }else{  //ajax 응답이 아니면
        res.status(404).send('Not Found');
    }
});

module.exports = router

