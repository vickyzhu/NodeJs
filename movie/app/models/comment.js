/**
 * Created by vickyzhu on 2016/1/5.
 */
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;