GDFtemp = {
    ds: null,
    dsOptions: null,
    shouldRefresh: true,
    
    filterSyncEntries: false,
    filterNotSyncEntries: true,

    viewInit: function(e) {
        var self = GDF.controllers.ocurrences;

        self.dsOptions = {
            query: self.getQuery(),
            queryParams: [],
            queryFilters: [
                "t.OccurenceTypeName LIKE ?",
                "s.OccurrenceSubtypeName LIKE ?",
                "i.InstitutionName LIKE ?",
                "o.Title LIKE ?",
                "o.Description LIKE ?"
            ]
        };

        self.ds = GDF.sql.createKendoDataSource({
            schema: {
                parse: function(data) {
                    $.each(data, function (idx, elem) {
                        var date = GDF.util.formatDate(new Date(Number(elem.CreateDate)), GDF.util.getDateFormat());
                        elem.FormatedDate = date;
                    });
                    return data;
                },
                model: { id: "Uuid" }
            }
        }, self.dsOptions);

        this.find("#list-ocurrences").kendoMobileListView({
            autoBind: false,
            dataSource: self.ds,
            pullToRefresh: true,
            template: $("#list-ocurrences-template").html(),
            endlessScroll: true,
            virtualViewSize: 50,
            filterable: {
                field: "",
                operator: "startswith",
                placeholder: GDF.strings.searchPlaceHolder
            }
        });

        this.ds.bind("change", function() {
            $(".lib-ocurrences").on("click", function() {
                var uuid = $(this).find("input").val();
                var dataItem = self.ds.get(uuid);
            });
        });
    },

    viewShow: function(e) {
        var self = GDF.controllers.ocurrences;

        if (GDF.controllers.newocurrence) {
            GDF.controllers.newocurrence.shouldRefresh = true;
        }

        if (!self.shouldRefresh) {
            return;
        }

        self.shouldRefresh = false;

        // Carrega lançamentos
        self.updateKendoDataSource();
    },

    updateKendoDataSource: function() {
        var self = GDF.controllers.ocurrences;

        if (self.ds) {
            // Limpa ds
            self.ds.data([]);

            // Configura query
            self.dsOptions.query = self.getQuery();

            // Posiciona no inicio da tela
            self.view.scroller.scrollTo(0, 0);

            // Executa carregamento do novo ds
            self.ds.read();
        }
    },

    getQuery: function() {
        var self = GDF.controllers.ocurrences;

        var query = "";
        query += " SELECT o.Uuid AS Uuid,";
        query += "        o.CreateDate AS CreateDate,";
        query += "        o.OccurenceTypeId AS OccurenceTypeId, ";
        query += "        t.Name AS OccurenceTypeName, ";
        query += "        o.OccurenceSubtypeId AS OccurenceSubtypeId, ";
        query += "        s.Name AS OccurrenceSubtypeName, ";
        query += "        o.ResponsableUserId AS ResponsableUserId, ";
        query += "        COALESCE(r.Username,'') AS ResponsableUserName, ";
        query += "        o.InstitutionId AS InstitutionId, ";
        query += "        i.Name AS InstitutionName, ";
        query += "        o.Title AS Title, ";
        query += "        o.Description AS Description, ";
        query += "        o.Status AS Status ";
        query += "   FROM Occurrence o ";
        query += "  INNER JOIN OccurenceType t ";
        query += "     ON t.Id = o.OccurenceTypeId ";
        query += "  INNER JOIN OccurrenceSubtype s ";
        query += "     ON s.Id = o.OccurenceSubtypeId ";
        query += "   LEFT JOIN User r ";
        query += "     ON r.Id = o.ResponsableUserId ";
        query += "  INNER JOIN Institution i ";
        query += "     ON i.Id = o.InstitutionId ";
        query += "  ORDER BY o.CreateDate DESC ";

        return query;
    },

    // Configuração botão +
    newOcurrence: function(e) {
        var self = GDF.controllers.ocurrences;
        debugger

        var success = function (coords) {
            var params = "lat=" + coords.latitude + "&long=" + coords.longitude;
            GDF.kendoMobileApp.navigate("views/newocurrence.html?" + params);
        };

        var fail = function (error) {
            GDF.util.toast(GDF.strings.failToAccessGPS);
        };

        // Recupera coordenada
        GDF.gps.getCoords(success, fail, { timeout: 30000, tryAgain: true });
    },

    onClickHome: function (e) {
        GDF.kendoMobileApp.navigate("#:back");
    }
}