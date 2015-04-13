//**********************************************************
// Assignment: P5
// Account: skdoherty@mac.com
// Author: Samuel Kody Doherty
//*********************************************************

//initial model data
var initialHotSpots = [{
    name: "Maggiano's",
    lat: 39.216329,
    lng: -76.860202,
    street: "10300 Little Patuxent Parkway",
    city: "Columbia",
    state: "MD",
    phone: "(410) 730-3706",
    website: "http://locations.maggianos.com/us/maryland/columbia/the-mall-in-columbia/"
}, {
    name: "Panera Bread",
    lat: 39.195841,
    lng: -76.821001,
    street: "6435 Dobbin Rd",
    city: "Columbia",
    state: "MD",
    phone: "(410) 772-8632",
    website: "https://www.panerabread.com/en-us/home.html"
}, {
    name: "Chipotle",
    lat: 39.200559,
    lng: -76.812119,
    street: "6181 Old Dobbin Ln",
    city: "Columbia",
    state: "MD",
    phone: "(410) 872-8688",
    website: "http://www.chipotle.com/en-US/default.aspx?type=default"
}, {
    name: "Mission BBQ",
    lat: 39.199195,
    lng: -76.813579,
    street: "6270 Columbia Crossing Cir",
    city: "Columbia",
    state: "MD",
    phone: "(443) 832-6180",
    website: "http://mission-bbq.com/"
}, {
    name: "UA Snowden Square Stadium 14",
    lat: 39.177644,
    lng: -76.819536,
    street: "9161 Commerce Center Drive",
    city: "Columbia",
    state: "MD",
    phone: "(844) 462-7342",
    website: "http://www.regmovies.com/theatres/theatre-folder/UA-Snowden-Square-Stadium-14-2486?utm_source=maps&utm_medium=organic&utm_campaign=United_Artists_Snowden_Square_Stadium_14_Movie_Theater"
}, {
    name: "Zapata’s Restaurant",
    lat: 39.223320,
    lng: -76.889508,
    street: "5485 Harpers Farm Rd",
    city: "Columbia",
    state: "MD",
    phone: "(410) 715-6929",
    website: "http://www.zapatasonline.com/"
}, {
    name: "Tino’s Italian Bistro",
    lat: 39.226832,
    lng: -76.817999,
    street: "8775 Centre Park Dr",
    city: "Columbia",
    state: "MD",
    phone: "(410) 730-8466",
    website: "http://www.tinositalianbistro.com/"
}, {
    name: "Wegmans Columbia",
    lat: 39.186425,
    lng: -76.820281,
    street: "8855 Mcgaw Rd",
    city: "Columbia",
    state: "MD",
    phone: "(443) 537-2900",
    website: "http://www.wegmans.com/webapp/wcs/stores/servlet/StoreDetailView?langId=-1&storeId=10052&catalogId=10002&productId=738282"
}, ];

// Build each hotspot
var hotSpot = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.street = ko.observable(data.street);
    this.city = ko.observable(data.city);
    this.state = ko.observable(data.state);
    this.address = ko.computed(function() {
        return this.street() + ", " + this.city() + "MD";
    }, this);
    this.phone = ko.observable(data.phone);
    this.website = ko.observable(data.website);
    this.marker = ko.observable({});
    this.img = ko.computed(function() {
        return "https://maps.googleapis.com/maps/api/streetview?size=200x200&location=" + this.address() + "";

    }, this);
}

var ViewModel = function() {

    // Map and list view navigation
    $("#list").hide();
    $('#MapNav').addClass('active');
    var self = this;
    this.mapRoute = function() {
        $('#MapNav').addClass('active');
        $('#ListNav').removeClass('active');
        $("#list").hide();
        $("#map").show();
    };
    this.listRoute = function() {
        $('#ListNav').addClass('active');
        $('#MapNav').removeClass('active');
        $("#map").hide();
        $("#list").show();
    };

    //Create array of hotspot locations
    this.hotSpotList = ko.observableArray([]);
    initialHotSpots.forEach(function(spot) {
        self.hotSpotList.push(new hotSpot(spot));
    });
    // Filter keyword
    this.filter = ko.observable("");
    var match = false;

    //Turn visible to true on all markers
    this.resetMarkers = function() {
        for (i = 0; i < self.hotSpotList().length; i++) {
            self.hotSpotList()[i].marker.setVisible(true);
        }
    };

    // Map of columbia MD
    var mapOptions = {
        center: new google.maps.LatLng(39.203714, -76.861046),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var infoWindow = new google.maps.InfoWindow;

    // Initilize some varibles
    var marker, i;
    var contentString = "";
    var makers
    var url = "";

    //Initialize marker and infowindow
    for (i = 0; i < self.hotSpotList().length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.hotSpotList()[i].lat(), self.hotSpotList()[i].lng()),
            map: map
        });

        self.hotSpotList()[i].marker = marker;

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                url = self.hotSpotList()[i].img();
                contentString = "<h1>" + self.hotSpotList()[i].name() + "</h1><br>" +
                    "<p>" + self.hotSpotList()[i].street() + "<br>" +
                    self.hotSpotList()[i].city() + ", " + self.hotSpotList()[i].state() +
                    "<br>" + self.hotSpotList()[i].phone() + "<br><a href='" +
                    self.hotSpotList()[i].website() + "'>website</a></p><br>" + "<img class='img-responsive' src='" + url + "'>";
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }

    //Hotspot array after it has been filtered
    this.searchLocation = ko.computed(function() {
        var filter = this.filter().toLowerCase();
        // no filter all markers showing
        if (!filter) {
            this.resetMarkers();
            return this.hotSpotList();
        } else {
            //Filter added full text search on Hotspot name.
            this.resetMarkers();
            return ko.utils.arrayFilter(this.hotSpotList(), function(item) {
                match = item.name().toLowerCase().indexOf(filter) != -1;
                if (!match) {
                    item.marker.setVisible(false);
                }
                return match
            });
        }
    }, this);


}

ko.applyBindings(new ViewModel());