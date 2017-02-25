// passport.js
// Janahan Mathanamohan
// Handles all the with user sessions or creates a new account
//

var passport = require('passport');
var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var database = require('../app/models/database');
var clearbit = require('clearbit')('sk_445cdef63c8b0d69ab26a93903537de8');
var auth = require('./auth2');
module.exports = function(passport) {


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        database.cca2acc.findById(id, function(err, user) {
            done(err, user);
        });
    });

    auth.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(auth,
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            if (!req.user) {
                database.cca2acc.findOne({ 'fid' : profile.id }, function(err, data) {
                    if (err)
                        return done(err);
                    if (data) {
                        if (!data.token) {
                            data.token = token;
                            data.email = (profile.emails[0].value || '').toLowerCase();
                            data.save(function(err) {
                                if (err)
                                    return done(err);
                                return done(null, data);
                            });
                        }
                        return done(null, data );
                    } else {
                        var newCCA2ACC = new database.cca2acc();
                        console.log(profile);
                        console.log(data);
                        newCCA2ACC.history = [];
                        newCCA2ACC.fid    = profile.id;
                        newCCA2ACC.token = token;
                        newCCA2ACC.email = (profile.emails[0].value || '').toLowerCase();
                        clearbit.Enrichment.find({email: newCCA2ACC.email, stream: true}).then(function (response) {
                            newCCA2ACC.clearbit = response.person;
                            newCCA2ACC.save(function(err) {
                                if (err)
                                    return done(err);
                                return done(null, newCCA2ACC);
                            });
                        }).catch(function (err) {
                            newCCA2ACC.clearbit = {
                                name : profile.name
                            };
                            newCCA2ACC.save(function(err) {
                                if (err)
                                    return done(err);
                                return done(null, newCCA2ACC);
                            });
                        });
                    }
                });
            } else {
                var cca2acc = req.user; // pull the user out of the session
                cca2acc.fid    = profile.id;
                cca2acc.token = token;
                cca2acc.email = (profile.emails[0].value || '').toLowerCase();
                clearbit.Enrichment.find({email: cca2acc.email, stream: true}).then(function (response) {
                    cca2acc.clearbit = response.person;
                    cca2acc.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, cca2acc);
                    });
                }).catch(function (err) {
                    cca2acc.clearbit = {
                        name : profile.name
                    };
                    cca2acc.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, cca2acc);
                    });
                });
            }
        });
    }));
}

