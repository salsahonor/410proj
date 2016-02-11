/**
 * Created by Sarah on 2/10/2016.
 */
"use strict";
var expect = require('chai').expect;
var ums = require('../ums.js');

describe ('ums', function(){
    describe('createUser', function(){
        it('returns a promise', function () {
            expect(ums.createUser('sarah', 'sarahr0x')).to.be.instanceof(Promise);
        });

        it('Test that a user can be created.', function () {
            return ums.createUser('sarah@sarah.com', 'sarah', 'sarahr0x')
                .then(function(result) {
                    expect(result).to.be.equal('New user sarah added');
                });
        });

        it('Test that a username already existing cannot be recreated.', function () {
            return ums.createUser('sarah@sarah.com', 'sarah', 'sarahr0x')
                .then(function(result) {
                    expect(result).to.be.equal('Username already exists.');
                });
        });
    });

    describe('authenticate', function(){
        it('returns a promise', function () {
            expect(ums.authenticate('sarah', 'sarahr0x')).to.be.instanceof(Promise);
        });

        it('Test that a correct username and password passes the authentication check.', function () {
            return ums.authenticate('sarah', 'sarahr0x')
                .then(function(result) {
                    expect(result).to.be.equal('User authentication successful.');
                })
        });

        it('Test that an incorrect username and password does not pass the authentication check.', function () {
            return ums.authenticate('taylor', 'swift')
                .then(function(result) {
                    expect(result).to.be.equal('User authentication failed.');
                })
        });
    });

    describe('updatePassword', function(){
        it('returns a promise', function () {
            expect(ums.updatePassword('sarah', 'password')).to.be.instanceof(Promise);
        });

        it('Test that a user can change their password.', function () {
            return ums.updatePassword('sarah', 'sarahrulz')
                .then(function(result) {
                    expect(result).to.be.equal('Password successfully updated.');
                });
        });

    });
})