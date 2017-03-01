
var map;
var marker = [];
var infowindow = [];
var uluru = {lat: -25.363, lng: 131.044};

/**
* Gets your current location
**/
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

/**
* Puts your postion on the map
**/
function showPosition(position){
    uluru = {lat: position.coords.latitude, lng: position.coords.longitude}
    map.setCenter(uluru);
}

/**
* Initalizes the Google Map
**/
function initMap() {
    getLocation();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: uluru
    });
        console.log("hi");
    $.get("/location",function(data,status){
        if(status == "success"){
            createMarkers(data.message);
        }else{
            alert("error");
        }
    },"json");
}

function createMarkers(messages){
    var location, panel, tmp, clearbit;
    for(var x = 0; x < messages.length; x++){
        tmp = messages[x];
        clearbit = tmp.clearbit;
        console.log(tmp);
        marker.push(  new google.maps.Marker({
            map: map,
            position: {lat: tmp.lat, lng: tmp.long},
            store_id: x,
        }));
        panel = '<div>';
        if(clearbit.avatar){
            panel += '<img src='+clearbit.avatar+'/><br>'
        }
        panel += '<h4>'+clearbit.name.givenName + '&nbsp'+ clearbit.name.familyName +'</h4><br>';
        panel += '<p>'+ tmp.message +'</p4><br>';
        if(clearbit.twitter){
            panel += '<h4> Twitter: </h4>'+clearbit.twitter.handle+'<br>';
        }
        if(clearbit.github){
            panel += '<h4> GitHub: </h4>'+clearbit.github.handle+'<br>';
        }
        if(clearbit.facebook){
            panel += '<h4> FaceBook: </h4>'+clearbit.facebook.handle+'<br>';
        }
        panel += '<h4>'+ tmp.email+'</h4><br>';
        if(clearbit.site){
            panel += '<a href='+clearbit.site+'>'+clearbit.site+'</a>';
        }
        infowindow.push(new google.maps.InfoWindow({
             content:panel
        }));
        marker[x].addListener('click',function(){
            var index = this.get('store_id');
            infowindow[index].open(map,marker[index]);
        });
    }
}

$(document).ready(function(){
});

