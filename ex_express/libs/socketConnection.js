
/*module.exports = function(io) { //io : app.js의 app.io가 들어옴
    io.on('connection', function(socket){
        console.log('connection chat....');
        socket.on('chat message', function(data){   //client에서 보낸 'chat message'라는 이름의 data를 받음
            console.log(data);  //{message : 'asdfasdfa'}
            io.emit('chat message', data.message);  //'chat message'라는 이름으로 보내면 client에서 socket.on('chat message') 로 받음
        });
    });
};
*/

require('./removeByValue')();

module.exports = function(io) {
    var userList = [];
    var userCount = 1;
    io.on('connection', function(socket){

        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? ( session.user ) : "";

        // userList 필드에 사용자 명이 존재 하지 않으면 삽입
        if(userList.indexOf(user.username) === -1){
            userList.push(user.username);
        }
        io.emit('join', userList);  //join이라는 이벤트 io에 할당

        socket.on('chat message', function(data){
            io.emit('chat message', { message : data.message , username : user.username }); //user.username : 세션에 저장되어있는 name
        });

        socket.on('disconnect', function(){
            userList.removeByValue(user.username);
            io.emit('leave', userList); //leave라는 이벤트 io에 할당
        });
    });
};
