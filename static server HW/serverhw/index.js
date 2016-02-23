var express = require('express');
var expressValidator = require('express-validator');
var path = require('path'); //path.resolve
var app = express();
var ums = require('./bin/ums.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var session = require('express-session');

app.use(express.methodOverride());
app.use(expressValidator());
app.use(app.router);

//starting the server
var listener = app.listen(process.env.PORT || 1337, function(){
    console.log('Listening on port '+ listener.address().port);
});

var argument = process.argv; //arguments passed when server is started

if (argument[2]){
    var fullPath = path.resolve(process.cwd(),argument[2]);
    app.use(express.static(fullPath));
    console.log(fullPath);
}
else{
    //if they don't specify a directory
    app.use(express.static(process.cwd() + '/'));
    console.log(argument);
}

/*WUMS assignment (Passport.js)*/

//passport handles user validation
passport.use(new LocalStrategy(function(username, password, done){
    if (ums.authenticate(username,password)==='User authentication successful.') return done(null, {username:username});
    return done(null, false);
}));

//passport serializes user (to store with session)
passport.serializeUser(function(user,done){
    done(null, user.username);
});

//passport deserializes user
passport.deserializeUser(function(id,done){
    done(null, user.username);
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({secret:'mySecret',resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

/*GET request at /services/user */
app.get('/services/user',function(req,res){
    if(req.user)return res.send(req.user.username);
    req.send('not user');
});

/*POST request at /services/user */
app.post('/services/user',function(req,res) {
    if (req.body.email) {
        if (req.body.username) {
            if (req.body.password) {
                ums.createUser(req.body.email, req.body.username, req.body.password)
                    .then(function (resolution) {
                        if (resolution === 'Username already exists.') {
                            req.send('JSON STRING(???)');
                        } else {
                            req.send('User Successfully Created.');
                        }
                    })
            } else {req.send('Password required.');}
        } else {req.send('Username required');}
    } else {req.send('Email required');}
});

/*PUT request at /services/user */
app.put('/services/user', function(req,res){
    if (req.body.email){
        if (req.body.username){
            if (req.body.password){
                ums.createUser(req.body.email, req.body.username, req.body.password)
                    .then(function(resolution){
                        if (resolution === 'Username already exists.'){
                            ums.updatePassword(req.body.username, req.body.password)
                                .then(function (res){
                                    if (res === 'Password successfully updated.'){
                                        req.send(res);
                                    } else{
                                        req.send('JSON STRING(???)');
                                    }
                                })
                        } else{
                            req.send('User Successfully Created + JSON STRING(???)');
                        }
                    });
            } else{req.send('Password required.');}
        } else{req.send('Username required.');}
    } else {req.send('Email required');}
});

/*PUT request at /services/login */
app.put('/services/login', passport.authenticate('local'), function(req, res){
    res.send('You are logged in, ' + req.user.username);
});

/*PUT request at /services/logout */
app.put('/services/logout', function(req, res){
    req.logout();
    res.send('You are logged out');
});