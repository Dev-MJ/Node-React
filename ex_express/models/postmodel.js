var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var postSchema = new Schema({   //몽고DB의 스키마 작성.
//    title: String,
    title : {   //validator 설정!
        type: String,
        required: [true, '제목을 입력해주세요']
    },
    content: String,
    thumbnail: String,  //썸네일 콜론 추가(파일 업로드 위해 - 파일명임)
    created_at : {
        type: Date,
        default: Date.now()
    },
    username: String // 작성자 추가
});

//getDate라는 가상 필드를 생성.
postSchema.virtual('getDate').get(function(){   //getDate를 호출하게 되면 날짜가 return됨 -> list.ejs에서 사용할것임
    var date = new Date(this.created_at);
    return {
        year: date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
    };
});
//validator를 path방식으로 설정하기
postSchema.path('content').validate(function(value){
    return value.length > 0;
}, '내용을 입력해주세요');


//insert 할 때마다 primaryKey가 1씩 증가되도록 plugin 설정
postSchema.plugin(autoIncrement.plugin ,
    { model: 'post', field: 'id', startAt: 1 }  //id라는 field로 autoincrement할 것이다. id가 1씩 증가됨. 그리고 post라는 model-table을 생성한다.
);

module.exports = mongoose.model( 'post' , postSchema);  //생성한 스키마를 export한다.
