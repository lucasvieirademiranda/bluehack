// Include global functions
GDF.util.getApiAddress = function (controller, method) {
    var result = GDF.settings.devmode ? GDF.settings.apiServerUrlDev : GDF.settings.apiServerUrlProd;
    result += controller + "/" + method;
    return result;
};

GDF.util.authenticate = function (_user, _password, success, error) {
    var user = {
        UserName: _user.trim(),
        Password: hex_md5(_password).toString().toUpperCase()
    };

    $.ajax({
        url: (GDF.util.getApiAddress("Auth")),
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        timeout: GDF.defaultExternalTimeout,
        cache: false,
        success: function (data) {
            success(data);
        },
        error: function (result, textStatus) {
            if (typeof error === "function") {
                var msg = GDF.lang.connectionErrorMessage(result.status, textStatus);
                if (msg === GDF.strings.generalRequestError) {
                    msg = result.statusText;
                }
                error(msg, result.status == 0);
            }
        },
        complete: function (result, textStatus) {
            if (textStatus == "timeout") {
                var msg = GDF.lang.connectionErrorMessage(result.status, textStatus);
                if (typeof error === "function") {
                    error(msg, true);
                }
            }
        }
    });
};

GDF.util.syncronize = function (_uri, _type, _data, success, error) {
    var configDataToSend = function () {
        var result = _data ? (typeof _data === "string" ? _data : JSON.stringify(_data)) : {};
        return result;
    };

    var fail = function (result, textStatus) {
        if (typeof error === "function") {
            error(result);
        } else {
            GDF.unblockApp();
            GDF.messageBox(msg);
        }
    };

    $.ajax({
        url: _uri,
        type: _type,
        contentType: "application/json",
        data: configDataToSend(),
        timeout: GDF.defaultExternalTimeout,
        cache: false,
        success: function (data) {
            success(data.Data);
        },
        error: fail, 
        complete: function (result, textStatus) {
            if (textStatus == "timeout") {
                fail(result, textStatus);
            }
        }
    });
};

GDF.util.downloadData = function (success, fail) {
    GDF.blockApp(GDF.strings.syncing);

    // Configura array de informações a serem sincronizadas
    var datatosync = [
        { "Controller": "institution", "Method": "getInstitutions", "Params": null, "Table": "Institution", "Fields": ["Id", "Name", "Phone", "Email"] },
        { "Controller": "occurrenceType", "Method": "getOccurrenceTypes", "Params": null, "Table": "OccurenceType", "Fields": ["Id", "Name"] },
        { "Controller": "occurrenceSubtype", "Method": "getOccurrenceSubtypes", "Params": null, "Table": "OccurrenceSubtype", "Fields": ["Id", "OccurrenceTypeId", "Name"] },
    ];

    // Váriavel de controle de falha ao realizar sincronia
    var errors = [];

    var syncCount = 1;
    var checkSincronize = function () {
        // Seta sincronia referente ao idsync como completada
        syncCount++;

        // Verifica se sincroniza foi finalizada
        if (syncCount == datatosync.length) {
            GDF.unblockApp();

            if (errors.length > 0) {
                fail(errors);
            } else {
                success();
            }
        }
    };

    var syncronize = function (item) {
        var controller = item.Controller;
        var method = item.Method;
        var params = item.Params;
        var table = item.Table;
        var columns = item.Fields;

        // Sincronismo
        GDF.util.syncronize(GDF.util.getApiAddress(controller, method), GDF.enums.AjaxType.Get, params, function (data) {
            var values = [];

            if ($.isArray(data)) {
                $.each(data, function (idx, v) {
                    var elem = [];
                    $.each(columns, function (idxc, c) {
                        elem.push(v[c]);
                    });
                    values.push(elem);
                });
            } else {
                var elem = [];
                $.each(columns, function (idxc, c) {
                    elem.push(data[c]);
                });
                values.push(elem);
            }

            GDF.sql.multipleInsert(table, columns, values, true, checkSincronize, checkSincronize);
        }, function (error) {
            errors.push(GDF.strings.failToSincronize);
            checkSincronize();
        });
    };

    $.each(datatosync, function (idx, item) {
        syncronize(item);
    });
}

GDF.util.uploadOccurence = function (nomessage, success, fail) {
    GDF.blockApp(GDF.strings.sendingOccurrence);

    var finishedUpload = function (fail, empty) {
        GDF.unblockApp();

        // Verifica se houve erro no processo de sincronia
        if (typeof fail === "string" || (Array.isArray(fail) && fail.length > 0)) {
            GDF.util.toast(GDF.strings.failToSend);

            if (typeof fail === "function") {
                fail();
            }
        } else {
            if (!empty && !nomessage) {
                GDF.util.toast(GDF.strings.successToSend);
            }

            if (typeof success === "function") {
                success();
            }
        }
    };

    var uploadFail = function (error) {
        finishedUpload(error);
    };

    var doUpload = function () {
        // Query para recuperar ocorrências
        var query = "";
        query += "SELECT Uuid, ";
        query += "       OccurenceTypeId, ";
        query += "       OccurenceSubtypeId, ";
        query += "       OwnerUserId, ";
        query += "       Title, ";
        query += "       Description, ";
        query += "       CreateDate, ";
        query += "       Latitude, ";
        query += "       Longitude, ";
        query += "       Cep, ";
        query += "       State, ";
        query += "       City, ";
        query += "       Address1, ";
        query += "       Address2, ";
        query += "       Criticality ";
        query += "  FROM Occurrence ";
        query += " WHERE InternalStatus = ? ";

        var queryparam = [GDF.enums.RecordStatus.Open];

        // Query para recuperar imagens
        var queryImage = "SELECT Src FROM OccurrenceImage WHERE UuidOccurrence = ?";

        // Recupera dados das ocorrências que devem ser enviadas
        GDF.sql.query(query, queryparam, function (data) {
            // Verifica se há dados há enviar, se não houver vai para o próximo passo
            if (data.length === 0) {
                finishedUpload(true);
                return;
            }

            // Sucesso após envio dos dados
            var uploadSuccess = function (result) {
                var updateQueries = [];
                var updateParams = [];

                $.each(data, function (idx, elem) {
                    updateQueries.push("UPDATE Occurrence SET InternalStatus = ? WHERE Uuid = ?");
                    updateParams.push([GDF.enums.RecordStatus.Syncronized, Number(elem.Uuid)]);
                });

                GDF.sql.queries(updateQueries, updateParams, finishedUpload);
            };

            // Função para envio dos dados
            var count = 1;
            var sendData = function (idx, images) {
                // Configura imagens a serem enviadas
                data[idx].Images = [];
                if (images.length > 0) {
                    data[idx].Images = images.map(function (x) {
                        return x.Src;
                    });
                }

                // Só continua processo de envio quando todas imagens forem carregadas ou seja, count for igual numero total de ocorrências
                if (count < data.length) {
                    count++;
                    return;
                }

                GDF.util.syncronize(GDF.util.getApiAddress("occurrence", "postOccurrences"), GDF.enums.AjaxType.Post, data, uploadSuccess, uploadFail);
            };

            // Trata dados à serem enviados
            $.each(data, function (idx, elem) {
                // Configura campo do tipo data
                if (typeof elem["CreateDate"] !== "undefined") {
                    elem["CreateDate"] = new Date(elem["CreateDate"]);
                    elem["OccurenceTypeId"] = Number(elem["OccurenceTypeId"]);
                    elem["OccurenceSubtypeId"] = Number(elem["OccurenceSubtypeId"]);
                    elem["OwnerUserId"] = Number(elem["OwnerUserId"]);
                    elem["Latitude"] = Number(elem["Latitude"]);
                    elem["Longitude"] = Number(elem["Longitude"]);
                    elem["Criticality"] = Number(elem["Criticality"]);                    
                }

                // Carrega dados de cada lançamento
                var param = [elem.Uuid];
                GDF.sql.query(queryImage, param, function (images) {
                    sendData(idx, images);
                }, function () {
                    uploadFail("");
                    return false;
                });
            });
        }, function () {
            uploadFail("");
        });
    };

    // Inicia processo de envio dos formulários
    doUpload();
}

GDF.util.imageViewer = function(editMode) {
    var imageViewer = $("#imageViewerModal");

    var scrollView = $(".imageViewerModalWrapper").data("kendoMobileScrollView");

    //Fechar janela
    var close = function() {
        imageViewer.data("kendoMobileModalView").close();
    };

    //Exclusão
    var exclude = function () {
        var finish = function(removedItem, closeAfter) {
            //Se existe uma função de após exclusão, executa.
            if (typeof self.afterExcludeImage == "function") {
                self.afterExcludeImage(removedItem);
            }
            if (closeAfter) {
                close();
            }
        };

        var accept = function() {
            var page = scrollView.page;

            // Recupera o item excluido
            var removedItem = list[page];

            // Remove o item da array
            list.splice(page, 1);

            // Se não existem mais imagens, apenas encerra o modal e continua a execução
            if (list.length === 0) {
                finish(removedItem, true);
            } else {
                var htmlList = getHtmlOutput();

                scrollView.content(htmlList);

                // Se excluir uma imagem do inicio, mantem na primeira posição
                if (page === 0) {
                    scrollView.scrollTo(0);
                }
                // Se excluir do meio, volta uma imagem
                else if (page === list.length - 1) {
                    scrollView.scrollTo(page - 1);
                }
                // Se excluir a ultima, tambem volta uma pagina
                else {
                    scrollView.scrollTo(list.length - 1);
                }

                //scrollView.scrollTo(page === 0 ? 0 : list.length  - 1);  
                finish(removedItem, false);
            }
        };

        GDF.messageBox({
            text: GDF.strings.excludePicture,
            ok: false,
            yes: accept,
            no: true
        });
    };

    //Abrir visualizador em tela cheia
    var openImage = function(image) {
        GDF.controllers.imageviewer.open(image.dataset.srcfullsize);
    };

    // Config titulo
    $("#imageViewerModalTitle").html(GDF.strings.pictures);

    // Config cancel
    $("#imageViewerModalClose").data("kendoMobileButton").unbind("click").bind("click", close);

    // Config exclusão
    $("#imageViewerModalDelete").data("kendoMobileButton").unbind("click").bind("click", exclude);

    $("#imageViewerModalShow").unbind("click").bind("click", function () {
        openImage($(".image-content")[scrollView.page]);
    });

    //Recebe a lista e retorna o HTML
    var getHtmlOutput = function() {
        var base = "<div data-role=\"page\" class=\"image-page\" data-idx=\"{2}\"><div class=\"image-container\"><img class=\"image-content\" data-srcfullsize=\"{0}\" src=\"{1}\"></img></div></div>";
        var listHtml = "";

        $.each(list, function(idx, item) {
            var itemHtml = base.format(item.src, item.thumbnail, idx);
            listHtml += itemHtml;
        });

        return listHtml;
    };

    return {
        init: function(controller, synced) {
            list = [];
            self = controller;

            // Ações de configuração para registro sincronizados
            if (synced) {
                $("#imageViewerModalDelete").css("display", "none");
            } else
            {
                $("#imageViewerModalDelete").css("display", "inline-block");
            }
        },
        open: function () {
            scrollView.scrollTo(0);
            imageViewer.data("kendoMobileModalView").open();
        },
        appendPage: function (content) {
            list.push(content);
            var htmlList = getHtmlOutput();
            scrollView.content(htmlList);
        },
        appendMany: function(contentList) {
            list = contentList;
            var htmlList = getHtmlOutput();
            scrollView.content(htmlList);
        }
    };
};

GDF.util.toast = function(message, duration, callback) {
    if (typeof duration === "undefined") {
        duration = "long"; 
    } else {
        duration = (duration === GDF.enums.Toast.Long ? "long" : "short");
    }

    if (typeof window === "undefined" && typeof window.plugins === "undefined" && typeof window.plugins.toast === "undefined" && !callback) {
        window.plugins.toast.show(message, duration ? "short" : "long", "bottom");
    } else {
        GDF.messageBox({
            text: message,
            timeout: GDF.settings.defaultMessageTime,
            timeoutCallback: callback
        });
    }
};

GDF.util.configDateField = function (controller, elem) {
    if (elem.length == 0) {
        return;
    }

    var elems;
    if (!$.isArray(elem)) {
        elems = [elem];
    } else {
        elems = [].concat(elem);
    }

    $.each(elems, function (idx, elem) {
        var id = elem[0].id;

        dateconfig = {
            // Formato default da data
            dateFormat: "mm/dd/yy",
            // M?todo executado ao selecionar a data
            onSelect: function () {
                controller[id] = new Date(this.value);
                controller[id].setHours(0, 0, 0, 0);
                $(this).val(GDF.util.formatDate(controller[id], GDF.util.getDateFormat()));
            }
        };

        var minDate = GDF.util.configDateTimeValue(elem.data("minValue"), GDF.enums.DateTimeType.Date);
        var maxDate = GDF.util.configDateTimeValue(elem.data("maxValue"), GDF.enums.DateTimeType.Date);

        if (typeof minDate !== null) {
            dateconfig["minDate"] = minDate;
        }

        if (typeof maxDate !== null) {
            dateconfig["maxDate"] = maxDate;
        }

        $(elem).mobiscroll().date(dateconfig);
        
        controller[id] = new Date();
        controller[id].setHours(0, 0, 0, 0);

        $(elem).val(GDF.util.formatDate(controller[id], GDF.util.getDateFormat()));
    });
}

GDF.util.configTimeField = function (controller, elem) {
    if (elem.length == 0) {
        return;
    }

    var elems;
    if (!$.isArray(elem)) {
        elems = [elem];
    } else {
        elems = [].concat(elem);
    }

    $.each(elems, function (idx, elem) {
        var id = elem[0].id;

        timeconfig = {
            // Formato default Da hora
            timeFormat: 'HH:ii',
            timeWheels: 'HHii',
            headerText: false,
            // Metodo executado ao selecionar a hora
            onSelect: function () {
                controller[id] = new Date("01/01/1970 " + this.value);
                $(this).val(GDF.util.formatDate(controller[id], GDF.util.getTimeFormatWithoutSeconds(false)));
            }
        }

        var minDate = GDF.util.configDateTimeValue(elem.data("minValue"), GDF.enums.DateTimeType.Time);
        var maxDate = GDF.util.configDateTimeValue(elem.data("maxValue"), GDF.enums.DateTimeType.Time);

        if (typeof minDate !== null) {
            timeconfig["minDate"] = minDate;
        }

        if (typeof maxDate !== null) {
            timeconfig["maxDate"] = maxDate;
        }

        $(elem).mobiscroll().time(timeconfig);

        controller[id] = new Date();

        $(elem).val(GDF.util.formatDate(controller[id], GDF.util.getTimeFormatWithoutSeconds(false)));
    });
}

GDF.util.configDateTimeField = function (controller, elem) {
    if (elem.length == 0) {
        return;
    }

    var elems;
    if (!$.isArray(elem)) {
        elems = [elem];
    } else {
        elems = [].concat(elem);
    }

    $.each(elems, function (idx, elem) {
        var id = elem[0].id;

        datetimeconfig = {
            // Formato default da data/hora
            dateFormat: "mm/dd/yy",
            timeFormat: 'HH:ii',
            timeWheels: 'HHii',
            headerText: false,
            // Metodo executado ao selecionar a data/hora
            onSelect: function () {
                controller[id] = new Date(this.value);
                $(this).val(GDF.util.formatDate(controller[id], GDF.util.getDateTimeFormat()));
            }
        }

        var minDate = GDF.util.configDateTimeValue(elem.data("minValue"), GDF.enums.DateTimeType.DateTime);
        var maxDate = GDF.util.configDateTimeValue(elem.data("maxValue"), GDF.enums.DateTimeType.DateTime);

        if (typeof minDate !== null) {
            datetimeconfig["minDate"] = minDate;
        }

        if (typeof maxDate !== null) {
            datetimeconfig["maxDate"] = maxDate;
        }

        $(elem).mobiscroll().datetime(datetimeconfig);

        controller[id] = new Date();

        $(elem).val(GDF.util.formatDate(controller[id], GDF.util.getDateTimeFormat()));
    });
};

GDF.util.configDateTimeValue = function (value, type, culture) {
    if (!value || typeof value === "undefined" || value === '') {
        return null;
    }

    if (value == "now") {
        return new Date();
    }

    // Formatação de data quando estiver no padrão br
    if (type != GDF.enums.DateTimeType.Time && culture == "pt-BR") {
        var dt = value.split(" ");
        var aux = dt[0].split("/");
        value = aux[1] + "/" + aux[0] + "/" + aux[2];

        if (dt.length > 1) {
            value += " " + dt[1];
        }
    }

    switch (type) {
        case GDF.enums.DateTimeType.Date:
            return new Date(new Date(value).setHours(0, 0, 0, 0));
            break;
        case GDF.enums.DateTimeType.DateTime:
            return new Date(value);
            break;
        case GDF.enums.DateTimeType.Time:
            var time = value.split(":");
            return new Date(new Date().setHours(time[0], time[1], 0, 0));
            break;
        default:
            return null;
    }
};

GDF.util.hasElement = function (array, elem) {
    return $.isArray(array) && array.indexOf(elem) !== -1;
};
   
GDF.util.getLocalFields = function () {
    var fields = [];

    fields.push({ Id: 1, ComponentType: 6, Mandatory: "true", Label: "Data/Hora Atual", MaxCharacters: 0, DecimalPlaces: 0, MinValue: "now", MaxValue: "now", FieldOrder: 1, DbField: "CreateDate" });
    fields.push({ Id: 2, ComponentType: 1, Mandatory: "true", Label: "CEP", MaxCharacters: 8, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 2, DbField: "Cep" });
    fields.push({ Id: 3, ComponentType: 1, Mandatory: "true", Label: "Estado", MaxCharacters: 30, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 3, DbField: "State" });
    fields.push({ Id: 4, ComponentType: 1, Mandatory: "true", Label: "Cidade", MaxCharacters: 30, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 4, DbField: "City" });
    fields.push({ Id: 5, ComponentType: 1, Mandatory: "true", Label: "Endere&ccedil;o", MaxCharacters: 150, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 5, DbField: "Address1" });
    fields.push({ Id: 6, ComponentType: 1, Mandatory: "false", Label: "Complemento", MaxCharacters: 100, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 6, DbField: "Address2" });

    return fields;
};

GDF.util.getDetailfields = function () {
    var fields = [];

    fields.push({ Id: 7, ComponentType: 1, Mandatory: "true", Label: "Titulo", MaxCharacters: 150, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 7, DbField: "Title" });
    fields.push({ Id: 8, ComponentType: 7, Mandatory: "true", Label: "Tipo", MaxCharacters: 0, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 8, DbField: "OccurenceTypeId" });
    fields.push({ Id: 9, ComponentType: 7, Mandatory: "true", Label: "Subtipo", MaxCharacters: 0, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 9, DbField: "OccurenceSubtypeId" });
    fields.push({ Id: 10, ComponentType: 7, Mandatory: "true", Label: "Criticidade", MaxCharacters: 0, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 10, DbField: "Criticality" });
    fields.push({ Id: 11, ComponentType: 2, Mandatory: "true", Label: "Descri&ccedil;&atilde;o", MinCharacters: 150, MaxCharacters: 4000, DecimalPlaces: 0, MinValue: "", MaxValue: "", FieldOrder: 11, DbField: "Description" });

    return fields;
};

GDF.util.goToOnMap = function (target) {
    if (!GDF.settings.map) {
        return;
    }

    var pos = {
        'tilt': 60,
        'zoom': 18,
        'bearing': 140
    }

    pos["target"] = target;

    GDF.settings.map.animateCamera(pos);
};

GDF.util.getStatus = function (status) {
    switch (Number(status)) {
        case 1:
            return GDF.strings.Open;
            break;
        case 2:
            return GDF.strings.Analysing;
            break;
        case 3:
            return GDF.strings.ToAttend;
            break;
        case 4:
            return GDF.strings.InAttendance;
            break
        case 5:
            return GDF.strings.Done;
            break;;
        default:
    }
};

GDF.util.addMarkers = function (item) {
    if (item) {
        GDF.settings.map.addMarker({
            'position': { "lat": Number(item.Latitude), "lng": Number(item.Longitude) },
            'title': item.Title,
            'snippet': GDF.util.getStatus(item.Status)
        }, function (marker) {
            marker.showInfoWindow();
        });

        return;
    }

    GDF.sql.query("SELECT Latitude, Longitude, Title, Status FROM Occurrence", [], function (data) {
        if (data.length === 0) {
            return;
        }

        $.each(data, function (idx, item) {
            GDF.settings.map.addMarker({
                'position': { "lat": Number(item.Latitude), "lng": Number(item.Longitude) },
                'title': item.Title,
                'snippet': GDF.util.getStatus(item.Status)
            }, function (marker) {
                marker.showInfoWindow();
            });
        });
    });
}