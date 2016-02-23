var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('it410Project', server, {safe:true}),
    users = 'user';

db.open(function(err,db){
    if(!err){
        console.log("Connected to it410Project mongo database");
        db.collection(users, {strict:true, safe:true}, function(errCol, collection){
            if(errCol){
                console.log("The "+users+" collection doesn't exist");
                createCollection();
            }
        });
    }else{
        console.log("There is no it410Project database in MongoDB.");
        console.log(err);
    }
});

var createCollection = function() {
    db.createCollection("user", function(err, collection){});
};

/*Authenticate user with password*/
exports.authenticate = function(username, password){
    return new Promise(function(resolve, reject){
        db.collection(users, function(err, collection){
            collection.findOne({'username':username, 'password':password},function(err,result){
                if(result){
                    //req.session.username = result.username; //wrong
                    return resolve("User authentication successful.");
                }
                else {
                    return resolve("User authentication failed.")
                }
            })
        })
    })

};

/*Update user pw*/
exports.updatePassword = function(username, password){
    return new Promise(function(resolve, reject){
        db.collection(users, function(err, collection){
            var user = collection.findOne({'username':username},function(err,result){
                if (!err){
                    collection.update({'username':username}, {'password':password}, {safe:true},function(err,resultUpdate){
                        if(err) return resolve("Password failed to update.");
                        return resolve('Password successfully updated.');
                    });
                }else return resolve("User not found "+err);
            });
        });
    });
};


/*Create user*/
exports.createUser = function(email,username,password){
    return new Promise(function(resolve, reject){
        db.collection(users, function(err,collection){
            collection.findOne({'username':username, 'password':password},function(err,result){
                if(result){
                    return resolve("Username already exists.")
                } else{
                    collection.insert({
                        email: email,
                        username:username,
                        password: password,
                        created: Date.now()
                    }, {safe:true}, function(err, result){
                        if(result){
                            return resolve('New user '+username+' added');
                        }
                    });
                }
            });
        })
    })
};