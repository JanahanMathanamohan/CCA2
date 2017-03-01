/**
* Janahan Mathanamohan
* database.js
* This File contains the structure for the database
*/
var mongoose = require("mongoose");
var connection = mongoose.connect("mongodb://YelpFav:test1234@ds139619.mlab.com:39619/yelpfav");
var mongoSchema = mongoose.Schema;

var cca2accSchema = new mongoSchema({
    fid : String,
    email: String,
    token: String,
    history: [],
    clearbit: {    }},
    { minimize: false }
);

var locationSchema  = new mongoSchema({
    email: String,
    long: Number,
    lat: Number,
    message: String,
    date: Date,
    clearbit: {    }},
{ minimize: false }
);

var cca2acc = mongoose.model("cca2acc",cca2accSchema);
var locations = mongoose.model("locations",locationSchema)
module.exports = {cca2acc:cca2acc,locations:locations};



