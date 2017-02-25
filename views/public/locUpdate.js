
/**
* Janahan Mathanamohan
* YelpSearch.js
* This JS file contains the methods for LookAtList.html
*/
var lat;
var long;

/**
* Gets your current location
**/
function gLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

/**
* Puts your postion on the map
**/
function sPosition(position){
    lat= position.coords.latitude;
    long= position.coords.longitude;
}

$(document).ready(function(){
    var update = [];
    var results;
    gLocation();
    // Functionaility for the submit button. Collects search info and sends it to the yelp search route
    $("#submit").click(function(){
        var toSend = {
            message: $("#message").val(),
            lat: lat,
            long: long
        };
        console.log(toSend);
        $.post("http://localhost:8080/insert",toSend,function(data,status){
            if(status == "success"){
                if(data.error){
                    alert(data.message.data)
                }else{
                    window.location.href = "/main";
                }
            }
        },"json");
    });
});



