/**
 * Created by vickyzhu on 2016/1/8.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);

module.exports=User;