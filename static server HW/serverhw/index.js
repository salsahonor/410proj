var express = require('express');
var path = require('path'); //path.resolve
var app = express();


var listener = app.listen(process.env.PORT || 1337, function(){
    console.log('Listening on port '+ listener.address().port);
});

var argument = process.argv;

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