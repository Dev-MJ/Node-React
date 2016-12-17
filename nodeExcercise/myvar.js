var a = "hello";
//module.exports.model = a;

//module.exports = { model : "return literal"}; //이렇게 리터럴 객체로 보낼 수도 있음

module.exports.model = function(){      //이렇게 function을 보낼 수도 있음
    return "return function";
}




//함수를 export해서 그 함수로 객체를 만들어보자.
function Myvar() {
    this.name = "my Instance";
}
module.exports = Myvar; //함수 export

//exports를 여러개 하면 마지막 export가 export되는듯!
