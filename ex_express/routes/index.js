// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;





// 인덱스 라우팅 변경
var express = require('express');
var router = express.Router();
var PostModel = require('../models/postmodel');

/* GET home page. */
router.get('/', function(req, res, next) {
    PostModel.find({} , function(err, posts){
        res.render('./index', { posts : posts });
    });
});

module.exports = router;
