//array를 value값으로 조회해서 삭제할 수 있는 library 작성
module.exports = function(){
    Array.prototype.removeByValue = function (search) {
        var index = this.indexOf(search);
        if (index !== -1) {
            this.splice(index, 1);
        }
    };
};
