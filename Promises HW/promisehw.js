// uncomment the code below to see a test pass

//exports.getPathType = function() {
//
//};
var fs = require('fs');
var Path = require('path');

//FUNCTION 1 (GETPATHTYPE)
exports.getPathType = function(path){
    if (typeof path !== 'string') return Promise.reject('Path not a string');
    return new Promise(function(resolve,reject){
        fs.stat(path,function(err, stats){
            if (err) resolve("nothing");
            else if (stats.isFile()) resolve("file");
            else if (stats.isDirectory())resolve("directory");
            else (resolve("other"));
        });
    })
};
//getPathType(process.cwd()); //should return "directory"
//console.log(process.cwd());


//FUNCTION 2 (GETDIRECTORYTYPES)
//read the directories
exports.readdir = function(path){
    return exports.getPathType(path)
        .then(function(resolution){
            if (resolution !== 'directory') throw Error('Not a directory');
            return new Promise(function(resolve, reject){
                //fs.readdir returns a directory of everything inside it ("files")
                fs.readdir(path, function(err, files){
                    if (err) return reject(err);
                    return resolve(files);
                });
            });
        });
}

//to use the filter: filter(path, type){return getPathType(path) === type;}
exports.getDirectoryTypes = function(path, depth, filter){
    var result = {}; //map

    if (typeof depth !== 'number') return Promise.reject('not an int');

    if (arguments.length < 2 ) depth = -1;
    if (arguments.length < 3) filter = function(path, type){return true};

    return exports.readdir(path)
        .then(function(files){
            var promises = [];
            files.forEach(function(file){
                var fullPath = Path.resolve(path,file); //path += file;
                var promise = exports.getPathType(fullPath)
                    .then(function(type){
                        if (filter(fullPath, type) === true) result[fullPath] = type; //only add to results if it passed the filter
                        //we have a limit to how deep we want to go (depth)
                        if (type === 'directory' && depth !== 0) return exports.getDirectoryTypes(fullPath, depth-1, filter)
                            .then(function(map){
                                Object.assign(result, map);
                            });
                    });
                promises.push(promise);
            });
            return Promise.all(promises)
                .then(function(){
                    return result;
                });
        })


};

//FUNCTION 3 (EXISTS)
exports.exists = function(path){
    return exports.getPathType(path)
        .then(function(resolution){ //don't need worry about the "not a string" because "rejects" never come to "then"
            if(resolution === "nothing") return false; //if resolves to "nothing", resolve new promise to "false"
            else return true;
        });
};


//FUNCTION 4 (GETFILEPATHS)
exports.getFilePaths = function(path, depth){
    //var results = [];
    return exports.getDirectoryTypes(path, depth, function(path, type){ //why does this line need to return if we return in the .then?
        return type === 'file';
    }).then(function(resolution){
        return Object.keys(resolution);
    })
};

//FUNCTION 5 (READFILE)
exports.readFile = function(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path, 'utf8', function(err, data){
            if (err) return reject(err);
            else return resolve(data);
        })
    })
};

//FUNCTION 6 (READFILES)
exports.readFiles = function(paths){

    if (!Array.isArray(paths))
        return Promise.reject("not an array");

    var promises = [];
    paths.forEach(function(path){
        promises.push(exports.readFile(path));
    });
    return Promise.all(promises).then(function(resolution){
        var map = {};
        paths.forEach(function(path, index){
            //Object.assign(results, map);
            map[path]=resolution[index];
        })
        return map;
    });
}