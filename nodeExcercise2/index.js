var http = require('http'); //http : 내장모듈

http.createServer(function(request, response){
    response.writeHead(200, { 'Content-Type' : 'text/plain' }); //content type은 텍스트 형식으로
    response.write('Hello Node.js');
    response.end();
}).listen(3000);

