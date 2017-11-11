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
            },
        };

        var map = plugin.google.maps.Map.getMap(div, mapOptions);

        // Configura ação dos botões
        $("#occurrence-button").on("click", self.onClickOccurrence);
    },

    viewShow: function (e) {
        var self = GDF.controllers.map;
    },

    onClickOccurrence: function (e) {
        var self = GDF.controllers.map;
        GDF.kendoMobileApp.navigate("views/newocurrence.html");

    },
};
