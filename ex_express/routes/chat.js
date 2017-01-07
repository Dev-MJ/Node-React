var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    //res.render('chat/chat');
     if(!req.isAuthenticated()){
        res.send('<script>alert("로그인이 필요한 서비스입니다.");location.href="/accounts/login";</script>');
    }else{
        res.render('chat/chat');
    }
});

module.exports = router;
