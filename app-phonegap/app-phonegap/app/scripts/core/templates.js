function Templates() { }

Templates.prototype = (function() {
    var _segmentListId = "list-newocurrence-{0}";

    var _formatId = function(id) {
        return 'cform' + id;
    };

    var _formatSegmentId = function(id) {
        return 'cform-seg' + id;
    };

    var _isValidPropertyValue = function (value) {
        return (value && typeof value !== "undefined" && value !== '' && value !== null)
    };

    var _isValidNumberPropertyValue = function (value) {
        return (value && value !== '' && value !== null && !isNaN(value))
    };

    return {
        constructor: Templates,

        photo: function() {
            var html = "";
            html += "<div class=\"customform-page\">";
            html += "    <div class=\"km-listview-wrapper\">";
            html += "        <ul data-role=\"listview\" id=\"list-newocurrence-photo\" class=\"km-widget km-listview km-list\">";
            html += "           <li id=\"CustomFormPicturesLi\">";
            html += "               <label for=\"CustomFormPictures\" data-lang=\"pictures\">Fotos</label>";
            html += "               <input type=\"text\" id=\"CustomFormPictures\" readonly=\"readonly\" style=\"display: inline; width: 90% !important;\">";
            html += "               <a id=\"CustomFormAddPictureButton\" data-align=\"right\" data-icon=\"camera\" class=\"picture-btn\">";
            html += "                   <span class=\"km-icon km-camera km-notext\">";
            html += "               </span></a>";
            html += "           </li>";
            html += "       </ul>";
            html += "    </div>";
            html += "</div>";
            return html;
        },

        dateField: function (item) {
            var id = _formatId(item.Id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='" + id + "'>" + item.Label + "</label>";
            html += "<input id='" + id + "' type='text' class='date'";

            if (_isValidPropertyValue(item.MinValue)) {
                html += " data-min-value='" + item.MinValue + "' ";
            }

            if (_isValidPropertyValue(item.MaxValue)) {
                html += " data-max-value='" + item.MaxValue + "' ";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            return html;
        },

        timeField: function (item) {
            var id = _formatId(item.Id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='" + id + "'>" + item.Label + "</label>";
            html += "<input id='" + id + "' type='text' class='time'";

            if (_isValidPropertyValue(item.MinValue)) {
                html += " data-min-value='" + item.MinValue + "' ";
            }

            if (_isValidPropertyValue(item.MaxValue)) {
                html += " data-max-value='" + item.MaxValue + "' ";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            return html;
        },

        dateTimeField: function (item) {
            var id = _formatId(item.Id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='" + id + "'>" + item.Label + "</label>";
            html += "<input id='" + id + "' type='text' class='datetime'";

            if (_isValidPropertyValue(item.MinValue)) {
                html += " data-min-value='" + item.MinValue + "' ";
            }

            if (_isValidPropertyValue(item.MaxValue)) {
                html += " data-max-value='" + item.MaxValue + "' ";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            return html;
        },

        textField: function (item) {
            var id = _formatId(item.Id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='" + id + "'>" + item.Label + "</label>";
            html += "<input id='" + id + "' type='text'";

            if (_isValidNumberPropertyValue(item.MaxCharacters)) {
                html += " maxlength='" + item.MaxCharacters + "' ";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            return html;
        },

        multilineTextField: function (item) {
            var id = _formatId(item.Id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='" + id + "'>" + item.Label + "</label>";
            html += "<textarea id='" + id + "' type='text'";        

            if (_isValidNumberPropertyValue(item.MaxCharacters)) {
                html += " maxlength='" + item.MaxCharacters + "' ";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            return html;
        },

        numberField: function (item) {
            var id = _formatId(item.Id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='"+ id +"'>" + item.Label + "</label>";
            html += "<input id='"+ id + "' class='number' type='text'";

            if (_isValidNumberPropertyValue(item.MaxCharacters)) {
                var maxI = Number(item.MaxCharacters);

                if (_isValidNumberPropertyValue(item.DecimalPlaces)) {
                    maxI -= Number(item.DecimalPlaces);
                }

                html += " data-max-integers='" + maxI + "' ";
            }
        
            if (_isValidNumberPropertyValue(item.DecimalPlaces)) {
                html += " data-max-decimals='" + item.DecimalPlaces + "' ";
            }

            if (_isValidNumberPropertyValue(item.MinValue)) {
                html += " data-min-value='" + item.MinValue + "' ";
            } else {
                html += " data-allow0=true ";
            }

            if (!(eval(item.Mandatory))) {
                html += " data-allowNull=true ";
            }

            if (_isValidNumberPropertyValue(item.MaxValue)) {
                html += " data-max-value='" + item.MaxValue + "' ";
            }

            // Quando o valor mínimo for nulo assume que pode ser informado 0
            if (!_isValidNumberPropertyValue(item.MinValue)) {
                html += " data-allow0=true data-allowNull=true";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            return html;
        },

        lookupField: function (controller, item, query, param) {
            var id = _formatId(item.Id);
            var aux = GDF.util.pascalCase(id);

            var html = "";
            html += "<li class='dynamic-field'>";
            html += "<label for='" + id + "'>" + item.Label + "</label>";
            html += "<input id='" + id + "' type='text' class='lookup'";

            // Configuração quando for seleção múltipla
            if (Number(item.ComponentType) === GDF.enums.ComponentType.MultipleChoice) {
                html += " options='multiple: true;selection: " + id + "' ";
            }

            html += " data-field=" + item.DbField + " data-model='" + id + "' data-required=" + (eval(item.Mandatory)) + " data-type=" + Number(item.ComponentType) + " />";

            html += "</li>";

            var callback;
            // Configura callback para seleção múltipla
            if (Number(item.ComponentType) === GDF.enums.ComponentType.MultipleChoice) {
                callback = function (item) {
                    // Armazena dados selecionados
                    controller[id] = item;

                    // Configura exibição
                    var dsc = item.length === 1
                        ? item[0]["Cod" + aux] + " - " + GDF.util.pascalCase(item[0]["Dsc" + aux])
                        : item.map(function (elem) {
                            return elem["Cod" + aux];
                        }).join(",");

                    $("#" + id).val(dsc);
                }
            } else {
                callback = function (item) {
                    // Armazena dados selecionados
                    controller[id] = item;

                    // Configura exibição
                    $("#" + id).val(item["Cod" + aux] + " - " + GDF.util.pascalCase(item["Dsc" + aux]));
                }            
            }

            return {
                "html": html,
                "queryName": "query" + aux,
                "query": query,
                "params": param,
                "paramsName": "params" + aux,
                "callbackName": "lookUp" + aux,
                "callback": callback
            }
        },

        getLookupMethod: function (id) {
            var aux = GDF.util.pascalCase(_formatId(id));
            return "lookUp" + aux;
        },

        getSegmentListId: function (id) {
            return "#" + _segmentListId.format(_formatSegmentId(id));
        },

        getId: function (id) {
            return _formatId(id);
        }
    };
})();

GDF.templates = new Templates();
