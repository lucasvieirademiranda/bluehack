GDFtemp = {
    checkVarsBeforeClose: true,
    shouldRefresh: true,
    checkChanges: false,

    Uuid: undefined,
    Sync: undefined, // Indica se o apontamento foi sincronizado (utilizado na edição)

    maxsphoto: undefined,

    Images: [],
    removedImages: [],

    viewInit: function () {
        var self = GDF.controllers.newocurrence;

        // Configura evento ao navegar pela scrollview
        self.scrollView = $("#scroll-newocurrence").data("kendoMobileScrollView");
        self.scrollView.bind("change", self.configPage);

        // Configura eventos
        self.configEvents();
    },

    viewShow: function (e) {
        var self = GDF.controllers.newocurrence;

        if (!self.shouldRefresh) {
            return;
        }

        // Recupera parâmetros
        self.Uuid = e.view.params.uuid;

        // Remove paginas e campos dinâmicos
        $("#page-newoccurrence-local-list").empty();
        $("#page-newoccurrence-detail-list").empty();

        // Configura campos do form
        self.configForm(function () {
            // Configura tela para utilização inicial
            self.configView(e);
        }, function () {
            GDF.messageBox({
                text: GDF.strings.customFormNotFound,
                ok: function () {
                    GDF.kendoMobileApp.navigate("#:back");
                },
                yes: false,
                no: false
            });
        });
    },

    configEvents: function () {
        var self = GDF.controllers.newocurrence;

        self.view.header.find(".right-button").on("click", function (e) {
            self.scrollView.scrollTo(self.scrollView.page + 1);
            self.scroller.scrollTo(0, 0);
        });

        self.view.header.find(".left-button").on("click", function (e) {
            self.scrollView.scrollTo(self.scrollView.page - 1);
            self.scroller.scrollTo(0, 0);
        });
    },

    configView: function (e) {
        var self = GDF.controllers.newocurrence;
        debugger;
        // Pega todos os campos com data-model
        var models = self.find("[data-model]");

        // Atualiza array de campos e valores
        self.fields = [];
        self.vars = [];
        $.each(models, function (idx, item) {
            // Add fields
            self.fields.push($(item).attr("id"));

            // Add params
            var modelName = $(item).data("model");

            self.vars.push(modelName);

            if ($(item).hasClass("lookup")) {
                self.vars.push(modelName.replace("Cod", "Dsc"));
            }
        });

        // Reseta campos
        GDF.util.clearVarsAndInputs(self.vars, self.fields);

        // Configura campos numéricos
        var numericFields = self.find("input[class=number], .numberPicker");
        $.each(numericFields, function (index, field) {
            GDF.numberPicker.configField($(field));
        });

        // Configura campos texto multilinha
        var multilineFields = self.find("textarea");
        $.each(multilineFields, function (index, field) {
            GDF.util.defineObsField(field);
        });

        // Configura campos datetime
        var dateFields = self.find("input[class=date]");
        GDF.util.configDateField(self, dateFields);

        // Configura campos date
        var timeFields = self.find("input[class=time]");
        GDF.util.configTimeField(self, timeFields);

        // Configura campos time
        var datetimeFields = self.find("input[class=datetime]");
        GDF.util.configDateTimeField(self, datetimeFields);

        // Configura campos lookup
        var listLookUp = self.find("input[class=lookup]");
        GDF.configLookUp(e, listLookUp);

        // Atualiza scroll e posiciona na primeira página
        self.scrollView.refresh();
        self.scrollView.scrollTo(0);

        // Desativa o swipe
        self.scrollView.pane.userEvents.bind("start", function () { this.cancel(); });

        // Configura valores padrões
        $("#CustomFormPictures").val(GDF.strings.noPictureToShow);
        self.Images = [];
        self.removedImages = [];

        // Se este item já foi sincronizado, remove botão salvar e desabilita todos os campos
        if (self.Sync == GDF.enums.RecordStatus.Syncronized) {
            // Desabilita todos os inputs
            self.disableAllInputs();

            // Mantem o campo de visualização de imagens habilitado
            $("#CustomFormPictures").enable();
        } else {
            // Habilita todos os inputs
            self.enableAllInputs();
        }

        // Configura quando edição
        if (self.Uuid) {
            //self.loadData();
        } else {
            self.Uuid = GDF.getUuid();
        }
    },

    configPage: function (e) {
        var self = GDF.controllers.newocurrence;

        // Recupera número de páginas
        var pages = $("#scroll-newocurrence [data-role='page']:visible").size();
        var current = typeof e === "undefined" ? 0 : e.page;

        // Quando houver somente uma página
        if (pages == 1) {
            self.view.header.find(".home-button").show();
            self.view.header.find(".right-button").hide();
            self.view.header.find(".left-button").hide();
            if (self.Sync == GDF.enums.RecordStatus.Syncronized) {
                self.view.header.find(".save-button").hide();
            } else {
                self.view.header.find(".save-button").show();
            }
        } else if (current == 0) {
            self.view.header.find(".home-button").show();
            self.view.header.find(".right-button").show();
            self.view.header.find(".left-button").hide();
            self.view.header.find(".save-button").hide();
        } else if (current === pages - 1) {
            self.view.header.find(".home-button").hide();
            self.view.header.find(".right-button").hide();
            self.view.header.find(".left-button").show();
            if (self.Sync == GDF.enums.RecordStatus.Syncronized) {
                self.view.header.find(".save-button").hide();
            } else {
                self.view.header.find(".save-button").show();
            }
        } else {
            self.view.header.find(".home-button").hide();
            self.view.header.find(".right-button").show();
            self.view.header.find(".left-button").show();
            self.view.header.find(".save-button").hide();
        }
    },

    configPhoto: function (page) {
        var self = GDF.controllers.newocurrence;

        // Injeta componente de photo no final da página
        $(page).append(GDF.templates.photo());

        // Configura eventos de inclusão de imagens
        $("#CustomFormPictures").on("click", self.openImageViewer);
        $("#CustomFormAddPictureButton").on("click", self.addPicture);
    },

    configForm: function (success, fail) {
        var self = GDF.controllers.newocurrence;

        var configField = function (elements, page) {
            $.each(elements, function (idx, elem) {
                var html;
                switch (Number(elem.ComponentType)) {
                    case GDF.enums.ComponentType.Numeric:
                        html = GDF.templates.numberField(elem);
                        break;
                    case GDF.enums.ComponentType.SimpleText:
                        html = GDF.templates.textField(elem);
                        break;
                    case GDF.enums.ComponentType.MultilineText:
                        html = GDF.templates.multilineTextField(elem)
                        break;
                    case GDF.enums.ComponentType.Date:
                        html = GDF.templates.dateField(elem);
                        break;
                    case GDF.enums.ComponentType.Time:
                        html = GDF.templates.timeField(elem);
                        break;
                    case GDF.enums.ComponentType.DateTime:
                        html = GDF.templates.dateTimeField(elem);
                        break;
                    case GDF.enums.ComponentType.SingleChoice:
                    case GDF.enums.ComponentType.SingleSelect:
                        var lookup = GDF.templates.lookupField(self, elem);

                        html = lookup.html;

                        self[lookup.queryName] = lookup.query;
                        self[lookup.paramsName] = lookup.params;
                        self[lookup.callbackName] = lookup.callback;

                        break;
                    case GDF.enums.ComponentType.MultipleChoice:
                        var lookup = GDF.templates.lookupField(self, elem);

                        html = lookup.html;

                        self[lookup.queryName] = lookup.query;
                        self[lookup.paramsName] = lookup.params;
                        self[lookup.callbackName] = lookup.callback;

                        break;
                    default:
                        html = null;
                }

                // Inclui campo na página
                if (html != null) {
                    $(page).append(html);
                }
            });       
        };

        var configView = function (data) {
            // Configura título do formulario
            self.setViewTitle(GDF.strings.ocurrence);

            // Configura página de local
            var localPage = $("#page-newoccurrence-local-list");
            configField(GDF.util.getLocalFields(), localPage);          

            // Configura página de detalhes
            var detailPage = $("#page-newoccurrence-detail-list");
            configField(GDF.util.getDetailfields(), detailPage);

            // Configura página de foto
            // Configura quantidade máxima de fotos permitidas
            self.maxsphoto = GDF.settings.maxPicturePerOcurrence;

            self.configPhoto(detailPage);

            success();
        }

        configView();
    },

    loadData: function () {
        var self = GDF.controllers.newocurrence;

        var fail = function () {
            GDF.messageBox({
                text: GDF.strings.customFormDataNotFound,
                ok: function () {
                    GDF.kendoMobileApp.navigate("#:back");
                },
                yes: false,
                no: false
            });
        };

        var loadImages = function () {
            var queryImages = "SELECT * FROM CustomformPhotos WHERE FormUuid = ?";
            var paramImages = [self.Uuid];
            GDF.sql.query(queryImages, paramImages, function (data) {
                if (data.length > 0) {
                    self.Images = data.map(function (item) {
                        return {
                            id: item.Id,
                            src: item.Src,
                            thumbnail: item.Thumbnail
                        }
                    });
                    GDF.util.imageViewer().init(self, self.Sync == GDF.enums.RecordStatus.Syncronized);
                    GDF.util.imageViewer().appendMany(self.Images);
                    $("#CustomFormPictures").val(GDF.strings.pictureCount.format(data.length, self.maxsphoto));
                }
            });
        };

        var loadContent = function () {
            var query = "SELECT c.Content, f.HasPhoto, c.Uuid FROM Customforms c INNER JOIN Forms f ON c.FormId == f.Id WHERE c.Id = ?";
            var param = [self.Id];
            GDF.sql.query(query, param, function (data) {
                if (data.length == 0) {
                    fail()
                    return;
                };

                // Recupera uuid
                self.Uuid = data[0].Uuid;

                // Configura dados
                var content = eval(data[0].Content);

                $.each(content, function (idx, elem) {
                    // Tratamento dos campos de seleção (lookup)
                    if (elem.TYPE == GDF.enums.ComponentType.SingleChoice ||
                        elem.TYPE == GDF.enums.ComponentType.SingleSelect ||
                        elem.TYPE == GDF.enums.ComponentType.MultipleChoice) {
                        self[GDF.templates.getLookupMethod(elem.FIELD_ID)](elem.VALUE);
                    }
                    // Tratamento campo data
                    else if (elem.TYPE == GDF.enums.ComponentType.Date ||
                        elem.TYPE == GDF.enums.ComponentType.DateTime ||
                        elem.TYPE == GDF.enums.ComponentType.Time) {
                        var date = GDF.util.configDateTimeValue(elem.VALUE, elem.TYPE, kendo.culture().name);
                        $("#" + GDF.templates.getId(elem.FIELD_ID)).mobiscroll("setDate", date, true);
                        $("#" + GDF.templates.getId(elem.FIELD_ID)).val(elem.VALUE);
                    }
                    // Demais campos
                    else {
                        $("#" + GDF.templates.getId(elem.FIELD_ID)).val(elem.VALUE);
                    }
                });

                // Carrega imagens
                if (eval(data[0].HasPhoto)) {
                    loadImages();
                }
            }, fail);
        };

        loadContent();
    },

    addPicture: function (e) {
        var self = GDF.controllers.newocurrence;

        // Quando já foi sincronizado, não deve realizar nenhuma ação
        if (self.syncedEntry == GDF.enums.RecordStatus.Syncronized) {
            return;
        }

        if (self.Images.length === self.maxsphoto) {
            GDF.util.toast(GDF.strings.maxPicturesReached);
            return;
        }

        var success = function (imageData) {
            self.Images.push({
                id: -1,
                src: imageData.fullSize,
                thumbnail: imageData.thumbnail
            });
            GDF.util.imageViewer(self).init(self);
            GDF.util.imageViewer(self).appendMany(self.Images);
            $("#CustomFormPictures").val(GDF.strings.pictureCount.format(self.Images.length, self.maxsphoto));
        };

        GDF.media.takePictureBase64(success);
    },

    openImageViewer: function (e) {
        var self = GDF.controllers.newocurrence;

        if (self.Images.length > 0) {
            GDF.util.imageViewer().open();
        } else {
            GDF.util.toast(GDF.strings.noPictureToShow);
        }
    },

    afterExcludeImage: function (removedItem) {
        var self = GDF.controllers.newocurrence;

        // Caso edição, adiciona item removido na array de exclusão. Se não for edição, o item removido não será inserido
        if (removedItem.id > -1) {
            self.removedImages.push(removedItem);
        }

        var stringPictures = self.Images.length > 0 ? GDF.strings.pictureCount.format(self.Images.length, self.maxsphoto) : GDF.strings.noPictureToShow;
        $("#CustomFormPictures").val(stringPictures);
    },

    validate: function (callback) {
        var self = GDF.controllers.newocurrence;

        self.requiredFields = [];
        $.each(self.fields, function (idx, item) {
            var elem = $("#" + item);
            var isRequired = elem.data("required");
            var model = elem.data("model");

            // Recupera valor dos campos
            if (elem.hasClass("checkbox")) {
                self[model] = elem.prop("checked");
            } else if (elem.attr("type") === "text" && !elem.hasClass("lookup") && !elem.hasClass("number") && elem.is(":visible")) {
                self[model] = elem.val();
            } else if (elem.is("textarea") && elem.is(":visible")) {
                self[model] = elem.val();
            } else if (elem.attr("type") === "text" && elem.hasClass("number")) {
                if (elem.val() !== "") {
                    self[model] = Number(elem.val());
                } else {
                    self[model] = "";
                }
            }

            if (isRequired) {
                self.requiredFields.push(item);
            }
        });

        var valid = GDF.util.validateRequiredField();
        return valid;
    },

    save: function (callbackSuccess, callbackFailure) {
        var self = GDF.controllers.newocurrence;

        var success = function () {
            self.shouldRefresh = true;

            if (GDF.controllers.customforms) {
                GDF.controllers.customforms.shouldRefresh = true;
            }

            callbackSuccess();

            // Voltar pela tela anterior
            GDF.kendoMobileApp.navigate("#:back");
        };

        var failure = function (msg) {
            // Quando ocorrer erro antes de finalizar o processo de gravação, remove possíveis inserções
            var deleteQueries = [];
            deleteQueries.push("DELETE FROM CustomformPhotos WHERE FormUuid = ?");
            deleteQueries.push("DELETE FROM CustomformData WHERE FormUuid = ?");
            deleteQueries.push("DELETE FROM Customforms WHERE Uuid = ?");

            var paramsDeleteQueries = [self.Uuid, self.Uuid, self.Uuid];

            GDF.sql.queries(deleteQueries, paramsDeleteQueries, function () { }, function () { });

            // Exibe msg de erro
            msg = msg || GDF.strings.customFormInsertError;
            callbackFailure(GDF.messageBox(msg));
        };

        var updateDetail = function () {
            var newImages = self.Images.filter(function (item) {
                return item.id == -1;
            });

            var executeInsert = function () {
                insertDetail(newImages);
            };

            var executeDelete = function () {
                var successDelete = function () {
                    if (newImages.length > 0) {
                        executeInsert();
                    } else {
                        finishSaving();
                    }
                };

                // Pega array de ids
                var removedIds = self.removedImages.map(function (item) {
                    return item.id;
                });

                var deleteQuery = "DELETE FROM CustomformPhotos WHERE Id IN (" + removedIds.toString() + ") AND FormUuid = ?";
                var deleteParams = [self.Uuid];

                GDF.sql.query(deleteQuery, deleteParams, successDelete, function () {
                    failure(GDF.strings.customFormInsertDetailError);
                });
            };

            // Se removeu imagens
            if (self.removedImages.length > 0) {
                executeDelete();
            } else {
                if (newImages.length > 0) {
                    executeInsert();
                } else {
                    success();
                }
            }
        };

        var insertDetail = function (images) {
            if (!$.isArray(images) || images.length == 0) {
                success();
                return;
            }

            var columns = ["FormUuid", "Src", "Thumbnail"];
            var values = [];

            $.each(images, function (idx, item) {
                values.push([self.Uuid, item.src, item.thumbnail]);
            });

            GDF.sql.multipleInsert("CustomformPhotos", columns, values, false, success, function () {
                failure(GDF.strings.customFormInsertDetailError);
            });
        };

        var saveDetails = function () {
            if ($.isNumeric(self.Id)) {
                updateDetail();
            } else {
                insertDetail(self.Images);
            }
        };

        var saveData = function () {
            var insertData = function () {
                var table = "CustomformData";
                var columns = ["FormUuid", "FieldId", "ListId", "ComponentType", "Value"];
                var values = [];

                $.each(self.fields, function (idx, item) {
                    var elem = $("#" + item);
                    var id = item.replace("cform", "");
                    var model = elem.data("model");
                    var type = Number(elem.data("type"));

                    if (type === GDF.enums.ComponentType.SingleChoice ||
                        type === GDF.enums.ComponentType.SingleSelect ||
                        type === GDF.enums.ComponentType.MultipleChoice) {
                        // Insere um registro para cada item da lista selecionado
                        if ($.isArray(self[model])) {
                            $.each(self[model], function (i, s) {
                                values.push([self.Uuid, id, s["ListId"], type, s["CodCform" + id].toString()]);
                            });
                        } else {
                            var s = self[model];
                            values.push([self.Uuid, id, s["ListId"], type, s["CodCform" + id].toString()]);
                        }
                    } else {
                        values.push([self.Uuid, id, null, type, self[model]]);
                    }
                });

                GDF.sql.multipleInsert(table, columns, values, false, saveDetails, failure);
            };

            var queryDeleteOldData = "DELETE FROM CustomformData WHERE FormUuid = ?";
            var paramDeleteOldData = [self.Uuid];
            GDF.sql.query(queryDeleteOldData, paramDeleteOldData, insertData, failure);
        };

        var updateHeader = function () {
            var updateQuery = "";
            updateQuery += " UPDATE Customforms ";
            updateQuery += "    SET Content = ? ";
            updateQuery += "  WHERE Id = ? ";

            var updateParams = [JSON.stringify(content), self.Id];

            GDF.sql.query(updateQuery, updateParams, saveData, failure);
        };

        var saveHeader = function () {
            var insertQuery = "";
            insertQuery += " INSERT INTO Customforms ";
            insertQuery += "        (Uuid, Date, UserId, FormId, IsGps,";
            insertQuery += "         Latitude, Longitude, Content, Source, Status) ";
            insertQuery += " VALUES (?,?,?,?,?, ";
            insertQuery += "         ?,?,?,?,?) ";

            var insertParams = [];
            insertParams.push(self.Uuid);
            insertParams.push(new Date().getTime());
            insertParams.push(GDF.settings.userId);
            insertParams.push(self.FormId);
            insertParams.push(1);
            insertParams.push(self.Latitude);
            insertParams.push(self.Longitude);
            insertParams.push(JSON.stringify(content));
            insertParams.push(2);
            insertParams.push(1);

            GDF.sql.query(insertQuery, insertParams, saveData, failure);
        };

        var doSave = function () {
            if ($.isNumeric(self.Id)) {
                updateHeader();
            } else {
                saveHeader();
            }
        };

        // Configura Content
        // FIELD_ID - Identificado do campo
        // VALUE - Valor informado para o campo
        var content = [];
        $.each(self.fields, function (idx, item) {
            var elem = $("#" + item);
            var id = item.replace("cform", "");
            var model = elem.data("model");
            var type = elem.data("type")
            content.push({ "FIELD_ID": id, "VALUE": self[model], "TYPE": type })
        });

        doSave();
    },

    onClickHome: function (e) {
        GDF.kendoMobileApp.navigate("#:back");
    }
}