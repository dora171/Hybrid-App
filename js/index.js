/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

/**
 * Creating a map and setting lat and long
 */
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.815010, lng: 15.981919 },
        zoom: 8,
    });
    /**
     * Creating marker for google map
     */
    var marker = new google.maps.Marker({
        map: map,
        position: { lat: 45.815010, lng: 15.981919 }
    })
    infoWindow = new google.maps.InfoWindow;

	/**
     * Getting current position with lat and long, creating marker
     */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var pos = {
                lat
                , lng
            };

            marker = new google.maps.Marker({
                position: pos
                , map: map
            });
            //showing lat and long
            renderWeatherAndCity(xrh, lat, lng, 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&appid=yourID')
            console.log(xrh, lat, lng, 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '')

            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    /**
     * Creating new XMLHttpRequest and getting selects and options to display info
     */
    var xrh = new XMLHttpRequest()
    //getting elements of selecs and option to display info
    var selects = document.getElementById('selects')
    var options = document.getElementsByTagName('option')
    console.log(selects)

    selects.onchange = function () {
        if (options[0].selected) {
            //long and lat for Zagreb
            renderWeatherAndCity(xrh, 45.815010, 15.981919, 'http://api.openweathermap.org/data/2.5/weather?q=zagreb&units=metric&appid=yourID')
        } else if (options[1].selected) {
            //long and lat for Rochester
            renderWeatherAndCity(xrh, 43.156578, -77.608849, 'http://api.openweathermap.org/data/2.5/weather?q=rochester&units=metric&appid=yourID')

        } else if (options[2].selected) {
            //long and lat for Rovinj
            renderWeatherAndCity(xrh, 45.081165, 13.638707, 'http://api.openweathermap.org/data/2.5/weather?q=rovinj&units=metric&appid=yourID')
        } else if (options[3].selected) {
            //long and lat for Dubrovnik
            renderWeatherAndCity(xrh, 42.650661, 18.094423, 'http://api.openweathermap.org/data/2.5/weather?q=dubrovnik&units=metric&appid=yourID')
        }
    }
}


/**
 * funtcion to get time, hours and minutes
 * @param {*} lat 
 * @param {*} long 
 */
function getTime(lat, long) {
    //Creating new date
    var date = new Date()

    //get local date
    var local = date.getTime() / 1000 + date.getTimezoneOffset() * 60
    //Creating new XMLHttpRequest
    let xml = new XMLHttpRequest()

    //opening request and sending xml http request
    xml.open('GET', 'https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + long + '&timestamp=' + local + '&key=yourKey')
    xml.send()

    //displaying time
    xml.onload = function () {
        let timeCallbaclk = JSON.parse(xml.response)
        var sets = timeCallbaclk.dstOffset * 1000 + timeCallbaclk.rawOffset * 1000
        var localDate = new Date(local * 1000 + sets)
        document.getElementById('time').innerHTML = localDate.getHours() + ":" + localDate.getMinutes()
        console.log(timeCallbaclk)
    }
}

/**
 * Function to get weather and city
 * @param {*} xrh 
 * @param {*} lat 
 * @param {*} long 
 * @param {*} apiCall 
 */
function renderWeatherAndCity(xrh, lat, long, apiCall) {
    //Creating new google map with lat and long
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: long },
        zoom: 8,
    });
    //Creating new marker
    var marker = new google.maps.Marker({
        map: map,
        position: { lat: lat, lng: long },
    })
    //opening, sending xml http request
    xrh.open("GET", apiCall)
    xrh.send()

    //getting element id for temp, city, latitude and longitude
    xrh.onload = function () {
        var data = JSON.parse(xrh.response)
        console.log(data)
        console.log(this.lat)
        document.getElementById('temp').innerHTML = data.main.temp
        document.getElementById('city').innerHTML = data.name
        document.getElementById('latitude').innerHTML = lat
        document.getElementById('longitude').innerHTML = long
    }
    //get time with lat and long param
    getTime(lat, long)
}
