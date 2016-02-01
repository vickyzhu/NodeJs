/**
 * Created by vickyzhu on 2016/1/16.
 */
var User = require('../models/user');

//signup
exports.showSignup = function(req,res){
    res.render('signup',{
        title : '注册页'
    });
}
exports.signup = function(req,res){
    var _user = req.body.user;
    User.findOne({name:_user.name},function(err,user){
        if(err) {
            console.log("err:"+err)
        }
        if(user){
            console.log("this name exists!");
            return res.redirect('/signin');
        }else{
            var user = new User(_user);
            user.save(function(err,user){
                if(err){console.log(err);}
                res.redirect('/');
            });
        }
    });
}

//singin
exports.showSignin = function(req,res){
    res.render('signin',{
        title : '登录页'
    });
}
exports.signin = function(req,res){
    var _user = req.body.user,
        name = _user.name,
        password = _user.password;
    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err);
        }

        if(!user){
            return res.redirect('/signup');
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err);
            }

            if(isMatch){
                req.session.user=user;
                console.log("password is matched!");
                return res.redirect('/');
            }else{
                console.log("password is not matched!");
                return res.redirect('/signin');
            }
        });
    });
}
exports.signinRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
}
//管理员权限
exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    if(user.role <= 10){
       return res.redirect('/signin');
    }
    next();
}
exports.list = function(req,res){
    User.fetch(function(err,users){
        if(err){console.log(err)}
        res.render('userlist',{
            title: 'Movie 用户列表页',
            users:users
        });
    });
}

//logout
exports.logout = function(req,res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
}