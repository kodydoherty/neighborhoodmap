var initialHotSpots = [
    {
        name: "Maggiano's",
        lat: 39.216329 ,
        lng: -76.860202,
        street: "10300 Little Patuxent Parkway",
        city: "Columbia",
        state:"MD",
        phone: "(410) 730-3706",
        website: "http://locations.maggianos.com/us/maryland/columbia/the-mall-in-columbia/"
    },
    {
        name: "Panera Bread",
        lat: 39.195841 ,
        lng: -76.821001,
        street: "6435 Dobbin Rd",
        city: "Columbia",
        state:"MD",
        phone: "(410) 772-8632",
        website: "https://www.panerabread.com/en-us/home.html"
    },
    {
        name: "Chipotle",
        lat: 39.200559 ,
        lng: -76.812119,
        street: "6181 Old Dobbin Ln",
        city: "Columbia",
        state:"MD",
        phone: "(410) 872-8688",
        website: "http://www.chipotle.com/en-US/default.aspx?type=default"
    },
     {
        name: "Mission BBQ",
        lat: 39.199195 ,
        lng: -76.813579,
        street: "6270 Columbia Crossing Cir",
        city: "Columbia",
        state:"MD",
        phone: "(443) 832-6180",
        website: "http://mission-bbq.com/"
    },
    {
        name: "UA Snowden Square Stadium 14",
        lat: 39.177644,
        lng: -76.819536,
        street: "9161 Commerce Center Drive",
        city: "Columbia",
        state:"MD",
        phone: "(844) 462-7342",
        website: "http://www.regmovies.com/theatres/theatre-folder/UA-Snowden-Square-Stadium-14-2486?utm_source=maps&utm_medium=organic&utm_campaign=United_Artists_Snowden_Square_Stadium_14_Movie_Theater"
    },
        {
        name: "Zapata’s Restaurant",
        lat: 39.223320 ,
        lng: -76.889508,
        street: "5485 Harpers Farm Rd",
        city: "Columbia",
        state:"MD",
        phone: "(410) 715-6929",
        website: "http://www.zapatasonline.com/"
    },
    {
        name: "Tino’s Italian Bistro",
        lat: 39.226832 ,
        lng: -76.817999,
        street: "8775 Centre Park Dr",
        city: "Columbia",
        state:"MD",
        phone: "(410) 730-8466",
        website: "http://www.tinositalianbistro.com/"
    },
     {
        name: "Wegmans Columbia",
        lat: 39.186425 ,
        lng: -76.820281,
        street: "8855 Mcgaw Rd",
        city: "Columbia",
        state:"MD",
        phone: "(443) 537-2900",
        website: "http://www.wegmans.com/webapp/wcs/stores/servlet/StoreDetailView?langId=-1&storeId=10052&catalogId=10002&productId=738282"
    },
];

var hotSpot = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.street = ko.observable(data.street);
    this.city = ko.observable(data.city);
    this.state = ko.observable(data.state);
    this.address = ko.computed(function(){
        return this.street() + ", " + this.city() + "MD";
    },this);
    this.phone = ko.observable(data.phone);
    this.website = ko.observable(data.website);
    this.img = ko.computed(function() {
        return "https://maps.googleapis.com/maps/api/streetview?size=200x200&location=" + this.address() + "";

    }, this);
}

var ViewModel = function() {
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

    initialHotSpots.forEach(function(spot){
        self.hotSpotList.push(new hotSpot(spot));
    });
    this.filter = ko.observable("");
    this.searchLocation = ko.computed(function() {
        var filter = this.filter().toLowerCase();
        if (!filter) {
            return this.hotSpotList();
        } else {
            return ko.utils.arrayFilter(this.hotSpotList(), function(item){
                return item.name().toLowerCase().indexOf(filter) != -1;
            });
        }
    }, this);

    // Map of columbia MD
    var mapOptions = {
        center: new google.maps.LatLng(39.203714,-76.861046),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //Initialize marker and infowindow
    var infoWindow = new google.maps.InfoWindow;
    var marker , i;
    var contentString = "";

    var url = "" ;


    this.searchLocation.subscribe(function() {
        console.log('changed');
        for (i = 0; i < self.searchLocation().length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(self.searchLocation()[i].lat(), self.searchLocation()[i].lng()),
                map: map
            });

            google.maps.event.addListener(marker,'click',(function(marker, i){
                   return function() {
                        url = self.searchLocation()[i].img();
                        contentString = "<h1>" + self.searchLocation()[i].name() + "</h1><br>" +
                        "<p>" + self.searchLocation()[i].street() + "<br>" +
                        self.searchLocation()[i].city() + ", " + self.searchLocation()[i].state() +
                         "<br>" + self.searchLocation()[i].phone() + "<br><a href='" +
                        self.searchLocation()[i].website() +"'>website</a></p><br>"
                        + "<img class='img-responsive' src='" + url + "'>";
                        infoWindow.setContent(contentString);
                        infoWindow.open(map, marker);
                   }
            })(marker, i));
        }
    });

}

ko.applyBindings(new ViewModel());


