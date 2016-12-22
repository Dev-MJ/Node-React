var express = require('express');
var router = express.Router();
var postModel = require('../models/postmodel.js');  //생성한 postmodel.js를 가져옴
var CommentModel = require('../models/CommentModel.js');


//
router.get('/', function(req,res){  //url : localhost:300/posts
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

router.get( '/write',function(req,res){     //url : localhost:300/posts/write
    var post = {};      //edit.ejs를 수정에서도 쓰기 떄문에 post를 보내지 않으면 에러가 난다.
    res.render('posts/edit', { post: post });   //views/posts/edit 를 띄우겠다
});

router.post( '/write', function(req,res){   //edit.
//    res.send(req.body); //{title: 123, content : 123} 으로 출력됨
    var post = new postModel({
        title: req.body.title,
        content: req.body.content
    });
    post.save(function(err){
        res.redirect('/posts') ; //저장 한 뒤 response로 응답 보냄(조회 페이지로 이동)
    });
});

//      :id(\\d+) 이렇게 하면 정규표현식으로써, 숫자만 받을 수 있음
router.get( '/detail/:id' , function(req,res){
    //주소에 있는 param는 request.params로 받을 수있다.
    postModel.findOne({ id: req.params.id }, function(err, post){   //callback의 parameters(error, result)
        //res.send(post);
        CommentModel.find({ post_id : req.params.id }, function(err, comments){     //로드시 댓글목록도 출력해야 하므로 select
            res.render('posts/detail', { post: post , comments: comments});
        })

    });
});

//글 수정
router.get( '/edit/:id', function(req,res){
    postModel.findOne({ id: req.params.id }, function(err, post){
        res.render('posts/edit', { post : post });
    });
});

//글 수정 update
router.post( '/edit/:id', function(req,res){
    var query = {
        title: req.body.title,  //form에서 넣은 값은 body로 받을 수 있음
        content: req.body.content
    };
                    //조건절, callback
    postModel.update( { id: req.params.id }, { $set: query }, function(err){
        res.redirect('/posts/detail/'+req.params.id);
    });
});


//글 삭제(in detail.ejs)
router.get( '/delete/:id', function(req,res){
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

        }else{
            res.json({
                message: "success",
                id: comment.id,
                content: comment.content
            });
        }
    });

});

module.exports = router

