/**
* Janahan Mathanamohan
* routes.js
* This Contains all the routes for the backend and provides a link to the frontend
*/
var database = require("./models/database.js");
module.exports = function(app, passport){
    // This is the route for main page
    app.get('/',function(req,res){
        res.render('index.ejs');
    });

    // This is the route for the main page when logged in
    app.get('/main',isLoggedIn, function(req,res){
        console.log(req.user);
        res.render('profile.ejs',{user:req.user});
    });

    // This is the route for logging out
    app.get('/logout',function(req,res){
        req.logout();
        res.redirect('/');
    });

    // This is the route to authenticate by facebook
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // This is the route to handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/main',
        failureRedirect : '/'
    }));

    // This is the route to get all the nodes 
    app.get('/location', function(req,res){
        database.locations.find({},function(err,data){
            if(err){
                res.json({message:"fail", error:true});
            }else{
                res.json({message:data, error:false});
            }
        })
    });

    // This is the route to insert a new entry into the database
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

    //This route is for testing to inject a value
    app.post('/inject2',function(req,res){
        var locations = database.locations();
        locations.email = req.body.email;
        locations.long = req.body.long;
        locations.lat = req.body.lat;
        var clearbit = require('clearbit')('sk_445cdef63c8b0d69ab26a93903537de8');
        clearbit.Enrichment.find({email: req.body.email, stream: true}).then(function (response) {
            locations.picture = response.person.avatar;
            locations.clearbit = response.person;
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


/**
* Checks if the user is logged in
* @param request, response, nexts
**/
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
