var expect = require('chai').expect;
var hw = require('./promisehw.js');

describe ('hw', function(){

    describe('getPathType', function(){

        //check if see if actually returns promise
        it('returns a promise', function(){
            expect(hw.getPathType('medium.txt')).to.be.instanceof(Promise);
        });

        it('it is a file', function() {
            var x = hw.getPathType('large.txt')
                .then(function(resolution){
                    expect(resolution).to.be.equal('file');
                });
            return x;
        });

        it('it is a directory', function() {
            var x = hw.getPathType('node_modules')
                .then(function(resolution){
                    expect(resolution).to.be.equal('directory');
                });
            return x;
        });

        it('nothing is there', function() {
            var x = hw.getPathType('sarah.txt')
                .then(function(resolution){
                    expect(resolution).to.be.equal('nothing');
                });
            return x;
        });

    });

    describe('getDirectoryTypes', function(){

        it('returns a promise', function(){
            expect(hw.getDirectoryTypes('new.js')).to.be.instanceof(Promise);
        });

    });

    describe('exists', function(){

        it('returns a promise', function(){
            expect(hw.exists('new.js')).to.be.instanceof(Promise);
        });

    });

    describe('getFilePaths', function(){

        it('returns a promise', function(){
            expect(hw.getFilePaths('new.js')).to.be.instanceof(Promise);
        });

    });

    describe('readFile', function(){

        it('returns a promise', function(){
            expect(hw.readFile('new.js')).to.be.instanceof(Promise);
        });

    });

    describe('readFiles', function(){

        it('returns a promise', function(){
            expect(hw.readFiles('new.js')).to.be.instanceof(Promise);
        });

    });

});