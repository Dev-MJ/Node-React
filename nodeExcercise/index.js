console.log('asdf');

var myvar = require('./myvar');   //.js는 생략 가능

//console.log(myvar.model);
//console.log(myvar.model()); //함수를 export할 경우는 이렇게.


//export한 function 받아서 객체 생성하기
var setVar = new myvar();   //myvar가 export 받은 녀석이므로 이 녀석의 객체 생성하면됨.
console.log(setVar.name);


