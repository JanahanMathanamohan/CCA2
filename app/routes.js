var database = require("./models/database.js");
module.exports = function(app, passport){
    app.get('/',function(req,res){
        res.render('index.ejs');
    });
    app.get('/main',isLoggedIn, function(req,res){
        console.log(req.user);
        res.render('profile.ejs',{user:req.user});
    });
    app.get('/logout',function(req,res){
        req.logout();
        res.redirect('/');
    });
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/main',
        failureRedirect : '/'
    }));

    app.get('/location', function(req,res){
        database.locations.find({},function(err,data){
            if(err){
                res.json({message:"fail", error:true});
            }else{
                res.json({message:data, error:false});
            }
        })
    });

    app.post('/insert', function(req,res){
        database.cca2acc.findOne({"fid":req.user.fid},function(err,data){
            if(err){
                res.json({message:"fail", error:true});
            }else{
                console.log(data);
                data.history.push({
                    long : req.body.long,
                    lat: req.body.lat,
                    message: req.body.message,
                    date: new Date()
                });
                data.save(function(err){
                    if(err)
                        res.json({message:data, error:true});
                    database.locations.findOne({'email':req.user.email},function(err,locData){
                        if(err)
                            res.json({message:data, error:true});
                        if(!locData){
                            var locData= new  database.locations();
                            locData.email = req.user.email;
                            locData.clearbit = req.user.clearbit;
                        }
                        locData.long = req.body.long;
                        locData.lat = req.body.lat;
                        locData.message = req.body.message;
                        locData.date = new Date ();
                        locData.save(function(err){
                            if(err){
                                res.json({message:"fail", error:true});
                            }else{
                                res.json({message:"fail", error:false});
                            }
                        })
                    })
                })
            }
        })
    });

    app.post('/inject2',function(req,res){
        var locations = database.locations();
        locations.email = req.body.email;
        locations.long = req.body.long;
        locations.lat = req.body.lat;
        var clearbit = require('clearbit')('sk_445cdef63c8b0d69ab26a93903537de8');
        clearbit.Enrichment.find({email: req.body.email, stream: true}).then(function (response) {
            locations.picture = response.person.avatar;
            locations.clearbit = response;
            locations.save(function(err) {
                if (err)
                    res.json({message:"fail", error:true});
                res.json({message:response, error:false});
            });
        }).catch(function (err) {
            res.json({message:"fail", error:true});
        });
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
