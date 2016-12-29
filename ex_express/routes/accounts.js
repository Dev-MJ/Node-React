var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passwordHash = require('../libs/passwordHash');

router.get('/',function(req,res){
    res.send('accounts app');
});

router.get('/join',function(req,res){
    //res.send('accounts join');
    res.render('accounts/join');
});

router.post('/join', function(req,res){
    var User = new UserModel({
        username: req.body.username,
        password: passwordHash(req.body.password)
    });
    User.save(function(err){
        res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');
    })
});



router.get('/login',function(req,res){
    res.render('accounts/login');
});

router.get('/success',function(req,res){
    res.send('accounts success');
})

module.exports = router;
