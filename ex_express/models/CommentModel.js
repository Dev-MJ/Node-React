var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var CommentSchema = new Schema({
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    post_id : Number //save PostModel Primary Key
});

CommentSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

CommentSchema.plugin( autoIncrement.plugin , { model : "comment", field : "id" , startAt : 1 } );   //model명 comment
module.exports = mongoose.model('comment' , CommentSchema);
