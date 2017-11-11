GDFtemp = {
    shouldRefresh: true,

    viewInit: function (e) {
        var self = GDF.controllers.map;

        var div = document.getElementById("map_canvas");

        // Inicia mapa
        var mapOptions = {
            'mapType': plugin.google.maps.MapTypeId.ROADMAP,
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            }
        };

        var map = plugin.google.maps.Map.getMap(div, mapOptions);

        map.addEventListener(plugin.google.maps.event.MAP_READY, self.onMapReady);


        // Configura ação dos botões
        $("#occurrence-button").on("click", self.onClickOccurrence);
    },

    viewShow: function (e) {
        var self = GDF.controllers.map;
    },

    onMapReady: function () {
        var getPosition = function () {
            GDF.blockApp(GDF.strings.searchingGPS);
            GDF.gps.getCoords(success, defaultPos, { timeout: 3000, tryAgain: false, autoBlockUnblock: false });
        };

        var success = function (coords) {
            GDF.util.goToOnMap({ lat: coords.latitude, lng: coords.longitude });
        };

        var defaultPos = function () {
            GDF.util.goToOnMap({ lat: -23.5761473, lng: -46.6463977 });
        }
    },

    onClickOccurrence: function (e) {
        var self = GDF.controllers.map;

        var startOccurrence = function () {
            GDF.kendoMobileApp.navigate("views/newocurrence.html");
        };

        startOccurrence();
    },
};
