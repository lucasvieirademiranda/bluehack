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

            // Carrega dados do endereço recuperado no mapa
            var local = GDF.settings.occurrenceLocal;
            if (local["adminArea"]) {
                $("#cform2").val(local.postalCode);
                $("#cform3").val(local.adminArea);
                $("#cform4").val(local.locality);
                $("#cform5").val(local.thoroughfare + ", " + local.subThoroughfare + " - " + local.subLocality);
            };         
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
                        var query = "";
                        var param = [];
                        var initLookup = null;
                        switch (Number(elem.Id)) {
                            case 8:
                                query = "SELECT Id AS CodCform8, Name AS DscCform8 FROM OccurenceType";
                                param = [];
                                break;
                            case 9:
                                query = "SELECT Id AS CodCform9, Name AS DscCform9 FROM OccurrenceSubtype WHERE OccurrenceTypeId = ?";
                                initLookup = function () {
                                    var self = GDF.controllers.newocurrence;
                                    if (!self.cform8) {
                                        GDF.messageBox(GDF.strings.selectBefore.format("Tipo"));
                                        return false;
                                    }
                                    self.paramsCform9 = [self.cform8.CodCform8]
                                    return true;
                                }
                                break;
                            case 10:
                                query = "SELECT Id AS CodCform10, Level AS DscCform10 FROM Criticaly";
                                param = [];
                                break;
                            default:
                        }

                        var lookup = GDF.templates.lookupField(self, elem);

                        html = lookup.html;

                        self[lookup.queryName] = query;
                        self[lookup.paramsName] = param;
                        self[lookup.callbackName] = lookup.callback;

                        if (initLookup) {
                            self[lookup.initLookUpName] = initLookup;
                        }

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

        return valid && function () {
            // Valida se foi informado uma descrição de ao menos 60 char
            if (self["cform11"].length < 60) {
                GDF.util.toast(GDF.strings.minLength.format("60","Descri&ccedil;&atilde;o"));
                return false;
            } else {
                return true;
            }
        }();
    },

    save: function (callbackSuccess, callbackFailure) {
        var self = GDF.controllers.newocurrence;

        var success = function () {
            self.shouldRefresh = true;

            if (GDF.controllers.customforms) {
                GDF.controllers.customforms.shouldRefresh = true;
            }

            callbackSuccess();

            // TODO - ENVIAR OCORRÊNCIA ANTES DE VOLTAR PARA A TELA ANTERIOR
            // Voltar pela tela anterior
            GDF.kendoMobileApp.navigate("#:back");
        };

        var failure = function (msg) {
            // Quando ocorrer erro antes de finalizar o processo de gravação, remove possíveis inserções
            var deleteQueries = [];
            deleteQueries.push("DELETE FROM OccurrenceImage WHERE UuidOccurrence = ?");
            deleteQueries.push("DELETE FROM Occurrence WHERE Uuid = ?");

            var paramsDeleteQueries = [self.Uuid, self.Uuid];

            GDF.sql.queries(deleteQueries, paramsDeleteQueries, function () { }, function () { });

            // Exibe msg de erro
            msg = msg || GDF.strings.occurrenceInsertError;
            callbackFailure(GDF.messageBox(msg));
        };

        var saveDetails = function () {
            var images = self.Images
            if (!$.isArray(images) || images.length == 0) {
                success();
                return;
            }

            var columns = ["UuidOccurrence", "Src", "Thumbnail"];
            var values = [];

            $.each(images, function (idx, item) {
                values.push([self.Uuid, item.src, item.thumbnail]);
            });

            GDF.sql.multipleInsert("OccurrenceImage", columns, values, false, success, function () {
                failure(GDF.strings.occurrenceDetailError);
            });
        };

        var saveHeader = function () {
            var insertQuery = "";
            insertQuery += " INSERT INTO Occurrence ";
            insertQuery += "        (Uuid, OccurenceTypeId, OccurenceSubtypeId, OwnerUserId, Title, ";
            insertQuery += "         Description, CreateDate, Latitude, Longitude, Cep, ";
            insertQuery += "         State, City, Address1, Address2, Criticality, ";
            insertQuery += "         Status, InternalStatus) ";
            insertQuery += " VALUES (?,?,?,?,?, ";
            insertQuery += "         ?,?,?,?,?, ";
            insertQuery += "         ?,?,?,?,?, ";
            insertQuery += "         ?,?) ";

            var insertParams = [];
            insertParams.push(self.Uuid);
            insertParams.push(self.cform8.CodCform8 || 1);
            insertParams.push(self.cform9.CodCform9 || 1);
            insertParams.push(GDF.settings.userdata.Id);
            insertParams.push(self.cform7);
            insertParams.push(self.cform11);
            insertParams.push(self.cform1);
            insertParams.push(GDF.settings.occurrenceLocal.lat);
            insertParams.push(GDF.settings.occurrenceLocal.lng);
            insertParams.push(self.cform2);
            insertParams.push(self.cform3);
            insertParams.push(self.cform4);
            insertParams.push(self.cform5);
            insertParams.push(self.cform6);
            insertParams.push(self.cform10.CodCform10 || 1);
            insertParams.push(GDF.enums.OccurrenceStatus.Open);
            insertParams.push(GDF.enums.RecordStatus.Open);

            GDF.sql.query(insertQuery, insertParams, saveDetails, failure);
        };

        saveHeader();
    },

    onClickHome: function (e) {
        GDF.kendoMobileApp.navigate("#:back");
    }
}