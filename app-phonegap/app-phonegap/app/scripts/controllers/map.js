GDFtemp = {
    shouldRefresh: true,
    hasPlugin: true,

    viewInit: function (e) {
        var self = GDF.controllers.map;

        try {
            var div = document.getElementById("map_canvas");

            // Inicia mapa
            var mapOptions = {
                'mapType': plugin.google.maps.MapTypeId.ROADMAP,
                'controls': {
                    'compass': false,
                    'myLocationButton': true,
                    'indoorPicker': true,
                    'zoom': true
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                }, 'camera': {
                    'latLng': { lat: -23.5761473, lng: -46.6463977 },
                    'tilt': 60,
                    'zoom': 18,
                    'bearing': 140
                }
            };

            GDF.settings.map = plugin.google.maps.Map.getMap(div, mapOptions);
            GDF.settings.map.on(plugin.google.maps.event.MAP_READY, self.onMapReady);
        } catch (e) {
            self.hasPlugin = false;
        }
    },

    viewShow: function (e) {
        var self = GDF.controllers.map;
    },

    onMapReady: function (map) {
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

        // Plota marcações das ocorrências
        GDF.sql.query("SELECT Latitude, Longitude, Title, Status FROM Occurrence", [], function (data) {
            $.each(data, function (ìdx, item) {
                GDF.settings.addMarker({
                    'position': { "lat": Number(item.Latitude), "lng": Number(item.Longitude) },
                    'title': item.Title,
                    'snippet': GDF.util.getStatus(item.Status)
                }, function (marker) {
                    marker.showInfoWindow();
                });
            })
        });

    },

    onClickOccurrence: function (e) {
        var self = GDF.controllers.map;

        // Limpa endereço anterior
        GDF.settings.occurrenceLocal = null;

        self.onStartOccurrence();
    },

    onStartOccurrence: function (e) {
        var self = GDF.controllers.map;

        var startOccurrence = function () {
            if (GDF.controllers.newocurrence) {
                GDF.controllers.newocurrence.shouldRefresh = true; 
            }

            GDF.kendoMobileApp.navigate("views/newocurrence.html");
        };

        var fail = function () {
            GDF.util.toast(GDF.strings.failToAccessGPS);
        };   

        var getPosition = function () {
            GDF.blockApp(GDF.strings.searchingAddress);
            GDF.gps.getCoords(getAddress, fail, { timeout: 30000, tryAgain: true, autoBlockUnblock: false });
        };

        var getAddress = function (coords) {
            var position = { "position": { "lat": coords.latitude, "lng": coords.longitude } };

            if (!self.hasPlugin) {
                GDF.unblockApp();
                GDF.settings.occurrenceLocal = { "lat": coords.latitude, "lng": coords.longitude };
                startOccurrence();
                return;
            }

            plugin.google.maps.Geocoder.geocode(position, function (results) {
                GDF.unblockApp();
                if (results.length > 0) {
                    GDF.settings.occurrenceLocal = results[0];
                    startOccurrence();
                } else {
                    GDF.settings.occurrenceLocal = { "lat": coords.latitude, "lng": coords.longitude };
                    GDF.util.toast(GDF.strings.startOccurrenceWithoutAddress, undefined, startOccurrence);
                }
            })
        };

        getPosition();
    }
};
