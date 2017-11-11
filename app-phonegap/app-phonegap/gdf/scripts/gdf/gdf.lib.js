// Generated on 11/09/2017 17:54:53

Math.trunc = Math.trunc || function (x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
};

window.onerror = function(message, url, lineNumber, columnNumber, errorObj) {

    var errorMessage = "JavaScript Error";

    if (errorObj && errorObj.message) {
        errorMessage += ": " + errorObj.message;
    } else if (typeof message === "string") {
        errorMessage += ": " + message;
    } else if (message && message.message) {
        errorMessage += ": " + message.message;
    } else if (message && typeof message.toString === "function") {
        errorMessage += ": " + message.toString();
    }

    if (typeof lineNumber !== "undefined") {
        errorMessage += " on line " + lineNumber;
    }

    if (typeof columnNumber !== "undefined") {
        errorMessage += " column " + columnNumber;
    }

    if (typeof url !== "undefined") {
        errorMessage += " for " + url;
    }

    if (GDF && GDF.unblockApp) {
        GDF.unblockApp();
    }

    if (GDF && GDF.messageBox && GDF.kendoMobileApp) {
        GDF.messageBox(errorMessage);
    } else {
        alert(errorMessage);
    }

};

String.prototype.contains = function(str) {
    return this.indexOf(str) !== -1;
};

String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) === str;
};

String.prototype.endsWith = function(str) {
    return this.indexOf(str, this.length - str.length) !== -1;
};

String.prototype.removeWhiteSpaces = function() {
    return this.replace(/ /g, "");
};

String.prototype.removeSpecialsChars = function() {
    return this.replace(/[^\w\s]/gi, "");
};

String.prototype.toNumber = function () {
    return kendo.culture().numberFormat['.'] === ',' ? Number(this.replace(".", "").replace(",", ".")) : Number(this);
};

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/gm, "");
};

String.prototype.lpad = function (prefix, qty) {
    if (this.length >= qty)
        return this;

    var s = prefix + this;

    return s.lpad(prefix, qty);
};

String.prototype.rpad = function (posfix, qty) {
    if (this.length >= qty)
        return this;

    var s = this + posfix;

    return s.rpad(posfix, qty);
};

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObj = function(key) {
    var item = this.getItem(key);

    if (item === "") {
        return null;
    } else {
        try {
            return JSON.parse(item);
        } catch (ex) {
            return null;
        }
    }
};

Storage.prototype.setBool = function(key, obj) {
    return this.setItem(key, obj ? "true" : "false");
};

Storage.prototype.getBool = function(key) {
    return this.getItem(key) === "true";
};

// http://stackoverflow.com/q/1038746/1267304
String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i]);
    }

    return s;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.parseToDecimal = function() {
    var value = "";

    try {
        value = this.toString();
    } catch (e) {
        return this;
    }

    var currentCulture = kendo.culture();
    var parsedValue = kendo.parseFloat(value, currentCulture);

    return parsedValue.isNaN ? Number(value.replace(".", "").replace(",", ".")) : parsedValue;
};

Math.trunc = Math.trunc || function(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
};

function onDeviceReady() {
    $(document).ready(function() {
        $.ajaxSetup({ cache: false });

        customizeKendo();

        GDF._isDeviceReady = true;

        if (!isCordovaApp) {
            var e = document.createEvent("Events");

            e.initEvent("deviceready", true, false);

            document.dispatchEvent(e);
        }
    });
};

function customizeKendo() {
    var fixRenderOnAndroid = function() {
        if (typeof device === "undefined" || !device.platform) {
            return;
        }

        if (device.platform.toLowerCase().indexOf("android") === -1) {
            return;
        }

        var fixRender = function() {
            document.body.scrollTop = 1;
            document.body.scrollTop = 0;
        };

        setTimeout(fixRender, 10);
        setTimeout(fixRender, 500);
    };

    /*
    var originalKendoDataSourceReadMethod = kendo.data.DataSource.prototype.read;
    kendo.data.DataSource.prototype.read = function (e) {

        GDF.kendoMobileApp.showLoading();
        originalKendoDataSourceReadMethod.call(this, e);

    };
    */

    var originalKendoDataSourceErrorMethod = kendo.data.DataSource.prototype.error;

    kendo.data.DataSource.prototype.error = function (jqXHR, textStatus, errorThrown) {
        originalKendoDataSourceErrorMethod.call(this, jqXHR, textStatus, errorThrown);
        //GDF.kendoMobileApp.hideLoading();
        fixRenderOnAndroid();
    };

    kendo.data.DataSource.prototype.options.requestEnd = function() {
        //GDF.kendoMobileApp.hideLoading();
        fixRenderOnAndroid();
    };
};

// ----------------------------------------------------------------------------------
// Helpers functions
// ----------------------------------------------------------------------------------
function fileExists(filename, successFunction) {
    filename = filename.trim();

    var filePathOK = false;
    var async = successFunction ? true : false;

    jQuery.ajax({
        url: filename,
        type: "HEAD",
        async: async,
        timeout: 300,
        complete: function(jqXHR, textStatus) {
            filePathOK = (jqXHR.status === 200);
            if (filePathOK && async) {
                successFunction();
            }
        }
    });

    return filePathOK;
};

function closeModalView(e) {
    // find the closest modal view, relative to the button element.
    var modalView = e.sender.element.closest("[data-role=modalview]").data("kendoMobileModalView");
    if (modalView) {
        if (typeof GDF !== "undefined") {
            GDF.closeModal(modalView);
        } else {
            modalView.close();
        }
    }
};

function scrollListView(element, y, x) {
    if (typeof x === "undefined") {
        x = 0;
    }

    if (typeof y === "undefined") {
        y = 0;
    }

    $(element).each(function (i, el) {
        if ($(el).data("kendoMobileListView").scroller()) {
            $(el).data("kendoMobileListView").scroller().scrollTo(-x, -y);
        }
    });
};

function scrollListViewToTop(element) {
    scrollListView(element, 0, 0);
};

function scrollScroller(element, y, x) {
    if (typeof x === "undefined") {
        x = 0;
    }

    if (typeof y === "undefined") {
        y = 0;
    }

    $(element).each(function(i, el) {
        $(el).data("kendoMobileScroller").scrollTo(-x, -y);
    });
};

function scrollScrollerToTop(element) {
    scrollScroller(element, 0, 0);
};

function hideKeyboard() {
    $(":input:focus").blur();

    // Novo plugin do softkeyboard, todos os plugins foram alterados para serem acessados utilizando gatec e então o plugin
    // Alteração realizada para padronizar chamadas aos plugins, sendo que alguns plugins foram modificados afins de otimização dos mesmos.
    if (typeof gatec !== "undefined" && typeof gatec.softkeyboard !== "undefined" && typeof gatec.softkeyboard.hide === "function") {
        gatec.softkeyboard.hide();
    }
    // Para o Cordova 4, pode-se usar o ionic-plugin-keyboard
    else if (typeof cordova !== "undefined" && typeof cordova.plugins !== "undefined" && cordova.plugins.Keyboard !== "undefined" && typeof cordova.plugins.Keyboard.close === "function") {
        cordova.plugins.Keyboard.close();
    }
    // código mantido para compatibilidade com plugins anteriores
    else if (window.plugins && window.plugins.SoftKeyBoard && typeof window.plugins.SoftKeyBoard.hide === "function") {
        window.plugins.SoftKeyBoard.hide();
    }
};

function parseDate(v) {
    var d = new Date(v);

    if (isNaN(d)) {
        d = kendo.parseDate(v);
    }

    if (isNaN(d)) {
        throw 0;
    }

    return d;
};

function handleException(ex) {
    var stack = ex.stack.split("\n");
    var callerLine = $.trim(stack[1]);
    var lineInfo = callerLine.match(/\d+:\d+\)$/i)[0].replace(")", "").split(":");
    var urlInfo = callerLine.replace("at ", "").split(" (")[0];
    var lineNumber = lineInfo[0];

    window.onerror(ex.message, urlInfo, lineNumber);
};

$.fn.mask = function(regex) {
    this.on("keypress", function(e) {
        if (regex.test(String.fromCharCode(e.which))) {
            return false;
        }
    });

    return this;
};

$.fn.maskNumber = function() {
    return this.mask(new RegExp("[^\\d" + kendo.cultures.current.numberFormat["."] + "]"));
};

$.fn.maskInteger = function() {
    return this.mask(/[^\d]/);
};

$.fn.enable = function() {
    return this.prop("disabled", "");
};

$.fn.disable = function() {
    return this.prop("disabled", "disabled");
};

$.fn.enableLink = function() {
    return this.removeAttr("disabled");
};

$.fn.disableLink = function() {
    return this.attr("disabled", "disabled");
};

$.fn.blockElement = function() {
    $(this).each(function() {
        var thisEl = $(this);
        if (thisEl.children(".ga-block-mask").size() === 0) {
            thisEl.css("position", "relative").append("<div class=\"ga-block-mask\"></div>");
        }
    });

    return this;
};

$.fn.unblockElement = function() {
    $(this).each(function() {
        $(this).children(".ga-block-mask").remove();
    });

    return this;
};

$.fn.numVal = function(theValue, maxDecimalPlaces) {
    // getter ---------------------------------------------------------------
    if (typeof theValue === "undefined") {
        var thisEl = $(this).first();
        var thisVal = thisEl.val();
        if (isNaN(thisVal)) {
            thisVal = thisVal !== "" ? kendo.parseFloat(thisVal) : 0;
        }
        return thisVal;
    }

    if (isNaN(theValue)) {
        theValue = kendo.parseFloat(theValue);
    }

    if (isNaN(theValue)) {
        return this;
    }

    // setter ---------------------------------------------------------------
    $(this).each(function() {
        var thisField = $(this);

        if (!maxDecimalPlaces) {
            var formatData = thisField.data("format");
            if (typeof formatData !== "undefined" && /\d+,\d+/.test(formatData)) {
                var formatParts = formatData.split(",");
                maxDecimalPlaces = kendo.parseInt(formatParts[1]);
            } else {
                var maxDecimalsData = thisField.data("max-decimals");
                maxDecimalPlaces = typeof maxDecimalsData !== "undefined" ? kendo.parseInt(maxDecimalsData) : 0;
            }
        }

        var theValueString = GDF.util.formatNumber(theValue, maxDecimalPlaces);

        thisField.val(theValueString);

        if (thisField.val() === "" || thisField.val() === 0) {
            thisField.val(kendo.parseFloat(theValueString));
        }
    });

    return this;
};

/*
Options:
- dataSource
- template
- itemElement (default: div)
- itemClass
- autoBind (default: false)
- touchstart
- tap
- hold
- swipe
- doubletap
*/
$.fn.kendoMobileCustomList = function(options) {
    if (typeof options !== "object" || !options.dataSource || typeof options.template !== "string" || this.size() !== 1) {
        return this;
    }

    if (!options.itemElement) {
        options.itemElement = "div";
    }

    var template = kendo.template(options.template);
    var scroller;

    if (this.is("[data-role=view]")) {
        scroller = this.data("kendoMobileView").scroller;
    } else {
        this.addClass("ga-custom-list").css({
            height: "100%",
            position: "absolute"
        });
        scroller = this.kendoMobileScroller({
            pullToRefresh: true,
            pullTemplate: GDF.strings.pullToRefresh,
            refreshTemplate: GDF.strings.refreshing,
            releaseTemplate: GDF.strings.releaseToRefresh,
            pull: function() {
                options.dataSource.read();
            }
        }).data("kendoMobileScroller");
    }

    var scrollerContent = $("<div class=\"ga-custom-list-content\" />");
    var scrollerContentClearer = $("<div class=\"ga-custom-list-clearer\" style=\"clear:both;\" />");
    scroller.scrollElement.append(scrollerContent);
    options.dataSource.bind("change", function() {
        scroller.scrollTop = 0;
        scrollerContent.empty();
        $.each(this.data(), function(i, dataItem) {
            var newElement = $("<" + options.itemElement + " />");
            newElement.css("-webkit-transform", "translate3d(0, 0, 0)");
            newElement.attr("data-uid", dataItem.uid);

            if (options.touchstart || options.tap || options.hold || options.swipe || options.doubletap) {
                newElement.attr("data-role", "touch");
            }

            if (options.touchstart) {
                newElement.attr("data-touchstart", options.touchstart);
            }

            if (options.tap) {
                newElement.attr("data-tap", options.tap);
            }

            if (options.hold) {
                newElement.attr("data-hold", options.hold);
            }

            if (options.swipe) {
                newElement.attr("data-swipe", options.swipe);
            }

            if (options.doubletap) {
                newElement.attr("data-doubletap", options.doubletap);
            }

            if (typeof options.itemClass === "string") {
                newElement.addClass(options.itemClass);
            }

            newElement.html(template(dataItem));
            scrollerContent.append(newElement);
        });

        kendo.init(scrollerContent);

        if (scrollerContent.children().size() > 0) {
            scrollerContent.append(scrollerContentClearer);
        }
    });

    options.dataSource.bind("requestEnd", function() {
        scroller.pullHandled();
    });

    if (options.autoBind) {
        options.dataSource.read();
    }

    return this;
};

(function() {
    var tapTouchStart = function(event) {
        event.preventDefault();

        var thisEl = $(this);

        thisEl.data("touchStarted", true);
        thisEl.data("touchStartX", event.originalEvent.touches[0].pageX);
        thisEl.data("touchStartY", event.originalEvent.touches[0].pageY);
        thisEl.data("touchLastX", event.originalEvent.touches[0].pageX);
        thisEl.data("touchLastY", event.originalEvent.touches[0].pageY);

        return false;
    };

    var tapTouchMove = function(event) {
        event.preventDefault();

        var thisEl = $(this);

        thisEl.data("touchLastX", event.originalEvent.touches[0].pageX);
        thisEl.data("touchLastY", event.originalEvent.touches[0].pageY);

        return false;
    };

    var tapTouchEnd = function(event) {
        event.preventDefault();

        var thisEl = $(this);

        if (!thisEl.data("touchStarted")) {
            return false;
        }

        var xDifference = Math.abs(thisEl.data("touchLastX") - thisEl.data("touchStartX"));
        var yDifference = Math.abs(thisEl.data("touchLastY") - thisEl.data("touchStartY"));
        var touchLimit = 20;

        if (xDifference > touchLimit || yDifference > touchLimit) {
            return false;
        }

        var theFunc = thisEl.data("tapFunc");

        if (typeof theFunc === "function") {
            theFunc.call(thisEl, thisEl);
        }

        thisEl.data("touchStarted", false);

        return false;
    };

    var tapTouchCancel = function(event) {
        event.preventDefault();

        var thisEl = $(this);

        thisEl.data("touchStarted", false);

        return false;
    };

    // The function passed will received the tapped element as the first argument
    $.fn.onTap = function(func) {
        $(this).data("tapFunc", func).each(function() {
            $(this)
                .on("touchstart", tapTouchStart)
                .on("touchmove", tapTouchMove)
                .on("touchend", tapTouchEnd)
                .on("touchcancel", tapTouchCancel);
        });

        return this;
    };

    $.fn.offTap = function() {
        $(this).data("tapFunc", null).each(function() {
            $(this)
                .off("touchstart", tapTouchStart)
                .off("touchmove", tapTouchMove)
                .off("touchend", tapTouchEnd)
                .off("touchcancel", tapTouchCancel);
        });

        return this;
    };
})();

(function($) {
    $.countLines = function(ta, options) {
        var defaults = {
            recalculateCharWidth: true,
            charsMode: "random",
            fontAttrs: ["font-family", "font-size", "text-decoration", "font-style", "font-weight"]
        };

        options = $.extend({}, defaults, options);

        var masterCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var counter;

        if (!ta.jquery) {
            ta = $(ta);
        }

        var value = ta.val();
        switch (options.charsMode) {
            case "random":
                // Build a random collection of characters
                options.chars = "";
                masterCharacters += ".,?!-+;:'\"";
                for (counter = 1; counter <= 12; counter++) {
                    options.chars += masterCharacters[(Math.floor(Math.random() * masterCharacters.length))];
                }
                break;
            case "alpha":
                options.chars = masterCharacters;
                break;
            case "alpha_extended":
                options.chars = masterCharacters + ".,?!-+;:'\"";
                break;
            case "from_ta":
                // Build a random collection of characters from the textarea
                if (value.length < 15) {
                    options.chars = masterCharacters;
                } else {
                    for (counter = 1; counter <= 15; counter++) {
                        options.chars += value[(Math.floor(Math.random() * value.length))];
                    }
                }
                break;
            case "custom":
                // Already defined in options.chars
                break;
        }

        // Decode chars
        if (!$.isArray(options.chars)) {
            options.chars = options.chars.split("");
        }

        // Generate a span after the textarea with a random ID
        var id = "";
        for (counter = 1; counter <= 10; counter++) {
            id += (Math.floor(Math.random() * 10) + 1);
        }

        ta.after("<span id='s" + id + "'></span>");

        var span = $("#s" + id);

        // Hide the span
        span.hide();

        // Apply the font properties of the textarea to the span class
        $.each(options.fontAttrs, function(i, v) {
            span.css(v, ta.css(v));
        });

        // Get the number of lines
        var lines = value.split("\n");
        var linesLen = lines.length;
        var averageWidth;

        // Check if the textarea has a cached version of the average character width
        if (options.recalculateCharWidth || ta.data("average_char") === null) {
            // Get a pretty good estimation of the width of a character in the textarea. To get a better average, add more characters and symbols to this list
            var chars = options.chars;
            var charLen = chars.length;
            var totalWidth = 0;
            $.each(chars, function(i, v) {
                span.text(v);
                totalWidth += span.width();
            });
            // Store average width on textarea
            ta.data("average_char", Math.ceil(totalWidth / charLen));
        }

        averageWidth = ta.data("average_char");

        // We are done with the span, so kill it
        span.remove();

        // Determine missing width (from padding, margins, borders, etc); this is what we will add to each line width
        var missingWidth = (ta.outerWidth() - ta.width()) * 2;

        // Calculate the number of lines that occupy more than one line
        var lineWidth;
        var wrappingLines = 0;
        var wrappingCount = 0;
        var blankLines = 0;

        $.each(lines, function (i, v) {
            // Calculate width of line
            lineWidth = ((v.length + 1) * averageWidth) + missingWidth;
            // Check if the line is wrapped
            if (lineWidth >= ta.outerWidth()) {
                // Calculate number of times the line wraps
                var wrapCount = Math.floor(lineWidth / ta.outerWidth());
                wrappingCount += wrapCount;
                wrappingLines++;
            }
            if ($.trim(v) === "") {
                blankLines++;
            }
        });

        var ret = {};

        ret["actual"] = linesLen;
        ret["wrapped"] = wrappingLines;
        ret["wraps"] = wrappingCount;
        ret["visual"] = linesLen + wrappingCount;
        ret["blank"] = blankLines;

        return ret;
    };
}(jQuery));

var GDF = {
    version: "2.0.17",
    publisherVersion: 22,
    db: null,
    hasDb: false,
    mapDb: null,
    hasMapDb: false,
    mainView: "",
    rootViews: [],
    menuItems: [],
    kendoMobileApp: null,
    _rootElement: $(document.body),
    _headElement: document.getElementsByTagName("head")[0],
    _tabletStyles: null,
    _phoneStyles: null,
    _isDeviceReady: false,
    _isInit: false,
    isKendoAppInit: false,
    isTablet: false,
    isNodeWebKit: false,
    isTransitioningView: false,
    appTitle: "",
    appVersion: "",
    serviceKey: "",
    moduleCode: 0,
    forceReload: true,
    defaultExternalTimeout: 0,
    appIsBlocked: false,
    enableDrawer: true,
    disableMenuSwipe: false,
    controllers: {},
    _messageBoxActionNames: ["ok", "yes", "no", "cancel", "close"],
    _viewAfterShowSetupTimeout: 0,

    start: function (styles, tabletStyles, phoneStyles) {
        if (this.forceReload) {
            var currentAddress = document.location.href;
            var hashIndex = currentAddress.indexOf("#");

            if (hashIndex !== -1) {
                document.location.href = currentAddress.substr(0, hashIndex);
                return;
            }
        }

        this._appendStyle("gdf/scripts/libs/kendo/styles/kendo.mobile.common.min.css");
        this._appendStyle("gdf/scripts/libs/kendo/styles/kendo.mobile.flat.min.css");
        this._appendStyle("gdf/scripts/libs/kendo/styles/kendo.dataviz.min.css");
        this._appendStyle("gdf/scripts/libs/kendo/styles/kendo.dataviz.flat.min.css");
        this._appendStyle("gdf/scripts/libs/mobiscroll/css/mobiscroll.core.css");
        this._appendStyle("gdf/scripts/libs/mobiscroll/css/mobiscroll.ios7.css");
        this._appendStyle("gdf/scripts/libs/mobiscroll/css/mobiscroll.animation.css");
        this._appendStyle("gdf/styles/main.css");

        if (styles) {
            if (typeof styles === "string") {
                styles = [styles];
            }

            if ($.isArray(styles)) {
                for (var i = 0; i < styles.length; i++) {
                    this._appendStyle(styles[i]);
                }
            }
        }

        GDF._tabletStyles = tabletStyles;
        GDF._phoneStyles = phoneStyles;

        if (GDF._isDeviceReady) {
            GDF._init();
        } else {
            document.addEventListener("deviceready", function() {
                GDF._init();
            }, false);
        }
        GDF.util.orientation();
    },

    _appendStyle: function(stylePath) {
        var newElement = document.createElement("link");

        newElement.setAttribute("rel", "stylesheet");
        newElement.setAttribute("type", "text/css");
        newElement.setAttribute("href", stylePath);

        this._headElement.appendChild(newElement);
    },

    _init: function() {
        if (this._isInit) {
            return;
        }

        this._isInit = true;

        // Properties for running the app without Cordova
        if (typeof window.Connection === "undefined") {
            window.Connection = {
                CELL: "cellular",
                CELL_2G: "2g",
                CELL_3G: "3g",
                CELL_4G: "4g",
                ETHERNET: "ethernet",
                NONE: "none",
                UNKNOWN: "unknown",
                WIFI: "wifi"
            };
        }

        if (typeof navigator.connection === "undefined") {
            navigator.connection = {
                type: Connection.UNKNOWN
            };
        }

        // Workaround for Date parsing on Android 2.3
        $data.Container.registerConverter("$data.Date", {
            'default': function(value) {
                return parseDate(value);
            }
        });

        // Platform flags
        var isTablet = this.detectTablet();
        var isNodeWebKit = this.detectNodeWebkit();

        // Building the app
        var tabletStyles = this._tabletStyles;
        var phoneStyles = this._phoneStyles;

        if (isTablet && tabletStyles) {
            if (typeof tabletStyles === "string") {
                tabletStyles = [tabletStyles];
            }

            if ($.isArray(tabletStyles)) {
                for (var i = 0; i < tabletStyles.length; i++) {
                    this.addStyle(tabletStyles[i]);
                }
            }

            this._tabletStyles = null;
        } else if (!isTablet && phoneStyles) {
            if (typeof phoneStyles === "string") {
                phoneStyles = [phoneStyles];
            }

            if ($.isArray(phoneStyles)) {
                for (var i = 0; i < phoneStyles.length; i++) {
                    this.addStyle(phoneStyles[i]);
                }
            }

            this._phoneStyles = null;
        }

        // DB preparation
        this._initData();

        // UI handling
        $("title").html(GDF.appTitle);
        document.title = GDF.appTitle;
        this.lang.loadTranslateScripts();
        this.ui.setupLayout();

        if (this.settings.userdata !== null) {
            var username = this.settings.userdata.Username;
            $("#username-value").text(username);
        }

        GDF.util.fillParameters(function() {
            GDF.appCreate();
        });
    },

    _initData: function() {
        if (window.sqlitePlugin) {
            window.openDatabase = function() {
                var argObj = {
                    bgType: 0
                };

                if (typeof (arguments[0]) === "string") {
                    argObj.name = arguments[0];
                } else if (typeof (arguments[0]) === "object") {
                    argObj.name = arguments[0].name;
                }

                return window.sqlitePlugin.openDatabase(argObj);
            };
        }

        this.trigger("dataInit");
        this.off("dataInit");

        if (this.hasMapDb) {
            this._mapDbCreate();
        }
    },

    getDeviceKey: function (usaimei, callback) {
        // RECUPERA A PLATAFORMA ONDE ESTA SENDO EXECUTADO O APP
        var plataform = null;
        if (typeof device !== "undefined") {
            plataform = device.platform.toLowerCase();
        }

        // RETORNA DEVICEKEY
        var gotDeviceId = function (key) {
            // SER RECUPEROU IMEI, E O MESMO VEIO NULO, UTILIZAR O GETKEY
            if (typeof key === "undefined" || key === null || key === "") {
                getKey();
            } else {
                // SET DEVICEKEY/IMEI RECUPERADO PARA UTILIZAR NAS REQUISIÇÕES FUTURAS
                GDF.settings.generatedDeviceKey = key;

                if (typeof callback === "function") {
                    callback(key);
                }

                return key;
            }
        };

        // RECUPERA KEY
        var getKey = function () {
            if (typeof device !== "undefined" && typeof device.uuid !== "undefined") {
                return gotDeviceId(device.uuid.toString());
            } else {
                return gotDeviceId(GDF.getUuid());
            }
        };

        // RECUPERA IMEI
        var getImei = function () {
            // VERIFICA SE O PLUGIN DO IMEI ESTÁ ADICIONADO NO PROJETO
            if (usaimei && typeof gatec !== "undefined" && typeof gatec.imeiplugin !== "undefined" && typeof gatec.imeiplugin.getImei === "function") {
                gatec.imeiplugin.getImei(gotDeviceId);
            } else {
                getKey();
            }
        };

        // QUANDO ESTIVER LOCADO COM USUÁRIO DEV (DEVELOPER) UTILIZAR SEMPRE A MESMA KEY
        if (GDF.settings.isDeveloper) {
            return gotDeviceId("gadevuser2015");
        }

            // SE O IMEI/DEVICEKY JÁ FOI RECUPERADA, UTILIZA O VALOR RECUPERADO ANTERIORMENTE
        else if (GDF.settings.generatedDeviceKey) {
            return gotDeviceId(GDF.settings.generatedDeviceKey);
        }

            // QUANDO PLATAFORMA ANDROID, TENTA BUSCAR IMEI
        else if (plataform === "android") {
            getImei();
        }

            // DEMAIS CASOS
        else {
            getKey();
        }
    },

    getUuid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    },

    detectTablet: function() {
        var isTablet = false;

        if (GDF.settings.forceTablet) {
            isTablet = true;
        } else if (kendo.support.mobileOS.tablet) {
            isTablet = true;
        } else if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string" &&
            /ipad|galaxy.*tab|kindle|nexus 7|nexus 10|tablet|playbook|xoom|Android.*Chrome\/[.0-9]* (?!Mobile)|android ([4-9])(?!.*mobile)|android 3/ig.test(navigator.userAgent)) {
            isTablet = true;
        }

        if (isTablet) {
            this._rootElement.addClass("isTablet");
        } else {
            this._rootElement.removeClass("isTablet");
        }

        this.isTablet = isTablet;

        return isTablet;
    },

    detectNodeWebkit: function() {
        // code from http://videlais.com/2014/08/23/lessons-learned-from-detecting-node-webkit/
        var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
        var isNodeWebkit = false;

        //Is this Node.js?
        if (isNode) {
            //If so, test for Node-Webkit
            try {
                isNodeWebkit = (typeof require("nw.gui") !== "undefined");
            } catch (e) {
                isNodeWebkit = false;
            }
        }

        this.isNodeWebKit = isNodeWebkit;

        return isNodeWebkit;
    },

    isLandscape: function() {
        return this._rootElement.hasClass("km-horizontal");
    },

    menuHtmlCreate: function() {
        this.html += "<div data-role=\"drawer\" id=\"main-menu\" data-before-show=\"GDF.mainMenuDrawerBeforeShow\"";

        if (this.disableMenuSwipe) {
            this.html += " data-swipe-to-open=\"false\"";
        } else {
            this.html += " data-swipe-to-open=\"true\"";
        }

        this.html += ">";
        this.html += "    <ul data-role=\"listview\" data-click=\"GDF.menuClick\">";
        this.html += "        <li class='main-menu-header'>";
        this.html += GDF.menuHeaderHtml;
        this.html += "        </li>";

        var className;
        var addClass = function(c) {
            if (className !== "") {
                className += " ";
            }

            className += c;
        };

        for (var i = 0; i < GDF.menuItems.length; i++) {
            var menuItem = GDF.menuItems[i];

            if (typeof (menuItem) === "string") {
                menuItem = { controller: menuItem };
            }

            if (!menuItem.controller) {
                continue;
            }

            className = "";

            if (menuItem.className) {
                addClass(menuItem.className);
            }

            if (menuItem.hideFromMaster) {
                addClass("hideFromMaster");
            } else if (menuItem.showForMaster) {
                addClass("showForMaster");
            }

            // Indica que estes itens deverão ser exibidos quando a aplicação estiver bloqueada para sincronia
            if (menuItem["showWhenBlock"]) {
                addClass("showWhenBlock");
            } else {
                addClass("hideWhenBlock");
            }

            // Config li
            var id = "menu-" + menuItem.controller;

            this.html += "<li id='" + id + "'";
            if (className !== "") {
                this.html += " class=\"" + className + "\"";
            }
            this.html += ">";

            // Config link
            this.html += "<a href=\"views/" + menuItem.controller + ".html\"";

            // Add data
            this.html += " data-controller=\"" + menuItem.controller + "\"";
            this.html += " data-transition=\"none\"";
            this.html += " data-lang=\"" + (menuItem.lang ? menuItem.lang : menuItem.controller) + "\"";

            // Indica que o parâmetro 'shouldRefresh' da controller deverá ser configurado como 'true'
            if (menuItem["refreshOnShow"]) {
                this.html += " data-refreshOnShow=true";
            }

            // Indica que o parÃ¢parâmetro 'insteadNavigation' da controller deverá ser configurado
            if (menuItem["insteadNavigation"]) {
                this.html += " data-insteadnavigation=" + menuItem["insteadNavigation"];
            }

            // Close li e link
            this.html += "></a></li>";
        }

        this.html += "    </ul>";
        this.html += "</div>";
    },

    insertHtml: function() {
        this.menuHtmlCreate();
        this._rootElement.prop("id", "gdf-app");
        this._rootElement.attr("id", "gdf-app");
        this._rootElement.append(this.html);

        if (GDF.isTablet) {
            $("[data-tablet-width]").each(function() {
                var thisEl = $(this);
                thisEl.css("width", thisEl.data("tablet-width"));
            });
            $("[data-tablet-height]").each(function() {
                var thisEl = $(this);
                thisEl.css("height", thisEl.data("tablet-height"));
            });
        }
    },

    appCreate: function() {
        this.insertHtml();
        this.lang.translate($("#main-menu, #messagebox"));

        // Settings defaults values
        $.mobiscroll.setDefaults({
            lang: this.lang.mobiscrollCulture,
            display: this.isTablet ? "modal" : "bottom",
            theme: "ios7",
            mode: "scroller",
            closeOnOverlay: true
        });

        if (this.isTablet) {
            var originalSelectPreset = $.mobiscroll.presets.select;

            $.mobiscroll.presets.select = function (inst) {
                var returnVal = originalSelectPreset.call(this, inst);
                returnVal.width = 300;
                return returnVal;
            };

            $.mobiscroll.themes.ios7.defaults.rows = 7;
            $.mobiscroll.themes.ios7.defaults.height = 55;

            this._addMainStyle("gdf/styles/main-tablet.css");
        } else {
            $.mobiscroll.themes.ios7.defaults.rows = 5;
            $.mobiscroll.themes.ios7.defaults.width = 40;
            $.mobiscroll.themes.ios7.defaults.height = 40;
        }

        // exec node-webkit workarounds
        if (this.isNodeWebKit) {
            this.setupNodeWebKit();
        }

        delete this.setupNodeWebKit;

        // Fixes for iOS 7
        if (typeof StatusBar !== "undefined") {
            StatusBar.overlaysWebView(false);
        } //Turns off web view overlay.

        if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
            $("html").addClass("ipad ios7");
            window.addEventListener("orientationchange", function() {
                if (document.body.scrollTop !== 0) {
                    window.scrollTo(0, 0);
                }
            }, false);
        }

        // Kendo app init
        this.kendoMobileApp = new kendo.mobile.Application(document.body, {
            transition: "slide",
            loading: this.strings.loadingMessage,
            initial: "views/login.html",
            skin: "flat",
            init: function() {
                this.changeLoadingMessage("");
                this.pane.bind("navigate", function(e) {
                    hideKeyboard();
                });

                GDF.updateMasterOptions();
                GDF.trigger("appInit");
                GDF.off("appInit");
                GDF.isKendoAppInit = true;

                var touchLoadingPreventFunction = function(e) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }

                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    return false;
                };

                var scrollPreventFunction;
                scrollPreventFunction = function() {
                    var thisEl = $(this);
                    thisEl.off("scroll", scrollPreventFunction);
                    var currentView = GDF.kendoMobileApp.view();
                    if (currentView) {
                        var aElement = currentView.element[0];
                        if (aElement && aElement.scrollIntoView) {
                            aElement.scrollIntoView();
                        }
                    }
                    setTimeout(function() {
                        thisEl.on("scroll", scrollPreventFunction);
                    }, 0);
                };

                $("body > .km-loader").on("touchstart", touchLoadingPreventFunction);
                $("body").on("touchstart", ".ga-block-mask", touchLoadingPreventFunction);
                $([window, document.body]).on("scroll", scrollPreventFunction);

                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }
            }
        });

        // Android back button management
        $(document).on("backbutton", function(e) {
            e.preventDefault();

            var viewId = GDF.kendoMobileApp.view().id;

            viewId = viewId.replace("views/", "").replace(".html", "");

            // We should block the button if Kendo is transitioning screens
            // or the app is blocked/loading
            if (GDF.isTransitioningView || GDF.appIsBlocked) {
                return false;
            }

            // Close modal view, if there is one being shown
            var visibleModalViews = $("[data-role=modalview]:visible");
            if (visibleModalViews.size() === 1) {
                closeModalView({ sender: visibleModalViews.data("kendoMobileModalView") });
                return false;
            }

            if (GDF.rootViews.indexOf(viewId) !== -1) {
                GDF.messageBox({
                    yes: function() {
                        if (navigator && navigator.app && navigator.app.exitApp) {
                            // Set app with closed status
                            GDF.settings.AppStatus = GDF.enums.AppStatus.Closed;
                            // Do close action
                            navigator.app.exitApp();
                        }
                    },
                    no: true,
                    ok: false,
                    text: GDF.strings.confirmClose
                });
                return false;
            }

            if (history && history.go) {
                history.go(-1);
            }

            return false;
        });

        var navigationHandling = function(e, url) {
            var controller = GDF.util.getController(true);
            if (!controller) {
                return;
            }

            var ignoredViews = controller.ignoredViews || [];
            if (url.startsWith("lookup") || url.startsWith("logviewer") ||
                !controller.checkVarsBeforeClose ||
                controller._forceViewChange) {
                controller._forceViewChange = false;
                return;
            }

            var i;
            for (i = 0, l = ignoredViews.length; i < l; i++) {
                var ignoredView = ignoredViews[i];

                if (typeof ignoredView !== "string") {
                    continue;
                }

                ignoredView = ignoredView.replace(/^views\//, "");
                ignoredView = ignoredView.replace(/\.html$/, "");

                if (url.startsWith("views/" + ignoredView + ".html")) {
                    return;
                }
            }

            // Verifica se o controller está marcado para validar mudanças
            // Se não possuir o parâmetro que indica se irá ou não validar mudanças, assume que o mesmo deve ser validado
            var checkChanges = typeof controller["checkChanges"] !== "undefined" ? controller["checkChanges"] : true;
            if (checkChanges) {
                var inputOldList = controller.varsInit;
                var inputNewList = controller.find(":input");

                if (!inputOldList || !inputNewList) {
                    return;
                }

                for (i = 0; i < inputOldList.length; i++) {
                    if (inputOldList[i] != inputNewList[i].value) {
                        e.preventDefault();
                        GDF.messageBox({
                            text: GDF.strings.backNewEntry,
                            ok: false,
                            cancel: false,
                            no: true,
                            yes: function() {
                                controller.varsInit = null;
                                controller._forceViewChange = true;
                                GDF.kendoMobileApp.navigate(url);
                            }
                        });
                        return;
                    }
                }
            }

            controller.varsInit = null;
        };

        GDF.kendoMobileApp.router.bind("change", function(e) {
            if (e.sender._gaDidGoBack) {
                e.sender._gaDidGoBack = false;
                return;
            }
            navigationHandling(e, e.url);
        });

        GDF.kendoMobileApp.router.bind("back", function(e) {
            navigationHandling(e, "#:back");
            e.sender._gaDidGoBack = true;
        });

        // Modal view size handling
        $(window).on("resize", function(e) {
            $("[data-role=modalview]:visible").each(function() {
                $(this).data("kendoMobileModalView").open();
            });
        });
    },

    addDatabase: function(databaseName, internalName, entities, callback) {
        if (!$data) {
            return false;
        }

        $data.EntityContext.extend(internalName, entities);
        this.onDataInit(function() {
            var db = new window[internalName]({
                provider: Modernizr.websqldatabase ? "webSql" : "indexedDb",
                databaseName: databaseName,
                maxSize: 52428800 // 50 MBytes
            });
            if (typeof callback === "function") {
                callback(db);
            }
        });

        return true;
    },

    dbCreate: function (databaseName, entities, callback) {
        this.customDbCreate(databaseName, entities, "", callback);
    },

    customDbCreate: function (databaseName, entities, objName, callback) {
        var dbName = "db" + objName;
        var sqlName = "sql" + objName;
        var hasDb = "hasDb" + objName;

        if (this[dbName]) {
            return;
        }

        entities = entities || {};

        this[hasDb] = this.addDatabase(databaseName, "APPDatabase", entities, function (db) {
            GDF[dbName] = db;
            GDF[sqlName] = new dbQuery(db);

            if (typeof callback == "function") {
                callback()
            }
        });
    },

    _mapDbCreate: function() {
        if (this.mapDb) {
            return;
        }

        $data.Entity.extend("Header", {
            Id: { type: "int", key: true, computed: true },
            LastSync: { type: "int" }
        });

        $data.Entity.extend("Maps", {
            Id: { type: "int", key: true, computed: true },
            //Type: { type: String },
            D1: { type: String },
            D2: { type: String },
            D3: { type: String },
            D4: { type: String },
            Empresa: { type: String },
            Safra: { type: String },
            Key: { type: String },
            X: { type: "decimal" },
            Y: { type: "decimal" },
            GeometryType: { type: String },
            GeometryCoordinates: { type: String }
        });

        var entities = {
            Header: { type: $data.EntitySet, elementType: Header },
            Maps: { type: $data.EntitySet, elementType: Maps }
        };

        this.hasMapDb = this.addDatabase("Map", "MapDatabase", entities, function(db) {
            GDF.mapDb = db;
            GDF.mapSql = new dbQuery(db);
        });
    },

    loadScript: function(scriptPath) {
        jQuery.ajax({
            url: scriptPath,
            type: "GET",
            dataType: "script",
            async: false,
            success: function(data) {
                eval(data);
            }
        });
    },

    loadController: function(controllerName) {
        var filePath = "app/scripts/controllers/" + controllerName + ".js";
        if (fileExists(filePath)) {
            this.loadScript(filePath);
            if (typeof GDFtemp !== "undefined") {
                GDF.controllers[controllerName] = GDFtemp;

                GDFtemp = undefined;

                if (typeof GDF.controllers[controllerName].init === "function") {
                    GDF.controllers[controllerName].init();
                }
            }
        }
    },

    _addMainStyle: function(path) {
        $("head link[href^=\"gdf/styles/\"]:last").after("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + path + "\" />");
    },

    addStyle: function(path) {
        var target = $("head link[href^=\"app/styles/\"]:last");
        var styleMarkup = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + path + "\" />";

        if (target.size() > 0) {
            target.after(styleMarkup);
        } else {
            $("head").append(styleMarkup);
        }
    },

    updateMasterOptions: function() {
        if (GDF.settings.isMaster) {
            $(".hideFromMaster").hide();
            $(".showForMaster").show();
        } else {
            $(".hideFromMaster").show();
            $(".showForMaster").hide();
        }
    },

    updateBlockSyncOptions: function () {
        $(".hideWhenBlock").hide();
        $(".showWhenBlock").show();
    },

    handleApiUrl: function(url, path) {
        url = $.trim(url || "");
        if (!/^(f|ht)tps?:\/\//i.test(url)) {
            url = "http://" + url;
        }

        if (!/\/$/i.test(url)) {
            url += "/";
        }

        if (!/\/api\/$/i.test(url)) {
            url += "api/";
        }

        if (path) {
            if (path.toUpperCase().startsWith("API/")) {
                path = path.substr(4, path.length - 1);
            }

            url += this.handleApiPath(path);
        }

        return url;
    },

    handleApiPath: function(path) {
        path = $.trim(path);

        if (/^\//i.test(path)) {
            path = path.substr(1, path.length - 1);
        }

        return path;
    },

    getApiServerUrl: function(path) {
        return this.handleApiUrl(GDF.settings.apiServerUrl, path);
    },

    getConfigServiceUrl: function(interno) {
        var serviceUrl;
        var path = GDF.serviceKey;

        if(interno){
            serviceUrl = GDF.settings.serviceUrl2;
        }else{
            serviceUrl = GDF.settings.serviceUrl;
        }

        if (!path.toUpperCase().startsWith("API/CONFIG/") && !path.toUpperCase().startsWith("CONFIG/")) {
            path = "Config/" + path;
        }

        if (serviceUrl) {
            return this.handleApiUrl(serviceUrl, path);
        }

        return "";
    },

    requestApiServerUrl: function(successFunction, errorFunction) {
        // SE ESTIVER LOGADO COM USUÁRIO DE DESENVOLVIMENTO, 
        // E UM ENDEREÇO LOCAL FOI CONFIGURADO, 
        // UTILIZA O ENDEREÇO LOCAL PARA ACESSO A WEBAPI
        if (GDF.settings["isDeveloper"] && GDF.settings["localWebAPI"]) {
            // CONFIGURA ENDEREÇO
            GDF.settings.apiServerUrl = GDF.settings["localWebAPI"] + "api/";

            // CONTINUA PROCESSAMENTO
            if (successFunction) {
                successFunction();
            }

            return true;
        }

        //VALIDACOES DAS URLS TANTO INTERNAS COMO EXTERNAS
        //USUARIO LOGARÁ COM A URLINTERNA
        //CASO A INTERNA ESTIVER COM ERRO, UTILIZA A EXTERNA
        //CASO AMBAS ESTIVEREM ERRADAS, APARECERÁ UMA MENSAGEM DE ERRO
        //CASO NÃO EXISTIR A INTERNA E A EXTERNA FOR INCORRETA
        var validacoesDasUrls = function (interno) {
            var serviceUrl = GDF.getConfigServiceUrl(interno);

            if (!serviceUrl) {
                return false;
            }

            GDF.blockApp(true);
            $.ajax({
                url: serviceUrl,
                timeout: GDF.defaultExternalTimeout,
                success: function (newApiServerUrl) {
                    newApiServerUrl = newApiServerUrl || "";

                    GDF.settings.apiServerUrl = newApiServerUrl + "api/";
                    GDF.unblockApp();

                    if (successFunction) {
                        successFunction();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (interno) {
                        validacoesDasUrls(false);
                    } else {
                       GDF.messageBox(GDF.lang.connectionErrorMessage(jqXHR.status, textStatus));
                        


                        if (errorFunction) {
                            errorFunction();
                        }
                    }

                    GDF.unblockApp();

                },
                complete: function (jqXHR, textStatus) {
                    if (textStatus === "timeout") {
                        GDF.unblockApp();

                        if (interno) {
                            validacoesDasUrls(false);
                        } else {
                            GDF.messageBox(GDF.lang.connectionErrorMessage(jqXHR.status, textStatus));
                            if (errorFunction) {
                                errorFunction();
                            }
                        }
                    }
                }
            });
        }

        //SE A INTERNA FOR VAZIA E NÃO COMEÇAR COM "HTTP://"
        validacoesDasUrls(GDF.settings.serviceUrl2 != "" && GDF.settings.serviceUrl2 != "http://");
    },

    isConnected: function() {
        // Do u haz the connections?
        return navigator.connection.type !== Connection.NONE;
    },

    menuClick: function(e) {
        e.preventDefault();

        // Recupera link
        var thisHref = e.target.attr("href");

        // Recupera controller
        var controller = GDF.controllers[e.target.data("controller")];
        if (!thisHref) {
            return;
        }

        // Verifica se será executada uma açãoao invés de continuar a navegação
        var insteadNavigation = e.target.data("insteadnavigation");
        if (insteadNavigation) {
            eval(insteadNavigation);
            return;
        }

        if (thisHref.indexOf("themecolor") !== -1) {
            thisHref = "#themecolor";
        }

        if (GDF.kendoMobileApp.view().id === thisHref) {
            $("#main-menu").data("kendoMobileDrawer").hide();
            return;
        }

        if (thisHref === "views/login.html" || thisHref === "views/logout.html") {
            GDF.logout();
        } else if (thisHref === "views/sync.html") {
            if (GDF.controllers.sync) {
                GDF.controllers.sync.shouldRefresh = true;
            }
        }
        
        GDF.kendoMobileApp.pane.history.splice(0, GDF.kendoMobileApp.pane.history.length);

        // Verifica se está marcado para atualizar automaticamente, se estiver, configura controller
        if (e.target.data("refreshonshow") && controller) {
            controller.shouldRefresh = true;
        }

        var transition = e.target.data("transition");
        if (transition) {
            GDF.kendoMobileApp.navigate(thisHref, transition);
        } else {
            GDF.kendoMobileApp.navigate(thisHref);
        }
    },

    logout: function(navigate, message) {
        if (GDF.controllers[GDF.mainView]) {
            GDF.controllers[GDF.mainView].shouldRefresh = true;
        }

        if (GDF.controllers.login) {
            GDF.controllers.login.shouldRefresh = true;
        }

        var username = GDF.settings.userdata.Username;
        GDF.settings.userdata = null;
        GDF.settings.isLogged = false;

        $("#login").find("select, input[type=text], input[type=password], input[name=password], .password-field").val("");

        if (navigate) {
            GDF.kendoMobileApp.navigate("views/login.html");
        }

        GDF.trigger("appLogout", [username, message]);
    },

    blockApp: function(showLoading) {
        this.appIsBlocked = true;

        if (!this.kendoMobileApp) {
            return;
        }

        this.kendoMobileApp.pane.element.blockElement();

        if (typeof showLoading === "string") {
            this.kendoMobileApp.changeLoadingMessage(showLoading);
        }

        if (showLoading) {
            this.kendoMobileApp.showLoading();
        }
    },

    unblockApp: function() {
        this.appIsBlocked = false;

        if (!this.kendoMobileApp) {
            return;
        }

        this.kendoMobileApp.pane.element.unblockElement();
        this.kendoMobileApp.hideLoading();
        this.kendoMobileApp.changeLoadingMessage("");
    },

    mainMenuDrawerBeforeShow: function(e) {
        if (GDF.kendoMobileApp.view().element.prop("id") === "login" || !GDF.enableDrawer || GDF.appIsBlocked || GDF.isTransitioningView) {
            e.preventDefault();
        } else {
            scrollListViewToTop($("#main-menu").find("[data-role=listview]"));
        }
    },

    on: function(events, selector, data, handler) {
        this._rootElement.on(events, selector, data, handler);
    },

    off: function(events, selector, handler) {
        this._rootElement.off(events, selector, handler);
    },

    trigger: function(eventType, extraParameters) {
        this._rootElement.trigger(eventType, extraParameters);
    },

    one: function(events, selector, data, handler) {
        this._rootElement.one(events, selector, data, handler);
    },

    onAppInit: function(func) {
        if (this.isKendoAppInit) {
            func();
        } else {
            this.on("appInit", func);
        }
    },

    onDataInit: function(func) {
        if (this._isInit) {
            func();
        } else {
            this.on("dataInit", func);
        }
    },

    exec: function(e) {
        var thisEl;

        if (e.sender && e.sender.element) {
            thisEl = $(e.sender.element);
        } else if (e.context) {
            thisEl = $(e.context);
        } else if (e.target) {
            thisEl = $(e.target);
        } else {
            return;
        }

        var execMethod = thisEl.data("exec");
        if (!execMethod) {
            return;
        }

        var execController = thisEl.data("exec-controller");
        if (!execController) {
            execController = thisEl.closest("[data-role=view]").prop("id");
        }

        var theController = execController ? GDF.controllers[execController] : GDF.util.getController();
        if (!theController) {
            return;
        }

        var theMethod = theController[execMethod];
        if (typeof theMethod === "function") {
            theMethod.call(theController, e);
        }
    },

    closeModal: function(modalView) {
        modalView.unbind("close", GDF.handleModalCloseManual);
        modalView.unbind("close", GDF.handleModalCloseAuto);
        modalView.bind("close", GDF.handleModalCloseManual);
        modalView.close();
    },

    handleModalCloseAuto: function(e) {
        GDF._handleModalClose(e, true);
    },

    handleModalCloseManual: function(e) {
        GDF._handleModalClose(e, false);
    },

    _handleModalClose: function(e, shouldHide) {
        e.preventDefault();

        var thisEl = $(e.sender.element);

        clearTimeout(thisEl.data("close-timer"));

        thisEl.data("close-timer", setTimeout(function () {
            e.sender.unbind("close", GDF.handleModalCloseAuto);
            e.sender.unbind("close", GDF.handleModalCloseManual);
            e.sender.close();
            e.sender.bind("close", GDF.handleModalCloseAuto);

            if (shouldHide === true) {
                thisEl.closest(".km-modalview-root").hide();
            }
        }, 75));
    },

    messageBox: function(options, footerHeight) {
        /* 
        Parâmetros:
            title(string): Título da janela,
            ok(delegate): Botão OK, (default true)
            yes(delegate): Botão YES,
            no(delegate): Botão NO,
            cancel(delegate): Botão CANCEL,
            icon(string): Classe CSS do ícone.
        
        Botões: Default false. Passar uma função com a ação para mostrar. Para o botão fechar a janela, passar apenas true.
        Exemplo:
        messageBox({ok: function() { alert('botão ok clicado.')}});
        messageBox({ok: true});
        */
        if (typeof options === "string") {
            options = { text: options };
        }

        // Desbloqueia a tela se estiver bloqueada
        GDF.unblockApp();

        var actions = this._messageBoxActionNames;
        var messageDiv = $("#messagebox");
        var messageTitle = options.title || GDF.strings.message;

        messageDiv.find(".messagebox-button-bar").css("height", footerHeight || "");
        options.ok = typeof options.ok !== "undefined" ? options.ok : true;

        // Utilizado para exibir a mensagem por um tempo pré determinado
        options.timeout = typeof options.timeout === "number" ? options.timeout : null;
        options.timeoutCallback = typeof options.timeoutCallback === "function" ? options.timeoutCallback : null;

        for (var i = 0; i < actions.length; i++) {
            var actionName = actions[i];
            var theButton = messageDiv.find("div[data-action=\"" + actionName + "\"]:first");

            if (theButton.size() === 0) {
                continue;
            }

            var action = options[actionName];
            var actionInfo;
            if (typeof action === "function") {
                actionInfo = {
                    callback: action
                };
            } else {
                actionInfo = action;
            }

            // Quando configurado timeout, botões não executam ação
            if (actionInfo && options.timeout === null) {
                theButton.css("display", "inline-block");

                var actionCallback = (actionInfo && typeof actionInfo.callback === "function") ? actionInfo.callback : function () { };

                theButton.data("messageBoxAction", actionCallback);
                theButton.data("kendoMobileButton").unbind("click").bind("click", function() {
                    var theAction = $(this.element).data("messageBoxAction");

                    if (typeof theAction === "function") {
                        theAction();
                    }

                    GDF.closeModal(messageDiv.data("kendoMobileModalView"));
                });
            } else {
                theButton.css("display", "none");
            }
        }

        var messageParagraph = messageDiv.find("p:first");
        messageDiv.find("[data-role=\"navbar\"]").data("kendoMobileNavBar").centerElement.html(messageTitle);
        messageParagraph.html(options.text);
        messageDiv.data("kendoMobileModalView").open();
        messageDiv.closest(".km-modalview-root").css({
            "z-index": 2000
        });
        
        var sizeTablet = options.timeout === null ? (options.bigger ? 360 : 195) : 165;
        var sizeSmart = options.timeout === null ? (options.bigger ? 240 : 135) : 105;
        messageDiv.css({
            height: messageParagraph.height() + (GDF.isTablet ? sizeTablet : sizeSmart)
        });

        if (options.bigger) {
            $("#message-box-content").css({
                "font-size": "2em"
            });
        }

        var maxWidth = messageDiv.css("max-width");
        if (maxWidth) {
            messageDiv.closest(".k-animation-container").css("max-width", maxWidth);
        }

        // Se foi informado timeout, configura tempo default para fechamento automático da mensagem
        if (options.timeout !== null) {
            setTimeout(function() {
                if (options.timeoutCallback !== null) {
                    options.timeoutCallback();
                }

                GDF.closeModal(messageDiv.data("kendoMobileModalView"));
            }, options.timeout);
        }

        // Kendo bug workaround
        //messageDiv.closest(".km-modalview-wrapper").css("opacity", "");
    },

    messageBoxAddButton: function(actionName, html, id, index) {
        if (typeof actionName !== "string") {
            return;
        }

        var messageDiv = $("#messagebox");
        var theButton = messageDiv.find("div[data-action=\"" + actionName + "\"]:first");
        if (theButton.size() > 0) {
            return;
        }

        this._messageBoxActionNames.push(actionName);
        if ((html || "").indexOf("<") === -1 && typeof id !== "string") {
            index = id;
            id = html;
            html = "";
        }

        html = html || "<div data-role=\"button\" data-action=\"" + actionName + "\"></div>";
        theButton = $(html);
        theButton.kendoMobileButton();
        theButton.data("action", actionName);
        theButton.prop("data-action", actionName);
        theButton.attr("data-action", actionName);

        if (typeof id === "string") {
            theButton.prop("id", id);
            theButton.attr("id", id);
        }

        var buttonBar = messageDiv.find(".messagebox-button-bar");
        if (typeof index === "number") {
            buttonBar.children().eq(index).after(theButton);
        } else {
            buttonBar.append(theButton);
        }

        return theButton;
    },

    messageBoxGetButton: function(actionName) {
        if (typeof actionName !== "string") {
            return;
        }

        var messageDiv = $("#messagebox");
        var theButton = messageDiv.find("div[data-action=\"" + actionName + "\"]:first");

        return theButton;
    },

    navigate: function(viewName, effect) {
        viewName = viewName.trim();

        if (!viewName.startsWith("views/")) {
            viewName = "views/" + viewName;
        }

        if (!viewName.endsWith(".html")) {
            viewName += ".html";
        }

        if (!effect) {
            effect = "slide:left";
        }

        GDF.kendoMobileApp.navigate(viewName, effect);
    },

    forceNavigate: function(url) {
        var controller = GDF.util.getController();

        if (controller) {
            controller._forceViewChange = true;
        }

        GDF.kendoMobileApp.navigate(url);
    },

    forceNavigateBack: function() {
        GDF.forceNavigate("#:back");
    },

    scrollToTop: function() {
        GDF.util.getController().view.scroller.scrollTo(0, 0);
    }
};

function GDFController(e) {
    this.view = e.view;
};

GDFController.prototype.find = function(selector) {
    return this.view.element.find(selector);
};

GDFController.prototype.setViewTitle = function(title) {
    var navbar = this.view.element.find("[data-role=navbar]:first").data("kendoMobileNavBar");

    if (navbar && title) {
        navbar.title(title);
    }
};

GDFController.prototype.showMessage = function(message) {
    var viewMessage = this.find(".view-message");

    if (viewMessage.size() === 0) {
        viewMessage = $("<div class=\"view-message\"><div class=\"view-message-container\"><div class=\"view-message-text\"></div></div></div>");
        this.view.content.prepend(viewMessage);
    }

    viewMessage.show().find(".view-message-text").html(message);
};

GDFController.prototype.hideMessage = function() {
    var viewMessage = this.find(".view-message");

    if (viewMessage.size() > 0) {
        viewMessage.hide().find(".view-message-text").html("");
    }
};

GDFController.prototype.updateVarsInit = function() {
    var listInput = this.find(":input");
    var varsInit = [];

    $.each(listInput, function(idx, elem) {
        varsInit.push(elem.value);
    });

    this.varsInit = varsInit;
};

GDFController.prototype.disableAllInputs = function() {
    var inputList = this.find(":input");

    $.each(inputList, function (idx, elem) {
        $(elem).disable();
    });
};

GDFController.prototype.enableAllInputs = function() {
    var inputList = this.find(":input");

    $.each(inputList, function(idx, elem) {
        $(elem).enable();
    });
};


GDF._viewAfterShowSetupTimeout = 0;
GDF.viewBeforeShow = function(e) {
    GDF.isTransitioningView = true;

    clearTimeout(GDF._viewAfterShowSetupTimeout);

    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    if (typeof controller === "undefined") {
        GDF.loadController(controllerName);

        if (typeof GDF.controllers[controllerName] === "undefined") {
            GDF.controllers[controllerName] = {};
        }

        controller = GDF.controllers[controllerName];
    }

    if (!(controller instanceof GDFController)) {
        var controllerObj = new GDFController(e);

        for (var c in controller) {
            if (!controller.hasOwnProperty(c)) {
                continue;
            }
            controllerObj[c] = controller[c];
        }

        controller = controllerObj;

        GDF.controllers[controllerName] = controller;
        GDF.lang.translate(e.view.element);

        e.view.bind("init", GDF.viewInit);
        e.view.bind("show", GDF.viewShow);
        e.view.bind("afterShow", GDF.viewAfterShow);
        e.view.bind("beforeHide", GDF.viewBeforeHide);
        e.view.bind("hide", GDF.viewHide);
        e.view.bind("transitionStart", GDF.viewTransitionStart);
        e.view.bind("transitionEnd", GDF.viewTransitionEnd);
    }

    if (typeof controller.viewBeforeShow === "function") {
        try {
            controller.viewBeforeShow(e);
        } catch (ex) {
            handleException(ex);
        }
    }

    if (controller.shouldRefresh) {
        controller.requiredFieldClicked = false;
    }
};

GDF.configLookUp = function (e, listLookUp) {
    if (typeof listLookUp === "object" && listLookUp.length > 0) {
        listLookUp.each(function (idx, elem) {
            // Configura placeholder
            var label = $("label[for='" + elem.id + "']");
            var display = $("label[for='" + elem.id + "']").css('display');
            if (display == "none") {
                elem.placeholder = GDF.strings[label.data("lang")];
            } else {
                elem.placeholder = GDF.strings.selectAnOption;
            }

            var option = undefined;
            var options = $(elem).attr("options");
            if (options) {
                option = {};
                var aux = options.split(";");
                $.each(aux, function (ifx, elem) {
                    var opt = elem.split(":");
                    option[opt[0]] = opt[1].trim();
                });
            }

            GDF.util.createLookUp(elem.id, option);
        });
    }
};

GDF.viewInit = function (e) {
    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    GDF.ui.convertSVGImages(e.view.element);

    if (typeof controller.viewInit === "function") {
        try {
            controller.viewInit(e);
        } catch (ex) {
            handleException(ex);
        }
    }

    // Configura elementos da classe lookup
    var listLookUp;
    if (controller && controller.view) {
        listLookUp = controller.view.element.find("input[class=lookup]");
        GDF.configLookUp(e, listLookUp);
    }

    // Configura elementos da classe date
    var listDate;
    if (controller && controller.view) {
        listDate = controller.view.element.find("input[class=date]");
    }

    if (listDate) {
        listDate.each(function (idx, elem) {
            $(elem).mobiscroll().date({
                // Formato default da data
                dateFormat: "mm/dd/yy",
                // Mï¿½todo executado ao selecionar a data
                onSelect: function () {
                    controller[elem.id] = new Date(this.value);
                    controller[elem.id].setHours(0, 0, 0, 0);
                    $(this).val(GDF.util.formatDate(controller[elem.id], GDF.util.getDateFormat()));
                }
            });

            controller[elem.id] = new Date();
            controller[elem.id].setHours(0, 0, 0, 0);

            $(elem).val(GDF.util.formatDate(controller[elem.id], GDF.util.getDateFormat()));
        });
    }

    var listDateTime;
    if (controller && controller.view) {
        listDateTime = controller.view.element.find("input[class=datetime]");
    }

    if (listDateTime) {
        listDateTime.each(function (idx, elem) {
            $(elem).mobiscroll().datetime({
                // Formato default da data
                dateFormat: "mm/dd/yy",
                timeFormat: 'HH:ii',
                timeWheels: 'HHii',
                headerText: false,
                // Mï¿½todo executado ao selecionar a data
                onSelect: function () {
                    controller[elem.id] = new Date(this.value);
                    $(this).val(GDF.util.formatDate(controller[elem.id], GDF.util.getDateTimeFormat()));
                }
            });

            controller[elem.id] = new Date();
            $(elem).val(GDF.util.formatDate(controller[elem.id], GDF.util.getDateTimeFormat()));
        });
    }

    GDF.numberPicker.configView(e.view);

    if (!((/android/i.test(kendo.support.mobileOS.device) || /android/i.test(kendo.support.mobileOS.name)) && parseInt(kendo.support.mobileOS.majorVersion, 10) <= 2)) {
        e.view.element.find("input.password-field").attr("type", "password");
    }
};

GDF.viewShow = function(e) {
    GDF.lang.translateViewTitle(e);

    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    // Recupera Id do controller
    var id = controller.find(".km-header").parent().attr("id");

    // Configura id para do elemento de pesquisa
    var idsearch = "search" + id;

    // Coloca a pesquisa no cabeçalho da tela
    if (controller.find(".km-header").length > 0) {
        // Verifica se a tela atual possui pesquisa
        var search = $("#" + id).find(".km-content").find(".km-filter-form");
        if (search.length > 0) {
            // Verifica se o elemento já foi inserido anteriormente
            var addSearchHeader = function() {
                // Inclui pesquisa no cabeçalho
                $("#" + id).find("header").append("<div data-role=\"navbar\" class=\"km-widget km-navbar km-listview-wrapper km-search-head\" id=\"" + idsearch + "\"></div>");
                search.appendTo("#" + idsearch);
            };

            searchHeader = $("#" + idsearch);
            if (searchHeader.length == 0) {
                addSearchHeader();
            }
        }

        // Configura exibição somente da pesquisa relevante a tela em foco
        var searchHeader = $("#" + id).find(".km-search-head");
        $.each(searchHeader, function (idx, elem) {
            if (elem.id != idsearch) {
                $(elem).css('display', 'none');
            } else {
                $(elem).css('display', 'block');
            }
        });

        // Verifica se já existe botões de navegação de lista no header atual
        var listNavigateButtons = controller.find(".km-header").find(".list-up-div");
        if (listNavigateButtons.length === 0) {
            var navigateHtml = "<div class=\"list-up-div\">";
            navigateHtml += "   <a data-role=\"button\" data-icon=\"left-arrow\" data-click=\"GDF.exec\" data-exec=\"listScrollToTop\" class=\"km-widget km-button list-up-button\">";
            navigateHtml += "   <span class=\"km-icon km-left-arrow km-notext\"></span> ";
            navigateHtml += "   </a>";
            navigateHtml += "</div>";
            controller.find(".km-header").append(navigateHtml);
        }

        // Configura estilo e posição do botão para voltar ao topo da tela
        // Cria estilo inicial
        var style = "display: none;";

        // Configura posição do estilo se tiver footer utiliza para calcular a posição, caso contrario utiliza o default 0 
        var verticalPosRef = 0;
        if (controller.find(".km-footer").length > 0) {
            verticalPosRef += controller.find(".km-footer").height();
        }

        // Adiciona a posição ao estilo
        style += " bottom: " + verticalPosRef + "px !important";

        // Adiciona o estilo        
        controller.find(".km-header").find(".list-up-div").attr("style", style);
    }

    // Configura posição inicial da scroller
    var lastScroll = 0;

    // Recupera scroller da janela atual
    controller.scroller = controller.view.scroller;

    // Configura ação do scroller
    if (typeof controller.view.scroller !== "undefined") {
        var goTop = function () {
            // Posiciona no topo
            controller.scroller.scrollTo(0, 0);

            // Atualiza dados da lista (quando existir)
            if (controller.listView && typeof controller.listView["refresh"] === "function") {
                controller.listView.refresh();
            } else if (controller.ds) {
                controller.ds.data([]);
                controller.ds.read();
            }

            // Remove o botão
            controller.find(".km-header").find(".list-up-div").hide();
        };

        var listenerScroll = function (e) {
            var scroll = e.scrollTop;
            controller.find(".km-header").find(".list-up-div").show();
            lastScroll = scroll;
        };

        var listenerScrollEnd = function (e) {
            setTimeout(function () {
                controller.find(".km-header").find(".list-up-div").hide();
            }, 7000);
        };

        controller.find(".km-header").find(".list-up-button").unbind("click", goTop).bind("click", goTop);
        controller.scroller.unbind("scroll", listenerScroll).bind("scroll", listenerScroll);
        controller.scroller.unbind("scrollEnd", listenerScrollEnd).bind("scrollEnd", listenerScrollEnd);
    }

    var continueExec = function() {
        if (typeof controller.viewShow === "function") {
            try {
                controller.viewShow(e);
            } catch (ex) {
                handleException(ex);
            }
        }

        // setup save button if present
        var saveButton = controller.find(".save-button");
        if (saveButton.size() > 0) {
            saveButton.data("kendoMobileButton").unbind("click").bind("click", GDF.viewSave.bind(controller));
        }

        // auto scroll to top if applies
        if (controller.autoScrollToTop && (typeof controller.shouldRefresh === "undefined" || controller.shouldRefresh)) {
            scrollListViewToTop(e.view.element.find("[data-role=listview]"));
        }
    };

    if (!controller.shouldRefresh) {
        continueExec();
        return;
    }

    // Configura campos que possuem data, com a data atual
    if (controller.view !== undefined && controller.view["element"] !== undefined) {
        var listDate = controller.view.element.find("input[class=date]");
        if (listDate) {
            listDate.each(function (idx, elem) {
                controller[elem.id] = new Date();
                controller[elem.id].setHours(0, 0, 0, 0);
                $(elem).val(GDF.util.formatDate(controller[elem.id], GDF.util.getDateFormat()));
                if (elem.attributes["currentmaxdate"]) {
                    $(elem).mobiscroll("option", "maxDate", controller[elem.id]);
                }
            });
        }
    }

     // START - DYNAMIC FIELDS -------------
    // Verify if exist a query to configure dynimic fields
    if (typeof controller.queryDynamicFields !== "string") {
        continueExec();
        return;
    }

    // Get parameters of query above
    var params = controller.paramsDynamicFields ? controller.paramsDynamicFields : [];
    GDF.util.createDynamicFields(controller.queryDynamicFields, params, continueExec);
    // END - DYNAMIC FIELDS -------------
};

GDF.viewAfterShow = function(e) {
    GDF.isTransitioningView = false;

    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    clearTimeout(GDF._viewAfterShowSetupTimeout);

    GDF._viewAfterShowSetupTimeout = setTimeout(function () {
        GDF.viewFix(controllerName);
        GDF._viewAfterShowSetupTimeout = setTimeout(function() {
            GDF.viewFix(controllerName);
        }, 250);
    }, 250);

    if (controller.shouldRefresh) {
        controller.varsInit = null;

        // Posiciona a página no topo
        controller.find(".km-scroll-container").css("-webkit-transform", "");
    }

    if (controller.checkVarsBeforeClose && !controller.varsInit) {
        controller.updateVarsInit();
    }

    if (typeof controller.viewAfterShow === "function") {
        try {
            controller.viewAfterShow(e);
        } catch (ex) {
            handleException(ex);
        }
    }

    if (controller.requiredFieldClicked) {
        if (!controller.shouldRefresh) {
            GDF.util.requiredFields(controller, true, controller.requiredFieldsCount);
        }
    }

    if (controller.shouldRefresh) {
        controller.shouldRefresh = false;
    }
};

GDF.viewBeforeHide = function(e) {
    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    if (typeof controller.viewBeforeHide === "function") {
        try {
            controller.viewBeforeHide(e);
        } catch (ex) {
            handleException(ex);
        }
    }
};

GDF.viewHide = function(e) {
    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    if (typeof controller.viewHide === "function") {
        try {
            controller.viewHide(e);
        } catch (ex) {
            handleException(ex);
        }
    }
};

GDF.viewTransitionStart = function(e) {
    if (!e || !e.view || !e.view.element) {
        return;
    }

    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    if (!controller) {
        return;
    }

    if (typeof controller.viewTransitionStart === "function") {
        try {
            controller.viewTransitionStart(e);
        } catch (ex) {
            handleException(ex);
        }
    }
};

GDF.viewTransitionEnd = function(e) {
    if (!e || !e.view || !e.view.element) {
        return;
    }

    var controllerName = e.view.element[0].id;
    var controller = GDF.controllers[controllerName];

    if (!controller) {
        return;
    }

    if (typeof controller.viewTransitionEnd === "function") {
        try {
            controller.viewTransitionEnd(e);
        } catch (ex) {
            handleException(ex);
        }
    }
};

// 'this' should be the controller
GDF.viewSave = function() {
    var self = this;

    if (typeof self.save !== "function") {
        return;
    }

    var didCallSave = false;

    var callSave = function () {
        GDF.blockApp(GDF.strings.savingData);

        if (didCallSave) {
            GDF.unblockApp();
            return;
        }

        didCallSave = true;

        self._forceViewChange = true;

        try {
            var success = function (callback) {
                if (typeof callback === "function") {
                    callback();
                } else {
                    GDF.unblockApp();
                    if (typeof GDF.util.checkEntries === "function") {
                        GDF.util.checkEntries();
                    }
                }
            }

            var error = function (callback) {
                if (typeof callback === "function") {
                    callback();
                } else if (typeof callback === "string") {
                    GDF.unblockApp();
                    GDF.messageBox(callback);
                }
            }

            if (self.save.length > 0) {
                self.save(success, error);
            } else {
                self.save();
                GDF.unblockApp();
            }
        } catch (ex) {
            GDF.unblockApp();
            handleException(ex);
            self._forceViewChange = false;
        }
    };

    if (typeof self.validate === "function") {
        GDF.blockApp(GDF.strings.validatingData);

        var result = self.validate(function(result) {
            if (result) {
                callSave();
            } else {
                GDF.unblockApp();
            }
        });

        if (result === true) {
            callSave();
        } else if (result === false) {
            GDF.unblockApp();
        }
    } else {
        callSave();
    }
};

GDF.viewFix = function(controllerName) {
    $("[data-role=view]#" + controllerName).css({
        "z-index": 1,
        "display": "",
        "-webkit-transform": ""
    });
    $("[data-role=view]:not(#" + controllerName + ")").css({
        "z-index": 0,
        "display": "none",
        "-webkit-transform": "translate3d(0, 0, 0) scale(1)"
    });
};

GDF.modalInit = function(e) {
    GDF.lang.translate(e.sender.element);
    GDF.ui.convertSVGImages(e.sender.element);

    var controller = GDF.util.getController();
    if (!controller) {
        return;
    }

    if (typeof controller.modalInit === "function") {
        try {
            controller.modalInit(e);
        } catch (ex) {
            handleException(ex);
        }
    }
};

GDF.modalClose = function(e) {
    var controller = GDF.util.getController();

    if (!controller) {
        return;
    }

    if (typeof controller.modalClose === "function") {
        try {
            controller.modalClose(e);
        } catch (ex) {
            handleException(ex);
        }
    }
};

GDF.html = "";

GDF.html += "<div data-role=\"view\"></div>";

// LOOKUP -----------------------------------------------------------------
GDF.html += "<div data-role=\"view\" data-before-show=\"GDF.viewBeforeShow\" id=\"lookup\" data-layout=\"lookup-list\">";
GDF.html += "    <ul id=\"list-lookup\"></ul>";
GDF.html += "</div>";

GDF.html += "<div data-role=\"layout\" data-id=\"lookup-list\">";
GDF.html += "    <header data-role=\"header\">";
GDF.html += "        <div data-role=\"navbar\">";
GDF.html += "            <a data-role=\"backbutton\" data-align=\"left\" data-icon=\"left-arrow\" class=\"close-button\"></a>";
GDF.html += "            <span data-role=\"view-title\"></span>";
GDF.html += "            <a data-role=\"button\" data-align=\"right\" data-icon=\"save\" class=\"save-button\"></a>";
GDF.html += "        </div>";
GDF.html += "    </header>";
GDF.html += "    <footer class=\"select-footer\" data-role=\"footer\">";
GDF.html += "        <div data-role=\"navbar\">";
GDF.html += "           <a data-role=\"button\" style=\"width: 90%\" class=\"select-button\"></a>";
GDF.html += "        </div>";
GDF.html += "     </footer>";
GDF.html += "</div>";

// IMAGE VIEWER -----------------------------------------------------------------
GDF.html += "<div data-role=\"view\" data-before-show=\"GDF.viewBeforeShow\" id=\"imageviewer\" data-layout=\"closable-content\" data-zoom=\"true\">";
GDF.html += "    <img src=\"#\" data-role=\"touch\" data-tap=\"GDF.controllers.imageviewer.tapPicture\" id=\"imageviewer-picture\" />";
GDF.html += "</div>";

// MESSAGEBOX -----------------------------------------------------------------
GDF.html += "<div data-role=\"modalview\" id=\"messagebox\" data-id=\"messagebox-modal-view\" style=\"height: 100%; width: 90%; max-width: 320pt; z-index: 2000;\">";
GDF.html += "    <div data-role=\"navbar\"></div>";
GDF.html += "    <p id='message-box-content' style=\"text-align:center\"></p>";
GDF.html += "    <div class=\"messagebox-button-bar\" data-role=\"footer\">";
GDF.html += "        <div style=\"z-index=2000\" data-role=\"button\" data-action=\"ok\" data-lang=\"ok\"></div>";
GDF.html += "        <div style=\"z-index=2000\" data-role=\"button\" data-action=\"yes\" data-lang=\"yes\"></div>";
GDF.html += "        <div style=\"z-index=2000\" data-role=\"button\" data-action=\"no\" data-lang=\"no\"></div>";
GDF.html += "        <div style=\"z-index=2000\" data-role=\"button\" data-action=\"cancel\" data-lang=\"cancel\"></div>";
GDF.html += "        <div style=\"z-index=2000\" data-role=\"button\" data-action=\"close\" data-icon=\"close-button\"></div>";
GDF.html += "    </div>";
GDF.html += "</div>";

GDF.settings = {
    bindProperties: function() {
        for (var o in this) {
            if (o === "bindProperties" || o === "add") {
                continue;
            }

            this.add(o, this[o]);
        }
    },

    add: function(properties, defaultValue) {
        var self = this;

        var addProperty = function(propertyName, propertyDefaultValue) {
            var privatePropertyName = "_" + propertyName;
            var localObj = window.localStorage.getObj(propertyName);

            if (typeof propertyDefaultValue === "undefined" || (localObj !== null && typeof localObj !== "undefined")) {
                self[privatePropertyName] = localObj;
            } else {
                self[privatePropertyName] = propertyDefaultValue;
            }

            if (Object.prototype.hasOwnProperty.call(self, propertyName)) {
                return;
            }

            Object.defineProperty(self, propertyName, {
                get: function() {
                    return self[privatePropertyName];
                },
                set: function(v) {
                    self[privatePropertyName] = v;
                    window.localStorage.setObj(propertyName, v);
                }
            });
        };

        if (typeof properties === "string") {
            if (typeof defaultValue !== "undefined") {
                addProperty(properties, defaultValue);
            }

            return;
        }

        for (var o in properties) {
            addProperty(o, properties[o]);
        }
    }
};

GDF.appTitle = "";
GDF.appVersion = "1.0.0";
GDF.enableAppColor = true;

GDF.defaultExternalTimeout = 180000;

GDF.rootViews.push("login");

GDF.menuItems.push({
    lang: "logout",
    controller: "login"
});

GDF.menuHeaderHtml = "";
GDF.menuHeaderHtml += "<span id=\"username-container\">";
GDF.menuHeaderHtml += "    <span id=\"username-label\" data-lang=\"user\"></span>";
GDF.menuHeaderHtml += "    <span id=\"username-value\"></span>";
GDF.menuHeaderHtml += "</span>";

GDF.settings.add({
    // DADOS DE SINCRONIA
    lastSyncDate: undefined,

    // STATUS DE INICIALIZA��O DO APP e DE SINCRONIA
    AppStatus: 0,
    SyncStatus: 0,

    // LOGIN INFO
    isLogged: false,
    isMaster: false,
    loggedUser: "",

    // DEVELOPER SETTINGS
    isDeveloper: false,
    localWebAPI: "",
    deviceIdDev: "200185",

    // CHAVE DO APP
    generatedDeviceKey: "",

    // OUTROS
    appLanguage: "pt-BR",
    writeLog: false,
    forceTablet: false,

    // CORES PADR�ES
    color: "black",
    colorRange: "000000",
    appColor1: "F4F4F4",
    appColor2: "FCFCFC",
    appColor3: "DBDBDB",
    rangeVal: 50,

    //Para configurar se vai auterar a visualiza��o conforme posi��o do dispositivo
    orientation: "auto",

    // Para configurar se ir� ou n�o limpar o cache AGPS
    cleanAgps: true,

    // Indica se est� utilizando ou n�o recurso do mapa geojson
    hasMap: false
});

GDF.enums = {};

GDF.enums.DeviceOs = {
    iOS: 0,
    WindowsPhone: 1,
    Android: 2,
    WindowsMobile: 3
};

GDF.enums.SyncType = {
    DownloadOnly: 0,
    UploadOnly: 1,
    SyncAll: 2
};

GDF.enums.SyncStatus = {
    Stateless: 0,
    Pending: 1,
    Complete: 2
};

GDF.enums.AppStatus = {
    Stateless: 0,
    Opened: 1,
    Closed: 2
};

GDF.enums.AutomaticD4 = {
    Automatic: 1,
    NoAutomatic: 0
};

GDF.enums.Status = {
    Opened: 0,
    Closed: 1,
    Syncronized: 2
};

GDF.enums.InitialConfig = {
    Welcome: 0,
    SetDesc: 1,
    SetURI: 2,
    DeviceInfo: 3,
};

GDF.enums.FileMode = {
    Read: 0,
    Write: 1
};

GDF.enums.Toast = {
    Short: 0,
    Long: 1,
};

GDF.ui = {
    touchHoldStartEvents: "",
    touchHoldCancelEvents: "",
    touchHoldHrefSafetyEvents: "",

    startTouchHold: function(e) {
        var thisEl = $(this);

        var timer = setTimeout(function () {
            $(document).off(GDF.ui.touchHoldCancelEvents, GDF.ui.cancelTouchHold);

            var href = thisEl.attr("href");

            if (href) {
                thisEl.removeAttr("href");
                thisEl.data("temp-href", href);
            }

            var callback = thisEl.data("touchHoldCallback");

            if (callback) {
                callback.call(thisEl);
            }
        }, thisEl.data("touchHoldTimeout"));

        thisEl.data("touchHoldTimer", timer);
        thisEl.off(GDF.ui.touchHoldCancelEvents, GDF.ui.cancelTouchHold).on(GDF.ui.touchHoldCancelEvents, GDF.ui.cancelTouchHold);

        //return false;
    },

    cancelTouchHold: function(e) {
        var thisEl = $(this);
        var timer = thisEl.data("touchHoldTimer");

        clearTimeout(timer);

        thisEl.off(GDF.ui.touchHoldCancelEvents, GDF.ui.cancelTouchHold);
    },

    touchHoldHrefSafe: function(e) {
        var thisEl = $(this);
        var href = thisEl.data("temp-href");

        if (href) {
            setTimeout(function() {
                thisEl.attr("href", href);
                thisEl.data("temp-href", false);
            }, 0);
        }
    },
    
    configureFixedHeaderTouch: function(controller) {
        controller.find(".km-scroll-header").kendoTouch({
            hold: this._holdScrollHeader,
            tap: this._tapScrollHeader
        });
    },

    _holdScrollHeader: function(e) {
        var originalThis = this;

        $(e.event.target).closest("[data-hold]", $(e.sender.element)).each(function () {
            var thisEl = $(this);
            var func = eval(thisEl.data("hold"));

            if (typeof func === "function") {
                func.call(originalThis, {
                    sender: {
                        element: thisEl
                    },
                    touch: e.touch,
                    event: e.event
                });
            }
        });
    },

    _tapScrollHeader: function(e) {
        var originalThis = this;

        $(e.event.target).closest("[data-tap], [data-click]", $(e.sender.element)).each(function () {
            var thisEl = $(this);
            var func = eval(thisEl.data("tap") || thisEl.data("click"));

            if (typeof func === "function") {
                func.call(originalThis, {
                    sender: {
                        element: thisEl
                    },
                    touch: e.touch,
                    event: e.event
                });
            }
        });
    },

    setupLayout: function() {
        if (Modernizr.touch) {
            this.touchHoldStartEvents = "touchstart";
            this.touchHoldCancelEvents = "touchmove touchcancel touchend click";
            this.touchHoldHrefSafetyEvents = "touchend touchcancel";
        } else {
            this.touchHoldStartEvents = "mousedown";
            this.touchHoldCancelEvents = "mousemove mouseup click";
            this.touchHoldHrefSafetyEvents = "mouseup";
        }

        // implement longpress/touchhold
        (function($) {
            $.fn.touchHold = function(callback, timeout) {
                var thisEl = $(this);
                var previousCallback = thisEl.data("touchHoldCallback");

                timeout = timeout || 600;
                thisEl.data("touchHoldCallback", callback);
                thisEl.data("touchHoldTimeout", timeout);

                if (typeof previousCallback === "undefined") {
                    thisEl.on(GDF.ui.touchHoldStartEvents, GDF.ui.startTouchHold);
                    thisEl.on(GDF.ui.touchHoldHrefSafetyEvents, GDF.ui.touchHoldHrefSafe);
                }
            };

            $.fn.cancelTouchHold = function(callback) {
                var thisEl = $(this);
                var timer = thisEl.data("touchHoldTimer");

                clearTimeout(timer);

                thisEl.data("touchHoldCallback", null);
                thisEl.data("touchHoldTimeout", 0);
                thisEl.data("touchHoldTimer", 0);
                thisEl.off(GDF.ui.touchHoldStartEvents, GDF.ui.startTouchHold);
                thisEl.off(GDF.ui.touchHoldHrefSafetyEvents, GDF.ui.touchHoldHrefSafe);
                thisEl.off(GDF.ui.touchHoldCancelEvents, GDF.ui.cancelTouchHold);
            };
        })(jQuery);

        this.convertSVGImages($("#main-menu"));
    },

    convertSVGImages: function(el) {
        if (Modernizr.svg) {
            this.convertSVGImagesToInline(el);
        } else {
            this.convertSVGImagesToCanvas(el);
        } // Fix for Android 2.x (SVG -> Canvas)
    },

    convertSVGImagesToCanvas: function(el) {
        var targets = el.find("img[src$='.svg']");

        targets.each(function () {
            var thisEl = $(this);

            //Create a canvas
            var canvas = document.createElement("canvas");
            $(canvas)
                .prop("width", thisEl.width())
                .prop("height", thisEl.height())
                .css({
                    height: thisEl.height(),
                    width: thisEl.width()
                });

            //Convert the SVG to canvas
            canvg(canvas, thisEl.attr("src"), {
                scaleWidth: thisEl.width(),
                scaleHeight: thisEl.height(),
                ignoreDimensions: true,
                ignoreMouse: true
            });

            //Replace the SVG with the canvas rendering
            thisEl.after(canvas);
            thisEl.remove();
        });
    },

    convertSVGImagesToInline: function(el) {
        // The following code was modified from:
        // https://github.com/visualblack/svgger
        var targets = el.find("img[src$='.svg']").hide();

        targets.each(function (i, item) {
            var _this = this;
            return $.get(_this.src).success(function(data) {
                var $svg, a, nName, nValue, _attr, _i, _len;

                $svg = $(data).find("svg");

                if ($svg.size() === 0) {
                    $svg = $(data).filter(function(i, node) {
                        return node.nodeType === 1 && node.tagName === "svg";
                    });
                }

                _attr = _this.attributes;

                $.extend(_attr, $svg[0].attributes);

                for (_i = 0, _len = _attr.length; _i < _len; _i++) {
                    a = _attr[_i];

                    nName = a.nodeName;
                    nValue = a.nodeValue;

                    if (nName !== "src" && nName !== "style") {
                        $svg.attr(nName, nValue);
                    }
                }

                return $(_this).replaceWith($svg);
            });
        });
    }
};

GDF.lang = {
    supported: {
        en: {
            basic: "en-US",
            kendo: "en-US",
            mobiscroll: ""
        },
        pt: {
            basic: "pt-BR",
            kendo: "pt-BR",
            mobiscroll: "pt-BR"
        }
    },

    mobiscrollCulture: "",

    loadTranslateScripts: function () {
        var detectedLang;
        
        if (typeof navigator !== "undefined" && navigator.userAgent && (detectedLang = navigator.userAgent.match(/android.*\W([a-z]{2}])-([a-z]{2})\W/i))) {
            detectedLang = detectedLang[1];
        }

        if (!detectedLang && typeof navigator !== "undefined") {
            if (navigator.language) {
                detectedLang = navigator.language;
            } else if (navigator.browserLanguage) {
                detectedLang = navigator.browserLanguage;
            } else if (navigator.systemLanguage) {
                detectedLang = navigator.systemLanguage;
            } else if (navigator.userLanguage) {
                detectedLang = navigator.userLanguage;
            }
        }

        var userLanguage = detectedLang;
        var appLanguage = GDF.settings.appLanguage;

        if (appLanguage && appLanguage !== "" && appLanguage !== "auto") {
            userLanguage = appLanguage;
        }

        if (!userLanguage) {
            userLanguage = "en-US";
        }

        var userLanguageParts = userLanguage.split("-");
        var culture = userLanguageParts[0].toLowerCase();
        var cultureCountry = "";

        userLanguage = culture;

        if (userLanguageParts.length > 1) {
            cultureCountry = userLanguageParts[1].toUpperCase();
            userLanguage += "-" + cultureCountry;
        }

        var kendoCulture = userLanguage;
        var mobiscrollCulture = userLanguage;
        if (mobiscrollCulture === "pt") {
            mobiscrollCulture = "pt-BR";
        }

        if (!fileExists(this.kendoCultureScriptPath(kendoCulture))) {
            kendoCulture = culture;
            if (kendoCulture !== userLanguage && !fileExists(this.kendoCultureScriptPath(kendoCulture))) {
                var defaultKendoCulture = this.supported[culture].kendo;
                if (typeof defaultKendoCulture !== "undefined") {
                    kendoCulture = defaultKendoCulture;
                }
            } else {
                kendoCulture = "";
            }
        }

        if (mobiscrollCulture !== "en-US" && mobiscrollCulture !== "en" && !fileExists(this.mobiscrollCultureScriptPath(mobiscrollCulture))) {
            mobiscrollCulture = culture;
            if (mobiscrollCulture !== userLanguage && !fileExists(this.mobiscrollCultureScriptPath(mobiscrollCulture))) {
                var defaultMobiscrollCulture = this.supported[culture].mobiscroll;
                if (typeof defaultMobiscrollCulture !== "undefined") {
                    mobiscrollCulture = defaultMobiscrollCulture;
                }
            } else {
                mobiscrollCulture = "";
            }
        } else if (mobiscrollCulture === "en-US" || mobiscrollCulture === "en") {
            mobiscrollCulture = "";
        }

        var kendoCultureFilePath = this.kendoCultureScriptPath(kendoCulture);
        var mobiscrollCultureFilePath = this.mobiscrollCultureScriptPath(mobiscrollCulture);
        var mainCultureFilePath = this.mainCultureScriptPath(culture);
        var appCultureFilePath = this.appCultureScriptPath(culture);

        if (kendoCulture !== "" && fileExists(kendoCultureFilePath)) {
            GDF.loadScript(kendoCultureFilePath);
            kendo.culture(kendoCulture);
        }

        if (mobiscrollCulture !== "" && fileExists(mobiscrollCultureFilePath)) {
            GDF.loadScript(mobiscrollCultureFilePath);
            this.mobiscrollCulture = mobiscrollCulture;
        }

        this.loadStrings("main", "en", this.mainCultureScriptPath("en"), true);
        this.loadStrings("app", "en", this.appCultureScriptPath("en"), true);

        if (culture !== "" && culture !== "en") {
            this.loadStrings("main", culture, mainCultureFilePath);
            this.loadStrings("app", culture, appCultureFilePath);
        }
    },

    loadStrings: function(type, culture, scriptPath, forceLoad) {
        if (typeof GDF.strings === "undefined") {
            GDF.strings = {};
        }

        if (typeof GDF._strings === "undefined") {
            GDF._strings = {};
        }

        if (typeof GDF._strings[type] === "undefined") {
            GDF._strings[type] = {};
        }

        if (!GDF._strings[type][culture]) {
            if (forceLoad || fileExists(scriptPath)) {
                GDF.loadScript(scriptPath);
                if (typeof GDFtemp !== "undefined") {
                    GDF._strings[type][culture] = GDFtemp;
                }
                GDFtemp = undefined;
            }
        }

        $.extend(GDF.strings, GDF._strings[type][culture] || {});
    },

    translate: function(element) {
        $(element).find("[data-lang], [data-lang-prop], [data-lang-placeholder], [data-lang-alt]").each(function() {
            var thisEl = $(this);
            var langKey = thisEl.data("lang");

            if (langKey && typeof GDF.strings[langKey] === "string") {
                thisEl.html(GDF.strings[langKey]);
            }

            var propLangKey = thisEl.data("lang-prop");
            if (propLangKey && typeof GDF.strings[propLangKey] === "string") {
                // TODO: allow many properties to be translated
                var propName = thisEl.data("lang-prop-name");
                if (propName) {
                    thisEl.prop(propName, GDF.strings[propLangKey]);
                }
            }

            var placeHolderLangKey = thisEl.data("lang-placeholder");
            if (placeHolderLangKey && typeof GDF.strings[placeHolderLangKey] === "string") {
                thisEl.prop("placeholder", GDF.strings[placeHolderLangKey]);
            }

            var altLangKey = thisEl.data("lang-alt");
            if (altLangKey && typeof GDF.strings[altLangKey] === "string") {
                thisEl.prop("alt", GDF.strings[altLangKey]);
            }
        });

        $(element).find("[data-lang-content]").each(function () {
            GDF.lang.translateContent($(this));
        });
    },

    translateContent: function(element) {
        $.each($(element).contents(), function(index, node) {
            if (node.nodeType === 3) {
                var nodeValue = node.nodeValue;
                var matches = nodeValue.match(/\$\{[a-z]+\}/gi);

                if (matches) {
                    for (var i = 0; i < matches.length; i++) {
                        var match = matches[i];
                        var langKey = match.substr(2, match.length - 3);
                        var langString = GDF.strings[langKey];
                        if (langString) {
                            node.nodeValue = nodeValue.replace(match, langString);
                        }
                    }
                }
            }

            if (node.nodeType === 1) {
                GDF.lang.translateContent($(node));
            }
        });
    },

    translateViewTitle: function(e) {
        var navbar = e.view.element.find("[data-role=navbar]:first").data("kendoMobileNavBar");
        var controllerName = e.view.element[0].id;
        var translatedTitle;

        if (e.view.params.id) {
            translatedTitle = GDF.strings[controllerName.replace("new", "edit")];
        }

        if (!translatedTitle) {
            translatedTitle = GDF.strings["title" + controllerName.capitalize()];
        }

        if (!translatedTitle) {
            translatedTitle = GDF.strings[controllerName];
        }

        if (navbar && translatedTitle) {
            navbar.title(translatedTitle);
        }
    },

    kendoCultureScriptPath: function(culture) {
        return "gdf/scripts/libs/kendo/js/cultures/kendo.culture." + culture + ".min.js";
    },

    mobiscrollCultureScriptPath: function(culture) {
        return "gdf/scripts/libs/mobiscroll/js/i18n/mobiscroll.i18n." + culture + ".js";
    },

    mainCultureScriptPath: function(culture) {
        return "gdf/scripts/cultures/" + culture + ".js";
    },

    appCultureScriptPath: function(culture) {
        return "app/scripts/cultures/" + culture + ".js";
    },

    connectionErrorMessage: function(statusCode, textStatus) {
        if (textStatus === "timeout") {
            return GDF.strings.errorMessageTimeout;
        }

        if (textStatus === "parsererror") {
            return GDF.strings.errorMessageParserError;
        }

        if (statusCode === 0) {
            return GDF.strings.errorMessageConnection;
        } else if (statusCode === 401) {
            return GDF.strings.errorMessageUnauthorized;
        } else if (statusCode === 403) {
            return GDF.strings.errorMessageForbidden;
        } else if (statusCode === 404) {
            return GDF.strings.errorMessageNotFound;
        } else if (statusCode === 500) {
            return GDF.strings.errorMessageServer;
        }

        return GDF.strings.generalRequestError;
    }
};

function dbQuery(db) {
    if (!(this instanceof arguments.callee)) {
        return new arguments.callee(db);
    }

    this.connection = null;

    this.setDatabase(db);
};

dbQuery.prototype.setDatabase = function (db) {
    if (!db) {
        return;
    }

    var params = db.storageProvider.connection._connectionParams;

    this.connection = window.openDatabase(params.fileName, params.version, params.displayName, params.maxSize);
};

dbQuery.prototype.query = function (sql, params, successFunction, failFunction) {
    if (typeof successFunction !== "function") {
        successFunction = null;
    }

    if (typeof failFunction !== "function") {
        failFunction = null;
    }

    if (!this.connection) {
        if (failFunction) {
            failFunction.apply(null, new Error("No database available!"));
        }

        return;
    }

    var paramsType = typeof params;
    if (paramsType === "undefined") {
        params = [];
    } else if (paramsType === "object") {
        var newParams = [];
        for (var p in params) {
            newParams.push(params[p]);
        }
        params = newParams;
    } else if (!$.isArray(params)) {
        params = [params];
    }

    var self = this;

    this.connection.transaction(function (transaction) {
        transaction.executeSql(sql, params, function (transaction, result) {
            if (successFunction) {
                successFunction.apply(null, self._parseResult(result));
            }
        }, function (transaction, error) {
            var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message + "\nSQL Query : " + sql + "\nParameters: " + params;
            if (failFunction) {
                failFunction.apply(null, error);
            }

            if (console) {
                console.error(errorMessage);
            }
        });
    });
};

dbQuery.prototype.transaction = function (success, fail) {
    if (!this.connection) {
        if (fail) {
            fail.apply(null, new Error("No database available!"));
        }
        return;
    }

    return this.connection.transaction(function (transaction) {
        success(transaction);
    });
};

dbQuery.prototype.updateDatabase = function (data, success, fail) {
    var self = this;

    if (!self.connection) {
        if (typeof fail === "function") {
            fail("No database available!");
        }
        return;
    }

    var internalError = function (tx, error) {
        var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message;

        if (console) {
            console.error(errorMessage);
        }

        if (typeof fail === "function") {
            fail(errorMessage);
        }
    }

    // Recupera nomes das tabelas
    var tables = [];
    GDF.db.onReady(function (db) {
        var tablename;
        $.each(data, function (jtable) {
            var table = db[jtable];

            if (typeof table !== "undefined") {
                tablename = table.elementType.name;
            } else {
                tablename = jtable;
            }

            var entityset = db.getEntitySetFromElementType(tablename);
            if (typeof entityset === "undefined") {
                return true;
            }

            // Configura objetos que estarão no array
            var tname = entityset.name;
            var fname = entityset[tablename].getFieldNames();

            // Só recupera columnas que não forem chave
            var columns =
                fname
                    .map(function (column) {
                        var prop = entityset[tablename].getMemberDefinition(column);
                        return {
                            name: (typeof prop["computed"] === "undefined" || !prop["computed"]) ? prop.name : "internalkey123",
                            type: (typeof prop.originalType !== "function") ? prop.originalType : prop.dataType.name
                        };
                    })
                    .filter(function (column) {
                        return column.name !== "internalkey123";
                    });

            tables.push({ entity: jtable, tablename: tname, columns: columns });
        });
    });

    // Se não recuperou nenhum nome aborta processo
    if (tables.length == 0) {
        if (typeof success === "function") {
            success();
        }
    }

    var i = 0;
    var start = function () {
        if (i === (tables.length)) {
            if (typeof success === "function") {
                success();
                return;
            }
        }

        // Incrementa i para recuperar proximo
        var j = i++;
        var jtable = tables[j].entity;
        var columns = tables[j].columns;
        var table = tables[j].tablename;

        self.connection.transaction(function (tx) {
            var doInsert = function () {
                // Recupera entidade
                var tdata = data[jtable];

                // Se não encontrou dados, aborta o processo
                if (typeof tdata === "undefined" || tdata === null || (Array.isArray(tdata) && tdata.length === 0)) {
                    start();
                    return;
                }

                // Recupera propridades da entidade
                var aux = Object.keys(tdata[0]);

                // Converte o array de propriedades para maiuscula
                aux = aux.map(function (x) {
                    return x.toUpperCase();
                });

                // Só utilizar a propriedades que estão definidas na estrutura da base mobile
                var props = columns.filter(function (elem) {
                    return aux.indexOf(elem.name.toUpperCase()) !== -1;
                });

                var fields = props.map(function (column) {
                    return column.name;
                }).join(",");

                // Configura parâmetros
                var fparams = props.map(function () {
                    return "?";
                });

                var iquery = "INSERT INTO " + table + " ( " + fields + ") VALUES (" + fparams + ")";

                var params;
                var value;
                tdata.forEach(function (row) {
                    params = [];
                    props.forEach(function (column) {
                        if (column.type.toUpperCase() === "DATE" || column.type.toUpperCase() === "DATETIME") {
                            value = new Date(row[column.name]).getTime();
                            if (value == "" || value == "0") {
                                value = null;
                            }
                        } else {
                            value = row[column.name];
                        }

                        params.push(value);
                    });

                    tx.executeSql(iquery, params, null, internalError);
                });

                start();
            };

            var doUpdate = function () {
                var uquery = "UPDATE sqlite_sequence SET seq = 0 WHERE name = '{0}'".format(table);
                tx.executeSql(uquery, [], doInsert, internalError);
            };

            var doDelete = function () {
                var dquery = "DELETE FROM " + table;
                tx.executeSql(dquery, [], doUpdate, internalError);
            };

            // Inicia processo de atualização
            doDelete();
        }, internalError);
    };

    start();
}

dbQuery.prototype.multipleInsert = function (table, columns, values, deleteFirst, success, fail) {
    var self = this;

    if (!self.connection) {
        if (typeof fail === "function") {
            fail("No database available!");
        }
        return;
    }

    var internalError = function (tx, error) {
        var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message;

        if (console) {
            console.error(errorMessage);
        }

        if (typeof fail === "function") {
            fail(errorMessage);
        }
    };

    var start = function () {
        // Ajusta colunas que receberão os dados
        var fields = columns.join(",");

        // Configura parâmetros
        var fparams = columns.map(function () {
            return "?";
        });

        self.connection.transaction(function (tx) {
            var doInsert = function () {
                // Só continua caso exista registro a serem inseridos
                if (values.length > 0) {
                    var iquery = "INSERT INTO " + table + " ( " + fields + ") VALUES (" + fparams + ")";

                    var params;
                    $.each(values, function (idx, val) {
                        params = [];

                        val.forEach(function (value) {
                            params.push(value);
                        });

                        tx.executeSql(iquery, params, function () {
                            if (typeof success == "function" && idx === values.length - 1) {
                                success();
                            }
                        }, internalError);
                    });
                } else {
                    if (typeof success === "function") {
                        success();
                    }
                }
            };

            var doDelete = function () {
                var dquery = "DELETE FROM " + table;
                tx.executeSql(dquery, [], doInsert, internalError);
            };

            // Inicia processo de atualização
            if (deleteFirst) {
                doDelete();
            } else {
                doInsert();
            }
        }, internalError);
    };

    if (values.length > 0 || deleteFirst) {
        start();
    } else {
        if (typeof success === "function") {
            success()
        }
    }
};

dbQuery.prototype.multipleUpdate = function (table, columns, values, keys, keysvalues, updateId, success, fail) {
    var self = this;

    if (!self.connection) {
        if (typeof fail === "function") {
            fail("No database available!");
        }
        return;
    }

    var internalError = function (tx, error) {
        var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message;

        if (console) {
            console.error(errorMessage);
        }

        if (typeof fail === "function") {
            fail(errorMessage);
        }
    };

    var start = function () {
        // Configura campos a serem atualizados
        var fields;
        var index = -1;
        if (updateId) {
            fields = columns;
        } else {
            fields = columns.filter(function (x) {
                return x.toUpperCase() != "ID";
            });

            // Recupera idx do Id
            $.each(columns, function (idx, elem) {
                if (elem.toUpperCase() == "ID") {
                    index = idx;
                    return false;
                }
            });
        }

        // Configura campos a serem atualizados
        fields = fields.map(function (x) {
            return (x + " = ? ");
        }).join(", ");

        // Configura chave do registro Ã  ser atualizado
        var conditions = keys.map(function (x) {
            return (x + " = ? ");
        }).join(" AND ");

        self.connection.transaction(function (tx) {
            var doUpdate = function () {
                var uquery = "UPDATE " + table + " SET " + fields + " WHERE " + conditions;

                var params;
                $.each(values, function (idx, val) {
                    params = [];

                    // Inclui parÃ¢metros das colunas que irÃ£o ser alteradas
                    $.each(val, function (idx, value) {
                        if (index > -1 && idx == index) {
                            return true;
                        }
                        params.push(value);
                    });

                    // Inclui parÃ¢metros das chaves
                    keysvalues[idx].forEach(function (value) {
                        params.push(value);
                    });

                    tx.executeSql(uquery, params, function () {
                        if (typeof success == "function" && idx === values.length - 1) {
                            success();
                        }
                    }, internalError);
                });
            };

            doUpdate();
        }, internalError);
    };

    start();
};

dbQuery.prototype.multipleDelete = function (table, keys, keysvalues, success, fail) {
    var self = this;

    if (!self.connection) {
        if (typeof fail === "function") {
            fail("No database available!");
        }
        return;
    }

    var internalError = function (tx, error) {
        var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message;

        if (console) {
            console.error(errorMessage);
        }

        if (typeof fail === "function") {
            fail(errorMessage);
        }
    };

    var start = function () {
        // Configura chave do registro Ã  ser excluÃ­do
        var fields = keys.map(function (x) {
            return (x + " = ? ");
        }).join(" AND ");

        self.connection.transaction(function (tx) {
            var doDelete = function () {
                var dquery = "DELETE FROM " + table + " WHERE " + fields;

                var params;
                $.each(keysvalues, function (idx, val) {
                    params = [];

                    val.forEach(function (value) {
                        params.push(value);
                    });

                    tx.executeSql(dquery, params, function () {
                        if (typeof success == "function" && idx === keysvalues.length - 1) {
                            success();
                        }
                    }, internalError);
                });
            };

            doDelete();
        }, internalError);
    };

    start();
};

dbQuery.prototype._parseResult = function (result) {
    var json = [], item = {}, itemTmp = [];

    for (var i = 0; i < result.rows.length; i++) {
        item = {};
        itemTmp = result.rows.item(i);

        for (var key in itemTmp) {
            var theItemTmp = itemTmp[key];
            if (typeof theItemTmp === "undefined" || theItemTmp === null) {
                theItemTmp = "";
            }
            item[key] = theItemTmp.toString();
        }

        json.push(item);
    }

    return [json];
};

dbQuery.prototype.clearTables = function (tables, successFunction, failFunction) {
    if (typeof successFunction !== "function") {
        successFunction = null;
    }

    if (typeof failFunction !== "function") {
        failFunction = null;
    }

    if (!this.connection) {
        if (failFunction) {
            failFunction.apply(null, new Error("No database available!"));
        }

        return;
    }

    if (!tables) {
        return;
    }

    var self = this;

    if (!$.isArray(tables)) {
        tables = [tables.toString()];
    }

    if (tables.length === 0 && successFunction) {
        successFunction();
    }

    GDF.blockApp(true);

    var deletedTableCount = 0;
    var failCount = 0;

    $.each(tables, function (index, table) {
        var deleteQuery = "DELETE FROM " + table;
        self.query(deleteQuery, [], function () {
            self.query("UPDATE sqlite_sequence SET seq = 0 WHERE name = '{0}'".format(table), [], function () {
                deletedTableCount++;
                if (deletedTableCount === tables.length) {
                    //GDF.unblockApp();
                    if (successFunction) {
                        successFunction();
                    }
                }
            });
        }, function () {
            failCount++;
            if (failCount + deletedTableCount === tables.length) {
                GDF.unblockApp();
                if (failFunction) {
                    failFunction.apply(null, new Error("No database available!"));
                }
            }
        });
    });
};

/*
Parâmetros: (string) query - A query a ser executada
            (array) queryParams - [Opcional] Um array com as chaves dos parâmetros que serão utilizados na query vindos do dataSource(parâmetro transport.data)
            (array) queryFilters - [Opcional] Parâmetros a serem filtrados direto na cláusula WHERE. Deve funcionar com o 'serverFiltering: true' no dataSource.
                Exemplos de uso: ["l.CodOs LIKE ?", "l.CodDivi1 = ?"] - O LIKE é tratado dentro da função
            (string) keyField - [Opcional] Campo para pesquisar por código
            (function) start - [Opcional] uma função que será executada antes do início da requisisão
            (function) end - [Opcional] uma função que será executada após receber a resposta da requisisão
            (bool) debug - [Opcional - Padrão: false] O debug printa alguns passos do processo interno
*/
dbQuery.prototype.createKendoDataSource = function (dataSourceOptions, queryOptions) {
    var thisDbQuery = this;

    if (typeof dataSourceOptions !== "object") {
        dataSourceOptions = {};
    }

    if (typeof queryOptions !== "object") {
        queryOptions = {};
    }

    var queryDebug = queryOptions.debug ? function (msg) {
        console.log("Data Source Query Debug: " + msg);
    } : function () { };

    var originalSuccessFunction, originalErrorFunction, originalCompleteFunction;

    if (queryOptions.ajax) {
        originalSuccessFunction = queryOptions.ajax.success;
        originalErrorFunction = queryOptions.ajax.error;
        originalCompleteFunction = queryOptions.ajax.complete;
    } else {
        dataSourceOptions.serverFiltering = true;
    }

    //dataSourceOptions.pageSize = dataSourceOptions.pageSize || 50;
    dataSourceOptions.transport = dataSourceOptions.transport || {};

    var originalRead = dataSourceOptions.transport.read;
    var readFunc = function (readOptions) {
        var self = this;
        var isOriginalReadFunction = typeof originalRead === "function";

        if (!isOriginalReadFunction) {
            GDF.blockApp(true);
        }

        var executeLocalQuery = function () {
            queryDebug("Starting");

            if (queryOptions.start) {
                queryOptions.start();
            }

            var query = queryOptions.query,
                joinParams = queryOptions.joinParams ? [].concat(queryOptions.joinParams) : [],
                queryParams = queryOptions.queryParams ? [].concat(queryOptions.queryParams) : [],
                queryFilters = queryOptions.queryFilters ? [].concat(queryOptions.queryFilters) : [],
                params = [],
                condition = (readOptions.data.filter && readOptions.data.filter.filters[0].value !== ""),
                isCodeSearch = false;

            var i;
            if (condition) {
                var filtro = readOptions.data.filter.filters[0].value;
                isCodeSearch = /^\d+ $/.test(filtro) && queryOptions.keyField;
                // Detecta formato para buscar diretamente pela key. Exemplo: "25 "
                // Necessária especificação de opção 'keyField'
                if (isCodeSearch) {
                    if ($.isArray(queryOptions.keyField)) {
                        queryFilters = [];
                        $.each(queryOptions.keyField, function (keyIndex, keyValue) {
                            queryFilters.push(keyValue + " = ?");
                        });
                    } else {
                        queryFilters = [queryOptions.keyField + " = ?"];
                    }
                }

                // Criar filtros para a query
                var filterResult = thisDbQuery._applyFilters(query, queryFilters, readOptions.data.filter.filters);
                if (filterResult) {
                    query = filterResult.query;
                    for (i = (filterResult.params.length - 1) ; i >= 0; i--) {
                        params.unshift(filterResult.params[i]);
                    }
                }
            }

            // Add. joinParams (This params must be used before the query main where)
            var data = self.read.data;
            if (data) {
                for (i = 0; i < joinParams.length; i++) {
                    var paramValue = data[joinParams[i]];
                    if (paramValue) {
                        params.unshift(paramValue);
                    }
                }
            }

            // Pegando os parâmetros vindos do dataSource (transport.read.data)
            if (queryParams.length > 0) {
                if (data) {
                    for (i = 0; i < queryParams.length; i++) {
                        var aParam = data[queryParams[i]];
                        if (aParam) {
                            params.push(aParam);
                        }
                    }
                }
            }

            // Criação de LIMIT para paginação (carregamento sob demanda)
            if (readOptions.data.page) {
                var limit = " LIMIT " + ((readOptions.data.page * readOptions.data.pageSize) - 10) + ", " + readOptions.data.pageSize;

                // Pegar count do resultado total sem o Limit para passar para o kendo
                var countQuery = query.replace(/(SELECT)(.+?)(?= FROM)/, "$1 Count(*) as total ");

                thisDbQuery.query(countQuery, params, function (rc) {
                    queryDebug("Count Query");
                    thisDbQuery.query(query + limit, params, function (r) {
                        queryDebug("Query Finished");

                        if (r.length > 0) {
                            r[0].total = rc[0].total;
                        }

                        GDF.unblockApp();

                        readOptions.success(r);

                        if (queryOptions.end) {
                            queryOptions.end();
                        }
                    }, function (r) {
                        GDF.unblockApp();

                        if (readOptions.error) {
                            readOptions.error(null, "", r);
                        }

                        if (queryOptions.end) {
                            queryOptions.end();
                        }
                    });
                }, function (rc) {
                    GDF.unblockApp();

                    if (readOptions.error) {
                        readOptions.error(null, "", rc);
                    }

                    if (queryOptions.end) {
                        queryOptions.end();
                    }
                });
            } else {
                thisDbQuery.query(query, params, function (r) {
                    queryDebug("Query Finished");

                    if (r.length > 0) {
                        r[0].total = r.length;
                    }

                    GDF.unblockApp();

                    readOptions.success(r);

                    if (queryOptions.end) {
                        queryOptions.end();
                    }
                }, function (r) {
                    GDF.unblockApp();

                    if (readOptions.error) {
                        readOptions.error(null, "", r);
                    }

                    if (queryOptions.end) {
                        queryOptions.end();
                    }
                });
            }
        };

        if (isOriginalReadFunction) {
            originalRead.apply(this, arguments);
        } else if (queryOptions.ajax && queryOptions.ajax.url && GDF.isConnected()) {
            var didReturn = false;
            var checkErrorFunc = function (jqXHR, textStatus, errorThrown) {
                if (!didReturn) {
                    didReturn = true;
                    if (textStatus === "timeout" || jqXHR.status === 0) {
                        if (queryOptions.query) {
                            executeLocalQuery();
                            return;
                        }
                    }
                    GDF.unblockApp();
                    if (readOptions.error) {
                        readOptions.error(jqXHR, textStatus, errorThrown);
                    }
                }
            };

            queryOptions.ajax.data = self.read.data || {};

            if (typeof readOptions.data.skip !== "undefined") // && typeof queryOptions.ajax.data.skip === "undefined")
            {
                queryOptions.ajax.data.skip = readOptions.data.skip;
            }

            if (typeof readOptions.data.take !== "undefined") // && typeof queryOptions.ajax.data.take === "undefined")
            {
                queryOptions.ajax.data.take = readOptions.data.take;
            }

            queryOptions.ajax.type = queryOptions.ajax.type || "get";
            queryOptions.ajax.success = function (r) {
                GDF.unblockApp();
                readOptions.success(r);
                didReturn = true;
                if (originalSuccessFunction) {
                    originalSuccessFunction.apply(this, r);
                }
            };

            queryOptions.ajax.error = function (jqXHR, textStatus, errorThrown) {
                checkErrorFunc(jqXHR, textStatus, errorThrown);
                if (originalErrorFunction) {
                    originalErrorFunction.apply(this, jqXHR, textStatus, errorThrown);
                }
            };

            queryOptions.ajax.complete = function (jqXHR, textStatus) {
                checkErrorFunc(jqXHR, textStatus, null);
                if (originalCompleteFunction) {
                    originalCompleteFunction.apply(this, jqXHR, textStatus);
                }
            };

            $.ajax(queryOptions.ajax);
        } else if (queryOptions.query) {
            executeLocalQuery();
        } else {
            GDF.unblockApp();
            if (readOptions.error) {
                readOptions.error();
            }
        }
    };

    if (queryOptions.ajax) {
        readFunc.setUrl = function (newUrl) {
            queryOptions.ajax.url = newUrl;
        };
    }

    var readData = null;

    if (dataSourceOptions.transport && dataSourceOptions.transport.read && dataSourceOptions.transport.read.data) {
        readData = dataSourceOptions.transport.read.data;
    }

    dataSourceOptions.transport.read = readFunc;
    dataSourceOptions.transport.read.data = readData || {};

    var newDataSource = new kendo.data.DataSource(dataSourceOptions);

    return newDataSource;
};

dbQuery.prototype._applyFilters = function (query, queryFilters, filters) {
    // CAUTION: if the query has subqueries before and after the WHERE clause,
    // some nasty bug may occur =/
    var q;
    var queryReturn = "";
    var qq = [];
    var queryParams = [];

    if (query.toLowerCase().indexOf("union") !== -1) {
        qq = query.split(/union/gi);
    } else {
        qq[0] = query;
    }

    for (var j = 0; j < qq.length; j++) {
        // check if has subquery on WHERE clause
        if (/(WHERE(?=.*SELECT.*))/i.test(qq[j])) {
            q = qq[j].split(/((?=.*SELECT.*)WHERE)/i); // splitting by the first WHERE of the query
        } else {
            q = qq[j].split(/(WHERE(?!.*WHERE.*))/i); // here we split by the last WHERE
        }

        var filtro = filters[0].value;
        var f = "", tmp = "";

        // Se não houver WHERE na consulta, aborta. Precisava ver uma forma incluir um WHERE, se for o caso.
        if (q.length === 1) {
            var queryTemp = q[0];
            var indexOfOrderBy = queryTemp.toLowerCase().indexOf("order");
            var indexOfGroupBy = queryTemp.toLowerCase().indexOf("group");

            q[1] = " WHERE ";
            q[2] = " 1=1 ";

            // Query contém Order By e Group By
            if (indexOfOrderBy !== -1 && indexOfGroupBy !== -1) {
                if (indexOfOrderBy < indexOfGroupBy) {
                    q[0] = queryTemp.substring(0, indexOfOrderBy);
                    q[2] += queryTemp.substring(indexOfOrderBy, queryTemp.length);
                } else {
                    q[0] = queryTemp.substring(0, indexOfGroupBy);
                    q[2] += queryTemp.substring(indexOfGroupBy, queryTemp.length);
                }
            } else if (indexOfOrderBy !== -1 && indexOfGroupBy === -1) { // Query contém Order By e não contém Group By
                q[0] = queryTemp.substring(0, indexOfOrderBy);
                q[2] += queryTemp.substring(indexOfOrderBy, queryTemp.length);
            } else if (indexOfGroupBy !== -1 && indexOfOrderBy === -1) { // Query contém Group By e não contém Order By
                q[0] = queryTemp.substring(0, indexOfGroupBy);
                q[2] += queryTemp.substring(indexOfGroupBy, queryTemp.length);
            }
        }
        for (var i = 0; i < queryFilters.length; i++) {
            tmp = queryFilters[i];
            if (/(LIKE)/i.test(tmp.toString())) {
                queryFilters[i] = "UPPER(" + tmp.substring(0, tmp.indexOf(" ")) + ")" + tmp.substring(tmp.indexOf(" "), tmp.length);
                queryParams.unshift("%" + filtro.toUpperCase() + "%");
            } else if (/(BETWEEN)/i.test(tmp.toString())) { // Filtrar por data...
                var pattern = kendo.cultures.current.calendar.patterns.d;

                var regexp = pattern.replace(/\//g, "[/]");
                regexp = regexp.replace(/d+/i, "d");
                regexp = regexp.replace(/m+/i, "m");
                regexp = regexp.replace(/y+/i, "y");

                var dp = regexp.replace(/[^dmy]/ig, "");
                regexp = regexp.replace(/d/, "(0?[1-9]|[12][0-9]|3[01])");
                regexp = regexp.replace(/m/, "(0?[1-9]|1[012])");
                regexp = regexp.replace(/y/, "((19|20)\\d\\d)");
                regexp = new RegExp("^" + regexp + "$");

                if (regexp.test(filtro)) {
                    var d = dp.indexOf("d"),
                        m = dp.indexOf("m"),
                        y = dp.indexOf("y");

                    var date = filtro.split("/");
                    var di = new Date(date[y], (Number(date[m]) - 1), date[d], 0, 0, 0);
                    var df = new Date(date[y], (Number(date[m]) - 1), date[d], 23, 59, 59);

                    //queryParams.unshift((df.getTime() - (df.getTimezoneOffset() * 60000)));
                    //queryParams.unshift((di.getTime() - (di.getTimezoneOffset() * 60000)));

                    queryParams.unshift(df.getTime());
                    queryParams.unshift(di.getTime());
                } else {
                    queryParams.unshift("0");
                    queryParams.unshift("0");
                }
            } else {
                queryParams.unshift(filtro);
            }

            if (i > 0) {
                tmp += " OR ";
            }

            f = tmp + f;
        }

        f = " (" + f + ") ";

        queryReturn += q[0] + q[1] + f + (queryParams.length > 0 ? " AND " : "") + q[2];

        if (j < qq.length - 1) {
            queryReturn += " UNION ";
        }
    }

    return {
        query: queryReturn,
        params: queryParams
    };
};

dbQuery.prototype.execQueries = function (queries, params, success, fail) {
    var self = this;

    // Verifica se a quantidade de elementos na queries é igual a qtd de elementos em params
    if (queries.length != params.length) {
        if (typeof fail === "function") {
            fail("Incorret params!");
        }
        return;
    }

    if (!self.connection) {
        if (typeof fail === "function") {
            fail("No database available!");
        }
        return;
    }

    var internalError = function (tx, error) {
        var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message;

        if (console) {
            console.error(errorMessage);
        }

        if (typeof fail === "function") {
            fail(errorMessage);
        }
    };

    var start = function () {
        self.connection.transaction(function (tx) {
            var doOperation = function (query, params, isLast) {
                tx.executeSql(query, params, null, internalError);

                // Quando for o último, chama o callback de sucesso
                if (isLast && typeof success === "function") {
                    success();
                    return;
                }
            };

            $.each(queries, function (idx, elem) {
                doOperation(elem, params[idx], idx == (queries.length - 1));
            });
        }, internalError);
    };

    start();
};

dbQuery.prototype.queries = function (queries, params, success, fail) {
    var self = this;

    if (!self.connection) {
        if (typeof fail === "function") {
            fail("No database available!");
        }
        return;
    }

    // Queries e Params deve ser um array
    if (!Array.isArray(queries) || queries.length === 0) {
        if (typeof fail === "function") {
            fail("Queries is incorrect!");
        }
        return;
    }

    if (!Array.isArray(params) || params.length === 0 || params.length !== queries.length) {
        if (typeof fail === "function") {
            fail("Params is incorrect!");
        }
        return;
    }

    var internalError = function (tx, error) {
        var errorMessage = "SQL Error:\nError Code: " + error.code + "\nError Msg.: " + error.message;

        if (console) {
            console.error(errorMessage);
        }

        if (typeof fail === "function") {
            fail(errorMessage);
        }
    };

    var start = function () {
        self.connection.transaction(function (tx) {
            var doQuerie = function (sql, param) {
                tx.executeSql(sql, param, function (tx, result) {
                    if (++idx < queries.length) {
                        doQuerie(queries[idx], params[idx]);
                    } else {
                        if (typeof success == "function") {
                            success();
                        }
                    }
                }, internalError);
            };

            // Configura indice
            var idx = 0;

            // Executa primeira querie
            doQuerie(queries[idx], params[idx]);
        }, internalError);
    };

    start();
};

// Esta função serve para auxiliar as funções abaixo
dbQuery.prototype.buildQueryWhere = function (columns) {
    var newQuery = "";

    for (var i = 0; i < columns.length; i++) {
        newQuery += " " + columns[i] + " = ? ";
        if (i < columns.length - 1) {
            newQuery += " AND ";
        }
    }

    return newQuery;
}

// obj: objeto com parametros
// obj.table: String da tabela onde os dados serão inseridos
// obj.data: obj do jaydata com os dados a serem inseridos
// success: callback de sucesso
// failure: callback de fracasso
dbQuery.prototype.insertByObj = function (obj, success, failure) {
    // Verifica existencia dos dados
    if (typeof obj == "undefined") {
        console.log("Inserção de objeto falhou: parametros não especificados");
        GDF.util.invokeCallback(failure, GDF.strings.insertByObjError);
    }

    if (typeof obj.table == "undefined") {
        console.log("Inserção de objeto falhou: tabela não identificada");
        GDF.util.invokeCallback(failure, GDF.strings.insertByObjError);
    }

    if (typeof obj.data == "undefined") {
        console.log("Inserção de objeto falhou: informações não especificadas");
        GDF.util.invokeCallback(failure, GDF.strings.insertByObjError);
    }

    // Monta query base
    var baseQuery = "INSERT INTO (:table) ((:columns)) VALUES ((:values))";
    var query = "";

    // Insere nome da tabela
    query = baseQuery.replace("(:table)", obj.table);

    // Obtem colunas e insere na query base
    var columns = Object.keys(obj.data);
    query = query.replace("(:columns)", columns);

    // Associa valor com colunas e insere os na query base
    var values = [];
    var valuesParams = [];
    $.each(columns, function (idx, item) {
        // Se objeto for do tipo data, converte para timestamp
        if (obj.data[item] instanceof Date) {
            values.push(obj.data[item].getTime());
        }
            // Se objeto não for do tipo numerico, verifica se o mesmo possui dados
        else if (isNaN(obj.data[item])) {
            values.push(obj.data[item] ? obj.data[item] : '');
        }
            // Se o valor for numerico, insere sem necessidade de processamento
        else {
            values.push(obj.data[item]);
        }

        valuesParams.push("?");

    });
    query = query.replace("(:values)", valuesParams);

    // Realiza query
    GDF.sql.query(query, values, function (data) {
        GDF.util.invokeCallback(success, data);
    }, function (error) {
        GDF.util.invokeCallback(failure, error);
    });
};

// obj: objeto com parametros
// obj.table: String da tabela onde os dados serão inseridos
// obj.uniqueInfoObj: Obj com informaçãos da coluna (e seu valor) que identifica o registro de maneira unica. Ex: {Id: 1} - Trás o resultado cujo Id = 1
// obj.wrapUniqueInfo: Ativo por padrão, define se o objeto-resultado enviado pelo callback ira enviar informações de tabela/coluna
// success: callback de sucesso
// failure: callback de fracasso
dbQuery.prototype.getEntryInfo = function (obj, success, failure) {
    // Verifica existencia dos dados
    if (typeof obj == "undefined") {
        console.log("Busca da informação falhou: parametros não especificados");
        GDF.util.invokeCallback(failure, GDF.strings.getEntryInfoError);
    }

    if (typeof obj.table == "undefined") {
        console.log("Busca da informação falhou: tabela não identificada");
        GDF.util.invokeCallback(failure, GDF.strings.getEntryInfoError);
    }

    if (typeof obj.uniqueInfoObj == "undefined") {
        console.log("Busca da informação falhou: parametros não especificados");
        GDF.util.invokeCallback(failure, GDF.strings.getEntryInfoError);
    }

    if (typeof obj.wrapUniqueInfo == "undefined") {
        console.log("Busca da informação falhou: parametros não especificados");
        obj.wrapUniqueInfo = true;
    }

    // Query base
    var baseQuery = "SELECT * FROM (:table) WHERE (:primaryColumns)";
    var query = "";

    // Define tabela
    query = baseQuery.replace("(:table)", obj.table);

    // Pega coluna unica
    var primaryColumns = Object.keys(obj.uniqueInfoObj);
    query = query.replace("(:primaryColumns)", GDF.sql.buildQueryWhere(primaryColumns));

    // Pega valor unico
    var values = [];

    for (var i = 0; i < primaryColumns.length; i++) {
        values.push(obj.uniqueInfoObj[primaryColumns[i]]);
    }

    // Preenche com metadados sobre a tabela/coluna unica 
    var insertMetaEditInfo = function (data) {

        if (data.length > 1) {
            for (var j = 0; j < data.length; j++) {
                // Armazena informações que serão utilizadas no commit das alterações
                data[j].metaEditInfo = {
                    tableName: obj.table,
                    primaryColumns: primaryColumns,
                    primaryColumnsValues: values
                }

                // Congela o objeto para que o mesmo não possa ser alterado em tempo de execução
                Object.freeze(data[j].metaEditInfo);
            }
        } else {
            // Armazena informações que serão utilizadas no commit das alterações
            data.metaEditInfo = {
                tableName: obj.table,
                primaryColumns: primaryColumns,
                primaryColumnsValues: values
            }

            // Congela o objeto para que o mesmo não possa ser alterado em tempo de execução
            Object.freeze(data.metaEditInfo);
        }


        GDF.util.invokeCallback(success, data);
    }

    // Realiza a query e obtem os dados
    GDF.sql.query(query, values, function (data) {
        if (obj.wrapUniqueInfo) {
            insertMetaEditInfo(data);
        } else {
            GDF.util.invokeCallback(success, data.length > 1 ? data : data[0]);
        }

    }, function (error) {
        GDF.util.invokeCallback(failure, error);
    });
};

// obj: objeto com parametros
// obj.table: String da tabela onde os dados serão inseridos
// obj.uniqueInfoObj: Obj com informaçãos da coluna (e seu valor) que identifica o registro de maneira unica. Ex: {Id: 1} - Trás o resultado cujo Id = 1
// obj.data: obj do jaydata com os dados a serem inseridos
// success: callback de sucesso
// failure: callback de fracasso
dbQuery.prototype.commitEditChanges = function (obj, success, failure) {

    if (typeof obj == "undefined") {
        console.log("Confirmação de edição falhou: parametros não especificados");
        GDF.util.invokeCallback(failure, GDF.strings.commitEditChangesError);
    }

    if (typeof obj.data == "undefined") {
        console.log("Confirmação de edição falhou: dados não informados");
        GDF.util.invokeCallback(failure, GDF.strings.commitEditChangesError);
    }

    // Query base
    var baseQuery = "UPDATE (:table) (:updateFields) WHERE (:primaryColumns) ";
    var query = "";

    // Pega tabela dos metadados
    var table = "";

    // Tabela e informações unicas são utilizados apenas se as informações não forem passados pelo data
    if (typeof obj.data.metaEditInfo != "undefined" && typeof obj.data.metaEditInfo.tableName != "undefined") {
        table = obj.data.metaEditInfo.tableName;
    } else if (typeof obj.table != "undefined") {
        table = obj.table;
    } else {
        console.log("Confirmção da edição falhou: tabela não informada");
        GDF.util.invokeCallback(failure, GDF.strings.commitEditChangesError);
    }

    query = baseQuery.replace("(:table)", table);

    // Pega coluna unica e seu valor
    var primaryColumns;
    var values = [];

    if (typeof obj.data.metaEditInfo != "undefined" && typeof obj.data.metaEditInfo.primaryColumns != "undefined") {
        primaryColumns = obj.data.metaEditInfo.primaryColumns;
        values = obj.data.metaEditInfo.primaryColumnsValues;
    } else if (typeof obj.uniqueInfoObj != "undefined") {
        primaryColumns = Object.keys(obj.uniqueInfoObj);
        for (var i = 0; i < primaryColumns.length; i++) {
            values.push(obj.uniqueInfoObj[primaryColumns[i]]);
        }
    } else {
        console.log("Confirmção da edição falhou: coluna unica não informada");
        GDF.util.invokeCallback(failure, GDF.strings.commitEditChangesError);
    }

    query = query.replace("(:primaryColumns)", GDF.sql.buildQueryWhere(primaryColumns));


    // Monta update das colunas
    var columns = Object.keys(obj.data);
    var updateStr = [];
    for (var i = 0; i < columns.length; i++) {

        var column = columns[i];

        // Define tipo
        var rawColumnValue = obj.data[columns[i]];
        var columnValue;
        if (typeof rawColumnValue === "undefined") {
            columnValue = "''";
        } else if (typeof rawColumnValue === "string" || rawColumnValue instanceof String) {
            columnValue = "'" + rawColumnValue + "'";
        } else {
            columnValue = rawColumnValue;
        }

        // Caso seja NÃO seja um objeto ou seja um objeto de data
        // TODO adicionar contains na comparação com primaryColumn
        if ((typeof columnValue != "object" || columnValue instanceof Date) && (primaryColumns.indexOf(column) < 0 && column !== "Id")) {
            // Se for a primeira coluna ou se a array de inserções estiver vazia
            if (i === 0 || updateStr.length === 0) {
                updateStr.push("SET " + column + " = " + columnValue);
            } else {
                updateStr.push("" + column + " = " + columnValue);
            }
        }
    }

    query = query.replace("(:updateFields)", updateStr.toString());

    GDF.sql.query(query, values, function (data) {
        GDF.util.invokeCallback(success, data);
    }, function (error) {
        GDF.util.invokeCallback(failure, error);
    });
};

// obj: objeto com parametros
// obj.table: String da tabela onde os dados serão inseridos
// obj.uniqueColumn: Coluna) que identifica o registro de maneira unica. Ex: "Id"
// success: callback de sucesso
// failure: callback de fracasso
dbQuery.prototype.takeLastItemId = function (obj, success, failure) {

    if (typeof obj == "undefined") {
        console.log("Obtenção de ultimo objeto falhou: objeto de parâmetros não identificado");
        GDF.util.invokeCallback(failure, GDF.strings.takeLastItemError);
    }

    if (typeof obj.table == "undefined") {
        console.log("Obtenção de ultimo objeto falhou: tabela não identificada");
        GDF.util.invokeCallback(failure, GDF.strings.takeLastItemError);
    }

    if (typeof obj.uniqueColumn == "undefined") {
        console.log("Obtenção de ultimo objeto falhou: coluna primaria não identificada");
        GDF.util.invokeCallback(failure, GDF.strings.takeLastItemError);
    }

    // Query base
    var baseQuery = "SELECT MAX({0}) as {0} FROM (:table)";
    var query = "";

    // Insere tabelas
    query = baseQuery.replace("(:table)", obj.table);

    // Insere columa primaria
    query = query.format(obj.uniqueColumn);

    GDF.sql.query(query, [], function (data) {
        GDF.util.invokeCallback(success, data[0]);
    }, function (error) {
        GDF.util.invokeCallback(failure, error);
    });

}
;

GDF.util = {
    _parameters: [],

    fillParameters: function(success) {
        this._parameters = [];

        clearTimeout(this._fillParametersTimerId);

        if (!GDF.db) {
            if (GDF.hasDb) {
                this._fillParametersTimerId = setTimeout(function() {
                    GDF.util.fillParameters(success);
                }, 200);
            } else if (success) {
                success();
            }

            return;
        }

        GDF.db.onReady(function() {
            if (GDF.db.ParametrosSafra) {
                GDF.db.ParametrosSafra.forEach(function(parametro) {
                    GDF.util._parameters.push(parametro);
                }).fail(function() {
                    console.error("GDF.util.fillParameters: Falha ao recuperar parametros.");
                }).then(function() {
                    if (success) {
                        success();
                    }
                });
            } else if (success) {
                success();
            }
        });
    },

    isEnglish: function() {
        return kendo.culture().name.toUpperCase().indexOf("EN") !== -1;
    },

    isPortuguese: function() {
        return kendo.culture().name.toUpperCase().indexOf("BR") !== -1;
    },

    getParameters: function(safra, empresa, success, fail) {
        if (!this._parameters || this._parameters.length === 0) {

            if (typeof fail === "function") {
                fail("Parametros não inicializados. Por favor realize novamente o processo de sincronia e de login.");
            }

            console.error("GDF.util.getParameters: Parametros não inicializados.");

            return;
        }

        for (var i = 0; i < this._parameters.length; i++) {
            if ((typeof safra === "undefined" || !safra || this._parameters[i].SafAnoSafra == safra) &&
                (typeof empresa === "undefined" || !empresa || this._parameters[i].CodEmpr == empresa)) {
                if (typeof success === "function") {
                    success(this._parameters[i]);
                    return;
                } else {
                    return this._parameters[i];
                }
            }
        }

        if (typeof fail === "function") {
            fail("Parametros não encontrado para a safra {0}. Por favor verifique os parâmetros no módulo desktop e realize uma nova sincronia.".format(safra));
        }

        console.log("GDF.util.getParameters: Nenhum parâmetro encontrado para a safra '" + safra + "'.");
    },

    error: function(msg) {
        console.error("GDF.util Error: " + msg);
    },

    formatDate: function(date, format) {
        if (isNaN(date)) {
            return;
        }

        if (!format) {
            format = "d";
        }

        date = Number(date);

        //return kendo.toString(new Date((date + (new Date(date).getTimezoneOffset() * 60000))), format);
        return kendo.toString(new Date(date), format);
    },

    formatNumber: function(theNumber, maxDecimalPlaces) {
        var decimalPlacesLimit = 12;

        if (typeof maxDecimalPlaces === "undefined") {
            maxDecimalPlaces = decimalPlacesLimit;
        }

        theNumber = isNaN(theNumber) || !isFinite(theNumber) ? 0 : Number(theNumber);

        maxDecimalPlaces = maxDecimalPlaces > decimalPlacesLimit ? decimalPlacesLimit : maxDecimalPlaces;

        var decimalSeparator = kendo.culture().numberFormat["."];
        var theNumberString = kendo.toString(theNumber, "0.############");

        if (theNumberString.indexOf(decimalSeparator) !== -1) {
            var strParts = theNumberString.split(decimalSeparator);
            var decimalPartLength = strParts[1].length;

            if (decimalPartLength > maxDecimalPlaces) {
                var format = "0";
                if (maxDecimalPlaces > 0) {
                    format += ".";
                    var i = maxDecimalPlaces;
                    while (i--) {
                        format += "#";
                    }
                }

                theNumberString = kendo.toString(theNumber, format);
            }
        }

        while (theNumberString.length > 1 && theNumberString[0] === "0" && theNumberString[1] !== decimalSeparator) {
            theNumberString = theNumberString.substr(1, theNumberString.length - 1);
        }

        if (theNumberString.indexOf(decimalSeparator) !== -1) {
            while (theNumberString[theNumberString.length - 1] === "0") {
                theNumberString = theNumberString.substr(0, theNumberString.length - 1);
            }
        }

        if (theNumberString.length > 1 && theNumberString[theNumberString.length - 1] === decimalSeparator) {
            theNumberString = theNumberString.substr(0, theNumberString.length - 1);
        }

        return theNumberString;
    },

    setAddButton: function (e, viewName, param) {
        viewName = viewName.trim();

        // Configura viewname
        if (!viewName.startsWith("views/")) {
            viewName = "views/" + viewName;
        }

        if (!viewName.endsWith(".html")) {
            viewName += ".html";
        }

        // adiciona parâmetro se existir
        if (typeof param !== "undefined" && param != "") {
            viewName += "?param=" + param;
        }

        var addButton = e.view.element.find(".add-button");
        addButton.prop("href", viewName);
    },

    validateNumber: function(number) {
        if (!isNaN(number)) {
            return true;
        }

        var decimalSeparator = kendo.cultures.current.numberFormat["."];
        if (decimalSeparator === ".") {
            decimalSeparator = "\\" + decimalSeparator;
        }

        var regex = new RegExp("^(\\d+)(" + decimalSeparator + "\\d+)?$");
        return regex.test(number);
    },

    /*  Verifica se o app deve ser bloqueado até que seja realizado um sincronismo completo.    	
    	daysAllowed: numero de dias permitido que fique sem sincronismo
    	daysToWarn: numero de dias que será exibido alerta para sincronizar, deve ser menor ou igual a daysAllowed
    	syncDate: data da ultima sincronia
    	callback: retorno booleano da função. true: bloqueia app e redireciona para pagina sync
    */
    checkFullSync: function(daysAllowed, daysToWarn, callback) {
        // Se daysAllowed <= 0, não realiza a verficação
        if (daysAllowed <= 0) {
            callback(false);
            return;
        }

        var today = new Date();
        var syncDate;

        if (!GDF.settings.lastSyncDate) {
            syncDate = today;
        } else {
            syncDate = new Date(GDF.settings.lastSyncDate);
        }

        var days = GDF.util.getDays(today, syncDate);
        if (days >= daysToWarn) {
            if (days < daysAllowed) {
                GDF.messageBox({
                    text: GDF.strings.syncWarning.format(Number((daysAllowed - days))),
                    ok: function() {
                        callback(false);
                    }
                });
                return;
            } else {
                GDF.messageBox({
                    text: GDF.strings.syncRequired,
                    ok: function() {
                        callback(true);
                    }
                });
                return;
            }
        }

        return callback(false);
    },

    getResourceText: function(field) {
        /* 
        Atende os seguintes formatos:
        
        <li>
            <span class="listview-label" data-lang="quantity"></span>
            <input type="text" id="productQty" />
        </li>
        
        <li>
            <label data-lang="quantity"></label>
            <input type="text" id="productQty" />
        </li>
        
        O campo(field) deve estar dentro de um elemento que contenha um label ou um span com data-lang, ou seja,
        o campo deve estar no mesmo nível do label ou span com data-lang.
        */
        /* Obs: Caso o campo seja um  campo de busca, é aplicado a string relativa a campos de pesquisa.*/
        if ($(field).prop("type") === "search") {
            return GDF.strings.searchPlaceHolder;
        } else {
            var text = $(field).parent().find("span[data-lang]:first, label:first").first().html();

            if (text === "") {
                text = GDF.util.pascalCase($(field).parent().find("span[data-lang]:first, label:first").first().data("lang"));
            }

            return text;
        }
    },

    back: function() {
        GDF.kendoMobileApp.navigate("#:back");
        GDF.kendoMobileApp.view().destroy();
    },

    /*
    create a simple LookUp
    field: name of field that use the LookUp;
    option: options for lookup
        - multiple: to select multiple results
        - display: to display other text in listview
        - selection: list already selected            
    This method uses default var's on the controller based at the field data-lang="abc" like: queryAbc, paramsAbc, lookUpAbc, initLookUpAbc
    - queryAbc is the query to use in LookUp (required on the controller);
	    The first two column at query must be CodAbc and DscAbc;
    - paramsAbc are the params to use in query (required on the controller if there are '?' at query);
    - lookUpAbc is the callback;
    - initLookUpAbc is a function that executes at the beginning of the method, if you need to perform some checks 
    (return false to prevent the implementation of LookUp)
    */
    createLookUp: function(fieldName, option) {
        var controller = GDF.util.getController();
        var field = $((fieldName.match("#") ? "" : "#") + fieldName);
        var title = field.parent().children().first().data("lang");

        if (!title) {
            title = fieldName.replace("#", "").toLowerCase();
        }

        // Verifica se o lookup está marcado para utilizar a feature de esclusão
        var doExclude = field.data("exclude");

        if (doExclude) {
            $("#" + fieldName + "").parent().append("<a id='" + fieldName + "Exclude' data-align=\"right\" data-icon=\"delete\" data-exec=\"deleteLog\" data-click=\"GDF.exec\"><span class=\"km-icon km-delete km-notext\"></span></a>");
            $("#" + fieldName + "").parent().find("a").css("float", "right");
            $("#" + fieldName + "Exclude").on("click", function () {
                if ($("#" + fieldName + "").val() !== "") {
                    var obj = "(" + $("#" + fieldName + "").val() + ")";
                    var msg = GDF.strings.delLookUp.format(GDF.strings[title]) + "<br\>" + obj;

                    // Verifica se tem alguma ação há realizar antes de realizar a exclusão
                    var beforeExclude = controller["beforeExcludeLookUp" + GDF.util.firstUpper(title)];
                    var resultBeforeExclude = typeof beforeExclude === "function" ? beforeExclude() : true;

                    if (resultBeforeExclude) {
                        // Se o campo estiver desabilitado não deve realizar nenhuma ação
                        if ($("#" + fieldName).prop("disabled")) {
                            return;
                        }

                        GDF.messageBox({
                            text: msg,
                            yes: function () {
                                $("#" + fieldName + "").val("");

                                var dataModel = $("#" + fieldName + "").data("model");
                                if (dataModel) {
                                    if (controller[dataModel]) {
                                        controller[dataModel] = undefined;
                                    }

                                    var dataModelDsc = dataModel.replace("Cod", "Dsc");
                                    if (controller[dataModelDsc]) {
                                        controller[dataModelDsc] = undefined;
                                    }
                                } else {
                                    if (controller["Cod" + GDF.util.firstUpper(title)]) {
                                        controller["Cod" + GDF.util.firstUpper(title)] = undefined;
                                    }

                                    if (controller["Dsc" + GDF.util.firstUpper(title)]) {
                                        controller["Dsc" + GDF.util.firstUpper(title)] = undefined;
                                    }
                                }

                                var excludeLookUp = controller["excludeLookUp" + GDF.util.firstUpper(title)];
                                if (typeof excludeLookUp === "function") {
                                    excludeLookUp(fieldName);
                                }
                            },
                            no: function () {
                            },
                            ok: false
                        });
                    }
                }
            });
        } else {
            $("#" + fieldName + "").addClass("alt");
        }

        field.on("click tap vclick", function(event) {
            // Não exibe o teclado virtual default do Sistema Operacional
            event.stopImmediatePropagation();
            event.preventDefault();

            field.blur();

            var initLookUp = controller["initLookUp" + GDF.util.firstUpper(title)];
            var returInitLookUp = true;

            // Valid if exist a initLookUp
            if (initLookUp) {
                returInitLookUp = initLookUp(fieldName);
            }

            // Check if can continue after initLookUp
            if (!returInitLookUp) {
                return;
            }
            var query = controller["query" + GDF.util.firstUpper(title)];
            var params = controller["params" + GDF.util.firstUpper(title)];
            var callback = controller["lookUp" + GDF.util.firstUpper(title)];
            var beforeClose = controller["beforeClose" + GDF.util.firstUpper(title)];
            var afterClose = controller["afterClose" + GDF.util.firstUpper(title)];
            var template = controller["template" + GDF.util.firstUpper(title)];
            var filtersFields = controller["filters" + GDF.util.firstUpper(title)];

            // Valid if exists a query
            if (!query) {
                console.log("There isn't a var 'query" + GDF.util.firstUpper(title) + "' on the controller '" + controller.view.id + "'");
                return;
            }

            // If that checks if exist params at the query
            if (query.indexOf("?") !== -1) {
                // Valid if exsists params
                if (!params) {
                    console.log("There isn't a var 'params" + GDF.util.firstUpper(title) + "' on the controller '" + controller.view.id + "'");
                    return;
                }
            } else {
                params = [];
            }

            var keyWords = [/distinct/gi, /\s+/g];
            var queryToField = query.substring(query.toLowerCase().indexOf("select") + 7, query.toLowerCase().indexOf("from"));
            var specialChar = "####";

            queryToField = queryToField.replace(/ as /gi, specialChar);

            keyWords.forEach(function (elem) {
                queryToField = queryToField.replace(elem, "");
            });

            var fields = queryToField.split(",");
            var filters = typeof filtersFields == "undefined" ? [] : filtersFields;
            var returnFields = [];

            fields.forEach(function (elem) {
                if (elem.match(specialChar)) {
                    returnFields.push(elem.split(specialChar)[1]);
                } else {
                    returnFields.push(elem.indexOf(".") !== -1 ? elem.split(".")[1] : elem);
                }
            });

            if (fields[0].toLowerCase().match("id") && !fields[0].toLowerCase().match("cod")) {
                fields.shift();
            }

            if (fields.length > 1) {
                if (!fields[1].toLowerCase().match("dsc") && !fields[1].toLowerCase().match("abv") && !fields[1].toLowerCase().match("descricao")) {
                    var length = fields.length;
                    for (var i = 1; i < length; i++) {
                        fields.pop();
                    }
                }
            }

            // Criando o filtro
            if (fields[0].match(specialChar)) {
                filters.push(fields[0].split(specialChar)[0] + " = ?");
            } else {
                filters.push(fields[0] + " = ?");
            }

            if (fields.length > 1) {
                if (fields[1].match(specialChar)) {
                    filters.push(fields[1].split(specialChar)[0] + " LIKE ?");
                } else {
                    filters.push(fields[1] + " LIKE ?");
                }
            }

            var display = option ? (option.display ? option.display : undefined) : undefined;
            var content;

            if (display) {
                content = display;
            } else if (template) {
                if (typeof template == "function") {
                    content = template();
                } else {
                    content = template;
                }
            } else {
                content = "#: " + returnFields[0] + " #";
                if (returnFields.length > 1) {
                    if (!filters[1].startsWith("''")) {
                        content += " - #: GDF.util.pascalCase(" + returnFields[1] + ") #";
                    }
                }
            }

            var multiple = option ? (option.multiple ? option.multiple : undefined) : undefined;

            if (multiple) {
                multiple = true;
            } else {
                multiple = false;
            }

            var titleName;

            if (!field.parent().children().first().data("lang")) {
                titleName = GDF.util.firstUpper($("label[for=" + fieldName.replace("#", "") + "]").text().replace("*", ""));
                if (titleName === "") {
                    titleName = GDF.strings[title + "Plural"] ? GDF.strings[title + "Plural"] : GDF.strings[title];
                }
            } else {
                titleName = GDF.strings[title + "Plural"] ? GDF.strings[title + "Plural"] : GDF.strings[title];
            }

            GDF.util.lookUp({
                block: true,
                selection: option ? controller[option.selection] : null,
                multiple: multiple,
                title: titleName,
                callback: callback,
                template: content,
                returnFields: returnFields,
                filters: filters,
                query: query,
                queryParams: params,
                beforeClose: beforeClose,
                afterClose: afterClose
            });
        }).val("");
    },

    recreateLookUp: function (fieldName, option) {
        var field = $((fieldName.match("#") ? "" : "#") + fieldName);

        // Remove ação do lookup
        field.off("click tap vclick");

        // remove ação da exclusão
        var doExclude = field.data("exclude");
        if (doExclude) {
            $("#" + fieldName + "Exclude").off("click");
        }

        // Recria lookup
        GDF.util.createLookUp(fieldName, option);
    },

    getDateTimeFormat: function(noSeconds) {
        if (noSeconds) {
            return GDF.util.getDateTimeFormatWithoutSeconds();
        }
        return kendo.culture().calendar.patterns.G;
    },

    getDateFormat: function() {
        return kendo.culture().calendar.patterns.d;
    },

    getTimeFormat: function(noSeconds) {
        if (noSeconds) {
            return GDF.util.getTimeFormatWithoutSeconds();
        }
        return kendo.culture().calendar.patterns.T;
    },

    getDateTimeFormatWithoutSeconds: function() {
        return kendo.culture().calendar.patterns.g;
    },

    getTimeFormatWithoutSeconds: function() {
        return kendo.culture().calendar.patterns.t;
    },

    removeItemOnTouchHold: function(field, variavel, text) {
        field = $((field.match("#") ? "" : "#") + field);

        var self = GDF.util.getController();

        field.touchHold(function () {
            if (self[variavel]) {
                GDF.messageBox({
                    text: text ? text : GDF.strings.removeItem,
                    yes: function() {
                        self[variavel] = null;
                        field.val("");
                    },
                    no: function() {
                    },
                    ok: false
                });
            }
        });
    },

    verify1Result: function (fieldName, callback, completeCallback) {
        var field = $((fieldName.match("#") ? "" : "#") + fieldName);
        var controller = GDF.util.getController();
        var title = field.parent().children().first().data("lang");

        if (!title) {
            title = fieldName.replace("#", "").toLowerCase();
        }

        var initLookUp = controller["initLookUp" + GDF.util.firstUpper(title)];
        var returInitLookUp = true;

        // Valid if exist a initLookUp
        if (initLookUp) {
            returInitLookUp = initLookUp();
        }

        // Check if can continue after initLookUp
        if (!returInitLookUp) {
            return;
        }

        var query = controller["query" + GDF.util.firstUpper(title)];
        var params = controller["params" + GDF.util.firstUpper(title)];
        var lookUp = controller["lookUp" + GDF.util.firstUpper(title)];

        // Valid if exists a query
        if (!query) {
            console.log("There isn't a var 'query" + GDF.util.firstUpper(title) + "' on the controller '" + controller.view.id + "'");
            return;
        }

        // If that checks if exist params at the query
        if (query.indexOf("?") !== -1) {
            // Valid if exsists params
            if (!params) {
                console.log("There isn't a var 'params" + GDF.util.firstUpper(title) + "' on the controller '" + controller.view.id + "'");
                return;
            }
        } else {
            params = [];
        }

        GDF.sql.query(query, params, function (result) {
            if (result.length === 1) {
                lookUp(result[0]);
                field.prop("disabled", "disabled");
                if (typeof callback === "function") {
                    callback();
                }
            } else {
                field.prop("disabled", "");
            }
            if (typeof completeCallback === "function") {
                completeCallback(field);
            }
        }, function (error) {
            if (typeof completeCallback === "function") {
                completeCallback(field, error);
            }
        });
    },

    verifyNext: function (fieldName, success, fail) {
        var field = $((fieldName.match("#") ? "" : "#") + fieldName);
        var controller = GDF.util.getController();
        var title = field.parent().children().first().data("lang");

        if (!title) {
            title = fieldName.replace("#", "").toLowerCase();
        }

        var initLookUp = controller["initLookUp" + GDF.util.firstUpper(title)];
        var returInitLookUp = true;

        // Valid if exist a initLookUp
        if (initLookUp) {
            returInitLookUp = initLookUp();
        }

        // Check if can continue after initLookUp
        if (!returInitLookUp) {
            return;
        }

        var query = controller["query" + GDF.util.firstUpper(title)];
        var params = controller["params" + GDF.util.firstUpper(title)];
        var lookUp = controller["lookUp" + GDF.util.firstUpper(title)];

        // Valid if exists a query
        if (!query) {
            console.log("There isn't a var 'query" + GDF.util.firstUpper(title) + "' on the controller '" + controller.view.id + "'");
            return;
        }

        // If that checks if exist params at the query
        if (query.indexOf("?") !== -1) {
            // Valid if exsists params
            if (!params) {
                console.log("There isn't a var 'params" + GDF.util.firstUpper(title) + "' on the controller '" + controller.view.id + "'");
                return;
            }
        } else {
            params = [];
        }

        GDF.sql.query(query, params, function(result) {
            if (result.length > 0) {
                lookUp(result[0]);
                if (typeof success === "function") {
                    success();
                }
            } else {
                if (typeof fail === "function") {
                    fail();
                }
            }
        });
    },

    /*
    clear the vars of the controller
    arrayVars: name's array of vars (Ex: ['CodOs', 'CodEmpr', 'DscEmpr'])
    */
    clearVars: function(arrayVars) {
        var controller = GDF.util.getController();
        arrayVars.forEach(function(elem) {
            controller[elem] = undefined;
        });
    },

    /*
    clear the inputs
    inputs: input's name (Ex: ['entryId', 'entryObs', 'entryPoint'])
    */
    resetInputs: function(inputs) {
        inputs.forEach(function(input) {
            var elem = $("#" + input);
            var type = elem.attr("type");
            $("label[for=" + input + "]").find("span:first").remove();
            switch (type) {
                case "text":
                    elem.val("");
                    break;
                case "number":
                    // Verifica se aceita nulos, neste caso é configurado um valor nulo como padrão
                    elem.val(elem.data("allownull") ? null : 0);
                    break;
                case "checkbox":
                    elem.prop("checked", false);
                    break;
                default:
                    elem.val("");
            }
            if (elem.attr("readonly")) {
                elem.prop("disabled", "disabled");
            } else {
                elem.prop("disabled", "");
            }
        });
    },

    /*
        Check if fields are filled
        the controller needs a requiredFields as array var of input's name
        return true if are all filled
    */
    validateRequiredField: function() {
        var viewId = GDF.kendoMobileApp.view().id;
        viewId = viewId.replace("views/", "").replace(".html", "");

        var controller = GDF.controllers[viewId];
        var fields = controller.requiredFields || null;
        controller.statusRequiredField = [];

        if (!fields) {
            return true;
        }

        fields.forEach(function() {
            controller.statusRequiredField.push(1);
        });

        var validate = true;
        fields.forEach(function (field) {
            var elem = $("#" + field);
            var val = elem.val();
            if (elem.hasClass("number")) {
                val = val.trim() === "" ? 0 : val.replace(/\./, "").toNumber();
            } else {
                val = val.trim();
            }
            if (val === 0 || val === GDF.strings.selectAnOption || val === "") {
                GDF.util.requiredFields(controller, true, controller.statusRequiredField);
                GDF.GDF.util.toast(GDF.strings.formErrorEmptyFields);
                controller.requiredFieldClicked = true;
                validate = false;
                return;
            }
        });

        return validate;
    },

    /*
    clear the vars of the controller and inputs
    arrayVars: var's name (Ex: ['CodOs', 'CodEmpr', 'DscEmpr'])
    inputs: input's name (Ex: ['#entryId', 'entryObs', 'entryPoint'])
    */
    clearVarsAndInputs: function(arrayVars, inputs) {
        GDF.util.clearVars(arrayVars);
        GDF.util.resetInputs(inputs);
    },

    deleteSended: function(tables, idfields, ids, success) {
        if (!tables || !idfields || !ids || tables.length !== idfields.length || ids.length === 0) {
            if (success) {
                success();
            }
            return;
        }

        var elemsToDelete = "";

        ids.forEach(function (elem) {
            elemsToDelete += elem + ",";
        });

        var queryParam = elemsToDelete.substr(0, elemsToDelete.length - 1);
        var deleteItem = function(idx) {
            var query = "DELETE FROM " + tables[idx] + " WHERE " + idfields[idx] + " in (" + queryParam + ")";
            GDF.sql.query(query, [], function() {
                if (idx < tables.length - 1) {
                    deleteItem(idx + 1);
                } else if (success) {
                    success();
                }
            });
        };

        deleteItem(0);
    },

    compareDate: function(date1, date2) {
        // Compara se as datas estão no mesmo dia, ignora horas minutos e segundos
        if (typeof date1 !== "object") {
            date1 = new Date(Number(date1));
        }

        if (typeof date2 !== "object") {
            date2 = new Date(Number(date2));
        }

        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        date1.setMilliseconds(0);

        date2.setHours(0);
        date2.setMinutes(0);
        date2.setSeconds(0);
        date2.setMilliseconds(0);

        return date1.getTime() === date2.getTime();
    },

    removeDynamicFields: function() {
        var controller = GDF.util.getController();
        var liToRemove = controller.find("input[reference]");

        $.each(liToRemove, function (idx, elem) {
            $(elem).parent().remove();
        });

        liToRemove = controller.find("label[reference]");

        $.each(liToRemove, function (idx, elem) {
            $(elem).parent().remove();
        });
    },

    createDynamicFields: function(query, params, success) {
        // Remove old dynamic fields
        GDF.util.removeDynamicFields();

        var controller = GDF.util.getController();

        // config dynamic fields
        GDF.sql.query(query, params, function(dynamic) {
            if (dynamic.length === 0) {
                if (success) {
                    success();
                }
                return;
            }

            var ul = controller.find("ul[data-role=listview]");

            $.each(dynamic, function (idx, elem) {
                var dsc = GDF.util.pascalCase(elem.Description).removeWhiteSpaces().removeSpecialsChars();
                ul.append("<li><label for='" + dsc + "'>" + GDF.util.pascalCase(elem.Description) + "</label><input type='" + elem.Type + "' data-max-integers='" + elem.MaxInteger + "' data-max-decimals='" + elem.MaxDecimal + "' id='" + dsc + "' reference='" + elem.Reference + "' /></li>");
                $("#" + dsc).val(0);
            });

            GDF.numberPicker.configView(controller.view);

            if (success) {
                success();
            }
        });
    },

    /*
    requiredFields: Quando chamado, deve receber o controller que por sua vez deve possuir a propriedade requiredFields
    com um array com os ids dos campos no form a serem decorados com um asterisco. Usado junto à uma mensagem de erro de
    preenchimento de form.
    - controller: o controller. Exemplo: GDF.util.requiredFields(this); -> Caso chamado de dentro de um método de um controller.
    - error: se true, mostrar asteriscos, se false, limpá-los.
    - showOrDontIndexes: Refere ao índice do campo no array contido no controller.requiredFields. Serve para caso um ou mais
    desses campos(que são fixados no controller) não sejam exibidos como obrigatórios. Exemplo: 
    controller.requiredFields = ["CodOs", "Data", "CodFunc"] -> os três serão obrigatórios mais em algum momento não quero
    que a data seja decorada com o asterisco, então showOrDontIndexes = [1, 0, 1] -> onde o segundo índice refere-se ao 
    id "Data".
    */
    requiredFields: function(controller, error, showOrDontIndexes) {
        if (controller && controller.requiredFields) {
            var label = null;
            for (var i = 0; i < controller.requiredFields.length; i++) {
                if (typeof showOrDontIndexes === "undefined" || (typeof showOrDontIndexes[i] !== "undefined" && Boolean(showOrDontIndexes[i]))) {
                    label = $("#" + controller.requiredFields[i]).parent().find("label:first");
                    if (error && label.find("span").length === 0) {
                        label.append("<span>*</span>");
                    } else if (!error) {
                        label.find("span:first").remove();
                    }
                }
            }
        }
    },

    getController: function(ignoreUtilControllerCheck) {
        var controller = this._getController(ignoreUtilControllerCheck);

        if (!controller) {
            var errorMsg = "GDF.util.getController: controller not detected!";

            if (typeof console.warn === "function") {
                console.warn(errorMsg);
            } else if (typeof console.log === "function") {
                console.log(errorMsg);
            }
        }

        return controller;
    },

    _getController: function(ignoreUtilControllerCheck) {
        if (!GDF.kendoMobileApp) {
            return null;
        }

        var viewId = GDF.kendoMobileApp.view().id;
        viewId = viewId.replace("views/", "").replace(".html", "");

        if (viewId === "#lookup" || viewId === "#themecolor" || viewId === "#logviewer" || viewId === "#imageviewer") {
            return GDF.controllers[ignoreUtilControllerCheck ? viewId.slice(1) : self.lastController];
        }

        self.lastController = viewId;

        return GDF.controllers[viewId];
    },

    changeEntryState: function(tableName, dataItem, success) {
        GDF.db.onReady(function(theDb) {
            theDb[tableName]
                .filter(function(l) {
                    return l.Id === this.id;
                }, { id: dataItem.Id })
                .forEach(function(entry) {
                    theDb[tableName].attach(entry);
                    entry.Status = entry.Status === GDF.enums.Status.Opened ? GDF.enums.Status.Closed : GDF.enums.Status.Opened;
                    theDb.saveChanges().then(function() {
                        var self = GDF.util.getController();

                        if (self.ds) {
                            self.ds.read();
                        }
                        if (success) {
                            success(dataItem);
                        }
                    });
                });
        });
    },

    deleteData: function(tables, idfields, id, text, success) {
        GDF.messageBox({
            text: GDF.strings.deleteItem.format(text),
            no: true,
            yes: function() {
                if (!tables || !idfields || !id || tables.length !== idfields.length) {
                    return;
                }

                var self = GDF.util.getController();

                var deleteItem = function (idx) {
                    var query = "DELETE FROM " + tables[idx] + " WHERE " + idfields[idx] + " == ? ";
                    GDF.sql.query(query, id, function() {
                        if (idx < tables.length - 1) {
                            deleteItem(idx + 1);
                        } else {
                            if (self.ds) {
                                self.ds.read();
                            }

                            if (typeof GDF.util.checkEntries === "function") {
                                GDF.util.checkEntries();
                            }

                            if (success) {
                                success();
                            }
                        }
                    });
                };
                deleteItem(0);
            },
            cancel: false,
            ok: false
        });
    },

    deleteItem: function(tableToDelete, id, text, success) {
        GDF.messageBox({
            text: GDF.strings.deleteItem.format(text),
            no: true,
            yes: function() {
                var self = GDF.util.getController();
                GDF.db.onReady(function(theDb) {
                    var removalCompletionFunc = function() {
                        theDb.saveChanges().then(function() {
                            if (self.ds) {
                                self.ds.read();
                            }

                            if (typeof GDF.util.checkEntries == "function") {
                                GDF.util.checkEntries();
                            }

                            if (success) {
                                success();
                            }
                        });
                    };
                    GDF.db[tableToDelete]
                        .filter(function(h) {
                            return h.Id === this.id;
                        }, { id: id })
                        .forEach(function(entry) {
                            GDF.db[tableToDelete].remove(entry);
                        }).then(removalCompletionFunc);
                });
            },
            cancel: false,
            ok: false
        });
    },

    defineObsField: function (field) {
        if (field["startsWith"] && !field.startsWith("#")) {
            field = "#" + field;
        }

        field = $(field);
        field.attr("rows", 1);
        field.css("width", "100%");

        field.on("change paste keyup input", function() {
            var count = $.countLines(this);
            this.rows = count.visual;
        });
    },

    /*
    lookUp - Uso:
    title(string): título da lista
    fullTitle(bool, default: false): especifica que o título informado já está completo (ou seja, não precisa de "Lista de ...")
    template(string): O template do Kendo para ser usado na lista. Exemplo: #: CampoA :# -> CampoA referente ao campo na query.
    returnFields(array): Campos da query a serem retornados: ["CodOs", "CodPro", "CodFunc"].
    query(string): A query a ser executada.
    callback(function): função para receber o(s) valor(es) selecionado(s).
    selection(array, default: null): Um array com os itens da lista a serem exebidos selecionados. O código comparado é o primeiro item do returnFields.
    queryParams(json, default: null): Parâmetros a serem introduzidos à query na ordem dos parâmetros na cláusula where. Exemplo: {CodEmpr: 1, DscFunc: "João"}
    multiple(bool, default: false): Se a lista será ou não multiseleção.
    pageSize(number, default: 80): O número de itens da página. Aumentar se a listagem estiver bugando a renderização.
    block(bool, default: true): Determina se a aplicação será travada durante a consulta. Pode evitar alguns bugs de navegação.
    keyField(string, default: null): campo de código para pesquisa
    */
    lookUp: function(options) {
        var lookupParams = {
            template: options.template,
            fields: options.returnFields,
            title: options.title,
            query: options.query
        };

        if (typeof options.fullTitle !== "undefined") {
            lookupParams.fullTitle = options.fullTitle;
        }

        if (typeof options.multiple !== "undefined") {
            lookupParams.multiple = options.multiple;
        }

        if (typeof options.checkAll !== "undefined") {
            lookupParams.checkAll = options.checkAll;
        }

        if (options.keyField) {
            lookupParams.keyField = options.keyField;
        }

        if (options.pageSize) {
            lookupParams.pageSize = options.pageSize;
        }

        if (options.block) {
            lookupParams.blockApp = options.block;
        }

        if (options.callback) {
            lookupParams.callback = options.callback;
        }

        if (options.noDataMessage) {
            lookupParams.noDataMessage = options.noDataMessage;
        }

        if (options.queryParams) {
            lookupParams.queryParams = options.queryParams;
        }

        if (options.filters) {
            lookupParams.filters = options.filters;
        }

        if (options.selection) {
            lookupParams.selection = options.selection;
        }

        if (options.beforeClose) {
            lookupParams.beforeClose = options.beforeClose;
        }

        if (options.afterClose) {
            lookupParams.afterClose = options.afterClose;
        }

        // Identifica se a busca será ou não numérica, quando não informada segue o informado na configuração
        if (typeof options.numericSearch !== "undefined") {
            lookupParams.numericSearch = options.numericSearch;
        } else {
            lookupParams.numericSearch = GDF.settings.lookupSearchOption === "numeric";
        }

        GDF.controllers.lookup.options = lookupParams;
        GDF.kendoMobileApp.navigate("#lookup", "slide");
    },

    insertitem: function (options) {
        var insertItemParams = {
            query: options.query,
            queryParams: options.queryParams,
            template: options.template,
            callback: options.callback,
            keyField: options.keyField,
            titles: options.titles,
            fields: options.fields,
            itensList: options.itensList
        }

        GDF.controllers.insertitem.insertItemParams = insertItemParams;

        GDF.kendoMobileApp.navigate("#insertitem", "slide");
    },

    showMessage: function (message, duration) {
        if (typeof duration === "undefined") {
            duration = GDF.enums.Toast.Long;
        }

        if (typeof gatec !== "undefined" && typeof gatec.toast !== "undefined") {
            gatec.toast.show(message, duration);
        } else if (typeof window === "undefined" && typeof window.plugins === "undefined" && typeof window.plugins.toast === "undefined") {
            window.plugins.toast.show(message, duration === GDF.enums.Toast.Short ? "short" : "long", "bottom");
        } else {
            GDF.messageBox({
                text: message,
                timeout: GDF.settings.defaultMessageTime
            });
        }
    },

    correctDateForSerialize: function(date) {
        var correctedDate = new Date(date);

        correctedDate.setHours(correctedDate.getHours() - correctedDate.getTimezoneOffset() / 60);

        return correctedDate;
    },

    serializeDate: function(date) {
        var dateStr = this.correctDateForSerialize(date).toJSON();

        return dateStr.substr(0, dateStr.length - 1);
    },

    deserializeDate: function(dateStr) {
        var aDate = parseDate(dateStr);

        aDate.setHours(aDate.getHours() + aDate.getTimezoneOffset() / 60);

        return aDate;
    },

    firstUpper: function(text) {
        text = text.toLowerCase().trim();

        text = text.charAt(0).toUpperCase() + text.slice(1);

        return text;
    },

    formatMoney: function(value, decimal) {
        if (decimal) {
            if (Number(decimal) < 0) {
                return GDF.strings.errorInvalidDecimal;
            } else {
                var aux = value.split(".");
                if (aux[1]) {
                    var newDecimal = aux[1].length > 2 ? aux[1].length : 2;
                    if (newDecimal > decimal) {
                        newDecimal = decimal;
                    }
                    return kendo.toString(Number(value), "c" + newDecimal);
                }
            }
        }

        return kendo.toString(Number(value), "c");
    },

    pascalCase: function(str) {
        if (!str || typeof str !== "string") {
            return "";
        }

        str = str.trim().toLowerCase().replace(/(?:^|\s|^[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ])\w/g, function(match) {
            return match.toUpperCase();
        });

        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
    },    

    replaceAll: function(str, searchvalue, newValue) {
        return str.replace(new RegExp(searchvalue, "g"), newValue);
    },

    concat: function(array, field) {
        var text = "";

        $.each(array, function (idx, elem) {
            text += elem[field] + ", ";
        });

        text = text.substring(0, text.length - 2);

        return text;
    },

    getDeviceInfo: function (refObj) {

        if (typeof (device) != 'undefined') {
            refObj.VersionOs = device.version;
            refObj.DeviceModel = device.model;

            var platform = device.platform.toLowerCase();

            if (platform == "ios") {
                refObj.Os = GDF.enums.DeviceOs.iOS;
            }
            else if (platform == "windowsphone" || platform == "wince" || platform == "win32nt") {
                refObj.Os = GDF.enums.DeviceOs.WindowsPhone;
            }
            else if (platform == "android") {
                refObj.Os = GDF.enums.DeviceOs.Android;
            }
            else if (platform == "windowsmobile") {
                refObj.Os = GDF.enums.DeviceOs.WindowsMobile;
            }

        }
    },

    orientation: function () {
        if (screen.lockOrientation) {
            if (GDF.settings.orientation == "portrait") {
                screen.lockOrientation('portrait');
            } else if (GDF.settings.orientation == "landscape") {
                screen.lockOrientation('landscape');
            } else {
                screen.unlockOrientation();
            }
        }
    },

    invokeCallback: function (cb, data) {
        if (typeof cb != "function") {
            console.log("Inserção de objeto falhou: callback ausente");
        } else {
            cb(data);
        }
    }
};

GDF.gps = {
    getCoords: function (_success, _fail, _options) {
        var success = _success;
        var fail = _fail;
        var options = _options ? _options : {};

        options.timeout = options.timeout ? options.timeout : 25000;
        options.enableHighAccuracy = options.enableHighAccuracy;
        options.maximumAge = options.maximumAge ? options.maximumAge : 0;
        options.timeCheck = options.timeCheck ? options.timeCheck : 1;
        options.tryAgain = options.tryAgaion ? options.tryAgain : false;
        options.autoBlockUnblock = options.autoBlockUnblock;
        options.cleanAgps = GDF.settings.cleanAgps;

        if (typeof options.enableHighAccuracy === "undefined") {
            options.enableHighAccuracy = true;
        }

        if (typeof options.autoBlockUnblock === "undefined") {
            options.autoBlockUnblock = true;
        }

        if (options.autoBlockUnblock) {
            GDF.blockApp(GDF.strings.recoveringCoord);
        }

        var gpsError = function(error, tryAgain) {
            if (options.autoBlockUnblock) {
                GDF.unblockApp();
            }

            if (tryAgain) {
                GDF.messageBox({
                    text: GDF.strings.gpsError.format(error),
                    cancel: false,
                    ok: false,
                    yes: function() {
                        setTimeout(function() {
                            GDF.gps.getCoords(success, fail, options);
                        }, 500);
                    },
                    no: function() {
                        if (typeof fail === "function") {
                            fail();
                        }
                    }
                });
            } else if (typeof fail === "function") {
                fail(error);
            }
        };

        if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined" && "geolocation" in navigator) {
            var coords = {
                accuracy: 0,
                altitude: 0,
                altitudeAccuracy: 0,
                latitude: 0,
                longitude: 0,
                speed: 0
            };

            var i = 0;
            var geo = function() {
                navigator.geolocation.getCurrentPosition(function(position) {
                    coords.latitude += position.coords.latitude;
                    coords.longitude += position.coords.longitude;
                    coords.speed += position.coords.speed;
                    coords.altitudeAccuracy += position.coords.altitudeAccuracy;
                    coords.altitude += position.coords.altitude;
                    coords.accuracy += position.coords.accuracy;

                    if (i++ === options.timeCheck - 1) {
                        coords.latitude /= options.timeCheck;
                        coords.longitude /= options.timeCheck;
                        coords.speed /= options.timeCheck;
                        coords.altitudeAccuracy /= options.timeCheck;
                        coords.altitude /= options.timeCheck;
                        coords.accuracy /= options.timeCheck;

                        if (options.autoBlockUnblock) {
                            GDF.unblockApp();
                        }

                        if (typeof success === "function") {
                            success(coords);
                        }

                        return;
                    }
                    geo();
                }, gpsError, options);
            };
            geo();
        }

        // Quando GPS estiver desabilitado
        else {
            gpsError("GPS não habilitado!", options.tryAgain);
        }
    },

    getListTalhao: function (success, fail, callback) {
        if (!GDF.hasMapDb) {
            console.error("hasMapDb not informed on constants!");
            if (typeof fail === "function") {
                fail("Não foram carregados os mapas para a busca do talhão!");
            }
            return;
        }

        GDF.gps.getCoords(function (position) {
            // Seta a coordenada utilizada para filtrar talhões próximos
            var longitude = position.longitude;
            var latitude = position.latitude;

            // Comentário sobre como calcular o limite no fim do GDF.gps
            // 0.007 ≅ 0,800 Km
            var limit = 0.007;
            var vLatmin, vLatmax, vLongmin, vLongmax;

            // Configura limites para pesquisa
            if (latitude < 0.0) {
                vLatmin = latitude + limit;
                vLatmax = latitude - limit;
            } else {
                vLatmin = latitude - limit;
                vLatmax = latitude + limit;
            }

            if (longitude < 0.0) {
                vLongmin = longitude + limit;
                vLongmax = longitude - limit;
            } else {
                vLongmin = longitude - limit;
                vLongmax = longitude + limit;
            }

            // Configura filtro para recuperar talhões próximo a coordenada recuperada + limite
            var filter = function (elem) {
                return elem.X >= this.longMin && elem.X <= this.longMax &&
                    elem.Y >= this.latMin && elem.Y <= this.latMax;
            };

            // Executa filtro 
            GDF.mapDb.Maps.filter(filter, { longMin: vLongmin, longMax: vLongmax, latMin: vLatmin, latMax: vLatmax })
                .toArray(function (map) {
                    // Verifica se encontrou algum talhão
                    if (map.length === 0) {
                        GDF.unblockApp();
                        GDF.messageBox({
                            text: GDF.strings.gpsVectorNotFound,
                            cancel: false,
                            ok: false,
                            no: function () {
                                if (typeof callback == "function") {
                                    setTimeout(function () {
                                        var obj = { Latitude: latitude, Longitude: longitude };
                                        callback(obj);
                                    }, 500);
                                }
                            },
                            yes: function () {
                                setTimeout(function () {
                                    GDF.gps.getListTalhao(success, fail, callback);
                                }, 500);
                            }
                        });
                        return;
                    }
                    success(map, latitude, longitude);
                });
        }, function (error) {
            GDF.messageBox({
                text: GDF.strings.gpsError.format(error.message),
                cancel: false,
                ok: false,
                no: true,
                yes: function () {
                    setTimeout(function () {
                        GDF.gps.getListTalhao(success, fail, callback);
                    }, 500);
                }
            });
        },
        {
            tryAgain: true
        });
    },

    getTalhao: function (success, fail, callback) {
        if (!GDF.hasMapDb) {
            console.error("hasMapDb not informed on constants!");
            return;
        }

        GDF.gps.getListTalhao(function (map, latitude, longitude) {
            var isPointInPoly = function (poly, pt) {
                for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
                    ((poly[i]["1"] <= pt.y && pt.y < poly[j]["1"]) || (poly[j]["1"] <= pt.y && pt.y < poly[i]["1"]))
                        && (pt.x < (poly[j]["0"] - poly[i]["0"]) * (pt.y - poly[i]["1"]) / (poly[j]["1"] - poly[i]["1"]) + poly[i]["0"])
                        && (c = !c);
                }
                return c;
            };

            $.each(map, function (i, mapElem) {
                var a = eval(mapElem.GeometryCoordinates);
                var is = isPointInPoly(a, { x: longitude, y: latitude });
                if (is) {
                    if (success) {
                        mapElem.Latitude = latitude;
                        mapElem.Longitude = longitude;
                        success(mapElem);
                    }

                    return false; // break;
                }

                if (i === map.length - 1) {
                    GDF.unblockApp();
                    GDF.messageBox({
                        text: GDF.strings.gpsVectorNotFound,
                        cancel: false,
                        ok: false,
                        no: function () {
                            if (typeof callback == "function") {
                                setTimeout(function () {
                                    var obj = { Latitude: latitude, Longitude: longitude };
                                    callback(obj);
                                }, 500);
                            }
                        },
                        yes: function () {
                            setTimeout(function () {
                                GDF.gps.getTalhao(success, fail);
                            }, 500);
                        }
                    });
                }

                return true; // continue;
            });
        }, fail, callback);
    },

    updateMaps: function(success, fail) {
        function doFail(error, msg) {
            if (error) {
                console.log(error.code);
            }

            if (msg) {
                console.log(msg);
            }

            if (fail && typeof fail === "function") {
                fail(msg);
            } else {
                GDF.messageBox(msg);
            }

            GDF.unblockApp();
        }

        // Informa que não há mapa carregado, se o update ocorrer com sucesso, o mesmo deverá ser alterado para true
        GDF.settings.hasMap = false;

        if (!GDF.hasMapDb) {
            doFail(null, GDF.strings.constantMapError);
            return;
        }

        var url = "";

        GDF.blockApp(GDF.strings.startUpdateMap);

        document.addEventListener("deviceready", mapOnDeviceReady, false);

        function mapOnDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function(error) {
                doFail(error, GDF.strings.mapFileNotFound);
            });
        }

        function gotFS(fileSystem) {
            url += fileSystem.root.nativeURL;
            fileSystem.root.getDirectory("DOWNLOAD", { /*create: true*/  }, gotDir);
        }

        function gotDir(dirEntry) {
            dirEntry.getFile("map.geojson", { /*create: true, exclusive: false*/  }, gotFileEntry, function(error) {
                doFail(error, GDF.strings.mapFileNotFound);
            });
        }

        function gotFileEntry(fileEntry) {
            url += fileEntry.fullPath;
            url = url.replace("%simulator_persistent_root%/", "").replace("undefined", "");
            fileEntry.getMetadata(gotMetadata, function(error) {
                doFail(error, GDF.strings.mapFileNotFound);
            });
        }

        function gotMetadata(metadata) {
            // TODO - URL PARA DESENVOLVIMENTO
            //url = "http://10.0.1.6:10003/Update/GATEC_MAP/GATEC_MAP_16.geojson";

            $.ajax({
                dataType: "json",
                url: url,
                success: function(data) {
                    var dateModifiedFile = new Date(metadata.modificationTime);
                    GDF.mapDb.onReady(function(theDbMap) {
                        theDbMap.Header.count(function(length) {
                            var saveChanges = function() {
                                GDF.mapSql.clearTables(["Maps"], function () {
                                    GDF.blockApp(GDF.strings.updatingMap);

                                    // Se não encontrou dados retorna erro
                                    if (typeof data === "undefined" || data == null || data.length === 0) {
                                        doFail(null, "Mapa vázio ou não encontrado");
                                        return;
                                    }

                                    // Substituir , por . ao recuperar coordenadas
                                    // Cria automaticamente a key se a mesma nao foi informada
                                    $.each(data, function(idx, elem) {
                                        var newMap = {
                                            D1: elem.properties.D1,
                                            D2: elem.properties.D2,
                                            D3: elem.properties.D3,
                                            D4: elem.properties.D4,
                                            Empresa: elem.properties.EMPRESA,
                                            Safra: elem.properties.SAFRA,
                                            Key: elem.properties.KEY || (elem.properties.D1 + elem.properties.D2 + elem.properties.D3 + elem.properties.D4),
                                            X: isNaN(elem.properties.X) ? elem.properties.X.replace(",", ".") : elem.properties.X,
                                            Y: isNaN(elem.properties.Y) ? elem.properties.Y.replace(",", ".") : elem.properties.Y,
                                            GeometryCoordinates: elem.geometry.coordinates[0]
                                        };

                                        theDbMap.Maps.add(newMap);

                                        if (idx === data.length - 1) {
                                            theDbMap.saveChanges().then(function () {
                                                GDF.unblockApp();

                                                GDF.settings.hasMap = true;

                                                if (success) {
                                                    success();
                                                }
                                            }).fail(function (error) {
                                                doFail(null, error.message);
                                            });
                                        }
                                    });
                                });
                            };

                            // Mapa desatualizado - Atualiza mapas
                            if (length === 0) {
                                // New Header
                                var newHeader = {
                                    LastSync: new Date()
                                };

                                theDbMap.Header.add(newHeader);

                                saveChanges();
                            }
                            // Mapa atualizado
                            else if (length === 1) {
                                // Indica que há mapa
                                GDF.settings.hasMap = true;

                                // Verifica se o mapa já está atualizado
                                // Update Header
                                theDbMap.Header.filter("it.Id == this.Id", { Id: 1 }).take(1).forEach(function(editHeader) {
                                    if (dateModifiedFile < Number(editHeader.LastSync)) {
                                        doFail(null, GDF.strings.mapAlreadyUpdated);
                                        return;
                                    }

                                    // Atualiza
                                    theDbMap.Header.attach(editHeader);

                                    editHeader.LastSync = new Date();

                                    saveChanges();
                                });
                            }
                        });
                    });
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    doFail(error, jqXhr && jqXhr.responseText && jqXhr.responseText !== "" ? jqXhr.responseText : GDF.strings.mapUpdateError);
                }
            });
        }
    }
};

/*
===* Como converter coordenada GPS do padrão decimal (30,263888889°)  para o padrão grau, minuto e segundo (30° 15' 50'') *===

----------- Definições

Coordenada: -22,67461801

A = -22
B = 0,67461801

G - Graus da coordenada
M - Minutos da coordenada
S - Segundos da coordenada

----------- Fórmulas / Exemplo

G = A => -22°

M = INT(B x 60) => INT(0,67461801 x 60) => INT(40,4770806) => 40'

S =  INT((B - (M/60)) * 3600) =>  INT((0,67461801 - (40/60)) * 3600) => INT((0,67461801 - 0,66666667) * 3600) => INT(0,00795134 * 3600) => 28''

=======================

 
 ===* Cálculo de KM a partir de alterações na coordenada em grau, minuto e segundo *=== 

----------- Base para conversão 
 
1° - 111,045 Km
1' - 1,851 Km
1'' - 0,032Km

Ex:
    Parametro para alteração: 0,01

Coordenada Inicial: -22,67461801 
Coordenada alterada: -22,66461801 (Coordenada Inicial + Parametro para alteração)

Coordenada Inicial em graus: -22° 40' 28''
Coordenada alterada em graus: -22 39' 52''

Diferença: 1' 24''

Diferença em km =  1(1,851) + 24(0,032) =  2,619 Km

=======================
*/;

GDF.numberPicker = {
    _tapFirst: false,
    didSetup: false,
    elementId: "GANumberPicker",
    width: kendo.support.mobileOS.tablet ? 300 : 200,
    height: kendo.support.mobileOS.tablet ? 420 : 295,
    element: null,
    modalView: null,
    navBar: null,
    valueElement: null,
    editingField: null,
    editingValue: "",
    originalValue: "",
    defaultMaxIntegerPlaces: 12,
    defaultMaxDecimalPlaces: 0,
    maxIntegerPlaces: 12,
    maxDecimalPlaces: 0,
    minValue: undefined,
    maxValue: undefined,
    hasFormat: false,
    variableIntegerPlaces: false,
    field: undefined,
    success: undefined,

    setup: function () {
        if (this.didSetup) {
            return;
        }

        this.didSetup = true;
        var self = this;
        var modalViewHtml = this.buildModalViewHtml();

        $(document.body).append(modalViewHtml);

        this.element = $("#" + this.elementId);

        this.modalView = this.element.kendoMobileModalView({
            modal: false
        }).data("kendoMobileModalView");

        this.modalView.bind("close", GDF.handleModalCloseAuto);

        this.element.closest(".km-modalview-root").css({
            "z-index": 10800
        });

        this.navBar = this.element.find("[data-role=navbar]:first").data("kendoMobileNavBar");
        this.valueElement = this.element.find(".ga-number-picker-value:first");

        this.element.find("a[data-picker-val]")
            .onTap(function () {
                GDF.numberPicker.input($(this).data("picker-val"));
                self._tapFirst = true;
            })
            .click(function () {
                if (!self._tapFirst) {
                    GDF.numberPicker.input($(this).data("picker-val"));
                }

                self._tapFirst = false;
            });
    },

    buildModalViewHtml: function () {
        var thisHtml = "";
        var decimalSeparator = kendo.culture().numberFormat["."];
        var basicAttributes = " data-role=\"button\"";

        thisHtml += "<div id=\"" + this.elementId + "\" style=\"width: " + this.width + "pt; height: " + this.height + "pt; \" class=\"ga-number-picker\">";
        thisHtml += "<div data-role=\"navbar\">";
        thisHtml += "<a" + basicAttributes + " id=\"npbackbtn\" data-align=\"left\" data-picker-val=\"Q\" data-icon=\"left-arrow\" class=\"ok\"></a>";
        thisHtml += "</div>";
        thisHtml += "<div class=\"ga-number-picker-value\"></div>";
        thisHtml += "<div class=\"ga-number-picker-buttons\">";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"7\">7</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"8\">8</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"9\">9</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"B\" data-icon=\"reply\" class=\"special\"></a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"4\">4</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"5\">5</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"6\">6</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"C\" data-icon=\"delete\" class=\"special\"></a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"1\">1</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"2\">2</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"3\">3</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"R\" data-icon=\"history\" class=\"special\"></a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\".\" class=\"special\">" + decimalSeparator + "</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"0\">0</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"-\" class=\"special\">+/-</a>";
        thisHtml += "<a" + basicAttributes + " data-picker-val=\"OK\" class=\"ok\">OK</a>";
        thisHtml += "</div>";
        thisHtml += "</div>";

        return thisHtml;
    },

    configView: function (view) {
        this.setup();

        var numericFields = view.element.find("input[class=number], .numberPicker");

        $.each(numericFields, function (index, field) {
            GDF.numberPicker.configField($(field));
        });
    },

    triggerOpen: function (event, field) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        field.data("mouseDown", false);

        GDF.numberPicker.open(field, event);
    },

    triggerSave: function (event) {
        event.preventDefault();
        GDF.numberPicker.save();
    },

    buttonClick: function (event) {
        event.preventDefault();
        var field = this.element;
        var pickerVal = field.data("picker-val");
        GDF.numberPicker.input(pickerVal);
    },

    configField: function (field) {
        if (field.data("numberPicker")) {
            return;
        }

        field.data("numberPicker", true);
        field.on("mousedown", this.mouseDownEvent);
        field.on("click", this.clickEvent);
        field.on("focus", this.focusEvent);
    },

    focusEvent: function (event) {
        var field = $(this);

        if (field.data("mouseDown") !== true) {
            GDF.numberPicker.triggerOpen(event, field);
        }
    },

    mouseDownEvent: function () {
        $(this).data("mouseDown", true);
    },

    clickEvent: function (event) {
        var field = $(this);

        if (field.data("mouseDown") === true) {
            GDF.numberPicker.triggerOpen(event, field);
        }
    },

    removePicker: function (field) {
        if (!field.data("numberPicker")) {
            return;
        }

        field.data("numberPicker", false);
        field.off("mousedown", this.mouseDownEvent);
        field.off("click", this.clickEvent);
        field.off("focus", this.focusEvent);
    },

    setTitle: function (text) {
        this.navBar.centerElement.html(text);
    },

    open: function (field, options) {
        var self = this;

        // Recupera opções se houver.
        var title = options && options["title"] ? options["title"] : null;
        GDF.numberPicker.success = options && options["success"] ? options["success"] : undefined;

        // Atribui ao numberpicker o field atual
        self.field = field;

        var preventKeyboardFunc = function () {
            hideKeyboard();
            self.element.find("a[data-picker-val=OK]:first").focus();
        };

        preventKeyboardFunc();

        window.setTimeout(preventKeyboardFunc, 0);
        window.setTimeout(preventKeyboardFunc, 25);
        window.setTimeout(preventKeyboardFunc, 50);
        window.setTimeout(preventKeyboardFunc, 100);
        window.setTimeout(preventKeyboardFunc, 200);

        var execMethod = field.data("open-check");
        if (execMethod) {
            var execController = field.data("open-check-controller");
            if (!execController) {
                execController = field.closest("[data-role=view]").prop("id");
            }

            if (execController) {
                var theController = GDF.controllers[execController];
                if (theController) {
                    if (typeof theController[execMethod] === "function") {
                        if (!theController[execMethod]()) {
                            return;
                        }
                    }
                }
            }
        }

        // Verifica se o 'field' est� apto a receber valor nulo, e se o valor � vazio
        var fieldFormattedValue;
        if (field.data("allownull") && field.val() == "") {
            fieldFormattedValue = field.val();
        } else {
            fieldFormattedValue = GDF.util.formatNumber(field.numVal());
        }

        var maxIntegersData = field.data("max-integers");
        var maxDecimalsData = field.data("max-decimals");
        var formatData = field.data("format");

        this.hasFormat = typeof formatData !== "undefined" && /\d+,\d+/.test(formatData);
        this.editingField = field;
        this.originalValue = fieldFormattedValue;
        this.editingValue = fieldFormattedValue;

        if (this.hasFormat) {
            var formatParts = formatData.split(",");
            this.maxIntegerPlaces = kendo.parseInt(formatParts[0]);
            this.maxDecimalPlaces = kendo.parseInt(formatParts[1]);
        } else {
            this.maxIntegerPlaces = typeof maxIntegersData !== "undefined" ? kendo.parseInt(maxIntegersData) : this.defaultMaxIntegerPlaces;
            this.maxDecimalPlaces = typeof maxDecimalsData !== "undefined" ? kendo.parseInt(maxDecimalsData) : this.defaultMaxDecimalPlaces;
        }

        // GetMax e Min Values
        this.minValue = field.data("min-value");
        this.maxValue = field.data("max-value");
        this.element.find("a[data-picker-val='-']").css("visibility", field.data("negative") ? "visible" : "hidden");
        this.element.find("a[data-picker-val='.']").css("visibility", field.data("decimal") || this.maxDecimalPlaces > 0 ? "visible" : "hidden");

        // Recupera title, se não contrar continua recuperando do label referênte ao input
        if (!title || title == null) {
            title = field.data("title") || GDF.util.getResourceText(field);
        }

        if (title.length >= 15 && (title != undefined || title != null)) {
            $(".ga-number-picker .km-navbar .km-view-title").css("font-size", "1em");
        } else {
            $(".ga-number-picker .km-navbar .km-view-title").css("font-size", "1.25em");
        }

        this.setTitle(title);

        this.update();

        this.modalView.open();

        window.setTimeout(function () {
            $(window).trigger("resize");
        }, 500);
    },

    save: function () {
        // Recupera par�metro do 'field' que indica se pode ou n�o inserir valor nulo
        var allowNull = this.field.data("allownull");

        // Recupera par�metro do 'field' que indica se pode ou n�o inserir o valor 0
        var allow0 = this.field.data("allow0");

        // Verifica se o valor informado é diferente de ""
        var value = "";
        var decimalSeparator = kendo.culture().numberFormat["."];
        if (decimalSeparator == ",") {
            value = this.editingValue != "" ? Number(this.editingValue.replace(/\./g, "").replace(",", ".")) : "";
        } else {
            value = this.editingValue != "" ? Number(this.editingValue.replace(",", ".")) : "";
        }

        // Checka se algum valor foi informado
        if ((!allowNull && value === "") || (!allow0 && value === 0)) {
            GDF.messageBox({
                text: GDF.strings.erroNoValue
            });
            return;
        }

        // Checka se o valor informado est� dentro do limite m�ximo e m�nimo        
        if ((typeof (this.minValue) != undefined) && (value !== "") && (value < this.minValue)) {
            GDF.messageBox({
                text: GDF.strings.errorMinValue + " (" + this.minValue + ")."
            });
            return;
        }

        if ((typeof (this.maxValue) != undefined) && (value !== "") && (value > this.maxValue)) {
            GDF.messageBox({
                text: GDF.strings.errorMaxValue + " (" + this.maxValue + ")."
            });
            return;
        }

        // Configura retorno
        this.editingField.val(value).trigger("change");

        if (typeof GDF.numberPicker.success === "function") {
            GDF.numberPicker.success();
        } else {
            this.quit();
        }
    },

    update: function () {
        var decimalSeparator = kendo.culture().numberFormat["."];
        if (decimalSeparator == ",") {
            var v = this.editingValue.split(",");
            this.editingValue = v[0].replace(/\./g, "").split(/(?=(?:\d{3})+(?:$))/g).join(".") + (v.length > 1 ? "," + v[1] : "");
            this.valueElement.html(this.editingValue);
        } else {
            this.valueElement.html(this.editingValue);
        }
    },

    resetCurrentValue: function () {
        var self = GDF.numberPicker;

        self.editingValue = "";

        if (self.field.data("allownull")) {
            self.valueElement.html("");
        } else {
            self.valueElement.html(0);
        }
    },

    quit: function () {
        GDF.closeModal(this.modalView);
    },

    input: function (inputVal) {
        if (typeof inputVal === "undefined") {
            return;
        }

        inputVal = inputVal.toString().toLowerCase();

        if (!/^(ok|\d|[bqcr\.-])$/i.test(inputVal)) {
            return;
        }

        var decimalSeparator = kendo.culture().numberFormat["."];
        var maxIntegers = this.maxIntegerPlaces;
        var maxDecimals = this.maxDecimalPlaces;
        var valueHasDecimalSeparator = this.editingValue.indexOf(decimalSeparator) > -1;
        var valueParts = this.editingValue.split(decimalSeparator);

        if (this.hasFormat) {
            if (this.variableIntegerPlaces) {
                var dif = valueParts[0].length - (maxIntegers - this.maxDecimalPlaces);
                if (dif < 0) {
                    dif = 0;
                }
                maxDecimals -= dif;
                if (maxDecimals < 0) {
                    maxDecimals = 0;
                }
            } else {
                maxIntegers -= maxDecimals;
                if (maxIntegers < 1) {
                    maxIntegers = 1;
                }
            }
        }

        if (!isNaN(inputVal)) { // numerics
            if (this.editingValue === "0") {
                this.editingValue = inputVal;
            } else if (this.editingValue === "-0") {
                this.editingValue = "-" + inputVal;
            } else if (valueHasDecimalSeparator) {
                if (valueParts[1].length < maxDecimals) {
                    this.editingValue += inputVal;
                } else {
                    return;
                }
            } else {
                if (this.editingValue.length < maxIntegers) {
                    this.editingValue += inputVal;
                } else {
                    return;
                }
            }
        } else if (inputVal === ".") { // decimal separator
            if (!valueHasDecimalSeparator && maxDecimals > 0) {
                if (this.editingValue === "") {
                    this.editingValue = "0";
                } else if (this.editingValue === "-") {
                    this.editingValue = "-0";
                }
                this.editingValue += decimalSeparator;
            }
        } else if (inputVal === "-") { // switch between negative and positive number
            if (this.editingValue.indexOf("-") === 0) {
                this.editingValue = this.editingValue.substr(1, this.editingValue.length - 1);
            } else {
                this.editingValue = "-" + this.editingValue;
            }
        } else if (inputVal === "b") { // backspace
            if (this.editingValue !== "-") {
                this.editingValue = this.editingValue.substr(0, this.editingValue.length - 1);
            } else {
                return;
            }
        } else if (inputVal === "c") { // clear
            this.editingValue = "";
        } else if (inputVal === "r") { // reset to original value
            this.editingValue = this.originalValue;
        } else if (inputVal === "ok") { // save and close
            this.save();
            return;
        } else if (inputVal === "q") {
            this.quit();
            return;
        }

        this.update();
    }
};

GDF.media = {
    _jpegEncoder: null,

    // -----------------------------------------------------------------------
    // OPTIONS
    // -----------------------------------------------------------------------
    THUMB_SIZE: 100,
    MAX_SIZE: 2048,
    QUALITY: 0.7,
    CUSTOM_IMG_ENCODER: false,

    _getAudioCaptureOptions: function() {
        return {
            limit: 1
        };
    },

    _getCameraOptions: function() {
        return {
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            quality: this.QUALITY * 100,
            targetWidth: this.MAX_SIZE,
            targetHeight: this.MAX_SIZE
        };
    },

    // -----------------------------------------------------------------------
    // AUDIO
    // -----------------------------------------------------------------------
    recordAudioBase64: function(callback, dialogStrings, basePath, recordTime) {
        if (typeof callback !== "function") {
            return;
        }

        var self = this;
        var successFunc;
        var audioPlugin;
        var idPlugin = 0;

        if (typeof audiorecorder !== "undefined") {
            audioPlugin = audiorecorder;
        }

        if (typeof audioPlugin === "undefined" && typeof audioutils !== "undefined") {
            audioPlugin = audioutils;
            idPlugin = 1;
        }

        if (typeof audioPlugin === "undefined" && typeof gatec !== "undefined" && typeof gatec.audio !== "undefined") {
            audioPlugin = gatec.audio;
            idPlugin = 2;
        }

        if (typeof audioPlugin !== "undefined") {
            GDF.blockApp("Preparando captura de áudio");

            successFunc = function (fileEntry) {
                self._audioGetFileEntrySuccess(fileEntry, callback);
            };

            var audioPluginCallback = function(status) {
                if (/\/?([\w\s]+\/?)[\w\s]+\.[\w]{3,4}$/i.test(status)) {
                    window.resolveLocalFileSystemURI("file://" + status, successFunc, self._audioGetFileEntryError);
                } else {
                    GDF.unblockApp();
                    GDF.messageBox("Audio Recorder Error: " + status);
                }
            };

            if (idPlugin === 0) {
                audioPlugin.start(dialogStrings, audioPluginCallback);
            } else if (idPlugin === 1) {
                audioPlugin.start(dialogStrings, basePath, audioPluginCallback);
            } else {
                audioPlugin.start(dialogStrings, basePath, 10, audioPluginCallback);
            }

            return;
        }

        if (typeof navigator === "undefined" || !navigator.device || !navigator.device.capture || !navigator.device.capture.captureAudio) {
            return;
        }

        GDF.blockApp("Iniciando captura de áudio");

        var audioCaptureOptions = self._getAudioCaptureOptions();

        successFunc = function (mediaFiles) {
            self._audioCaptureSuccess(mediaFiles, callback);
        };

        navigator.device.capture.captureAudio(successFunc, self._audioCaptureError, audioCaptureOptions);
    },

    _audioCaptureSuccess: function(mediaFiles, callback) {
        var self = this;

        var success = function (fileEntry) {
            self._audioGetFileEntrySuccess(fileEntry, callback);
        };

        for (var i = 0; i < mediaFiles.length && i < 1; i++) {
            var mediaFile = mediaFiles[i];
            window.resolveLocalFileSystemURI(mediaFile.fullPath, success, self._audioGetFileEntryError);
        }
    },

    _audioGetFileEntrySuccess: function(fileEntry, callback) {
        var self = this;

        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                var soundData = evt.target.result;
                var soundBase64 = soundData.split("base64,")[1];
                GDF.unblockApp();
                callback(soundBase64);
            };
            reader.onerror = function(error) {
                GDF.unblockApp();
                GDF.messageBox("Fire Writer Error (" + error.code + "): " + error.message);
            };
            reader.readAsDataURL(file);
        }, self._audioGetFileError);
    },

    _audioCaptureError: function(error) {
        GDF.unblockApp();
        GDF.messageBox("Audio Capture Error: " + error.code);
    },

    _audioGetFileEntryError: function(error) {
        GDF.unblockApp();
        GDF.messageBox("Get File Entry Error: " + error.code);
    },

    _audioGetFileError: function(error) {
        GDF.unblockApp();
        GDF.messageBox("Get File Error: " + error.code);
    },

    playAudioBase64: function(audioData, callback) {
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSystem) {
            fileSystem.root.getFile("tempAudio.3ga", { create: true }, function(newFileEntry) {
                    newFileEntry.createWriter(function(fileWriter) {
                            fileWriter.onwrite = function(writeEvent) {
                                var fileName = writeEvent.target.fileName || newFileEntry.nativeURL || writeEvent.target.localURL;

                                var mediaObject = new Media(fileName /*newFileEntry.fullPath*/, function () {
                                }, function(e) {
                                    GDF.messageBox("Media Error (" + e.code + "): " + e.message);
                                });

                                if (mediaObject) {
                                    mediaObject.play();
                                    if (typeof callback === "function") {
                                        callback(mediaObject);
                                    }
                                }
                            };

                            fileWriter.onerror = function (error) {
                                GDF.messageBox("Fire Writer Error (" + error.code + "): " + error.message);
                            };

                            fileWriter.write(Base64Binary.decodeArrayBuffer(audioData));
                        },
                        function(error) {
                            GDF.messageBox({
                                text: "Get/Create Writer Error: " + error.code
                            });
                        });
                },
                function(error) {
                    GDF.messageBox("Get/Create File Error: " + error.code);
                });
        }, function(e) {
            GDF.messageBox("Get File System Error: " + evt.target.error.code);
        });
    },

    // -----------------------------------------------------------------------
    // PICTURES
    // -----------------------------------------------------------------------
    takePictureBase64: function(callback) {
        if (!navigator || !navigator.camera || !navigator.camera.getPicture) {
            return;
        }

        if (typeof callback !== "function") {
            return;
        }

        GDF.blockApp(true);

        var self = this;
        var cameraOptions = self._getCameraOptions();

        var success = function (imageData) {
            self._cameraSuccess(imageData, callback);
        };

        navigator.camera.getPicture(success, this._cameraError, cameraOptions);
    },

    choosePictureBase64: function(callback) {
        if (!navigator || !navigator.camera || !navigator.camera.getPicture) {
            return;
        }

        if (typeof callback !== "function") {
            return;
        }

        GDF.blockApp(true);

        var self = this;
        var cameraOptions = self._getCameraOptions();
        cameraOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

        var success = function (imageData) {
            self._cameraSuccess(imageData, callback);
        };

        navigator.camera.getPicture(success, self._cameraError, cameraOptions);
    },

    _cameraSuccess: function(imageData, callback) {
        var self = this;
        var img = document.createElement("img");
        var imageDataURL = "data:image/jpeg;base64," + imageData;

        img.addEventListener("load", function () {
            var imageObject = {
                original: imageDataURL,
                fullSize: self._resizeImageData(this, imageDataURL, self.QUALITY, self.MAX_SIZE),
                thumbnail: self._resizeImageData(this, imageDataURL, 1, self.THUMB_SIZE)
            };

            $(this).remove();

            callback(imageObject);

            GDF.unblockApp();
        }, false);

        img.src = imageDataURL;

        $(document.body).append(img);

        img.style.display = "none";
    },

    _cameraError: function(message) {
        GDF.unblockApp();
        GDF.util.toast(message);
    },

    _resizeImageData: function(image, originalImageData, quality, maxWidth, maxHeight) {
        if (typeof maxWidth === "undefined") {
            return originalImageData;
        }

        if (typeof maxHeight === "undefined") {
            maxHeight = maxWidth;
        }

        var self = this;
        var imageData = originalImageData;
        var width = image.width;
        var height = image.height;
        var sizeChanged = false;

        if (width > height) {
            if (width > maxWidth) {
                sizeChanged = true;
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                sizeChanged = true;
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        var invalidImageDataRegex = /image\/png|^data:,/i;

        if (!imageData || sizeChanged || invalidImageDataRegex.test(imageData)) {
            if (!self._canvas) {
                self._canvas = document.createElement("canvas");
            }

            var canvas = self._canvas;
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);

            if (!self.CUSTOM_IMG_ENCODER) {
                imageData = canvas.toDataURL("image/jpeg", quality);
            }

            if (self.CUSTOM_IMG_ENCODER || invalidImageDataRegex.test(imageData)) {
                self.CUSTOM_IMG_ENCODER = true;

                if (!self._jpegEncoder) {
                    self._jpegEncoder = new JPEGEncoder();
                }

                imageData = self._jpegEncoder.encode(ctx.getImageData(0, 0, width, height), quality * 100);
            }
        }

        return imageData;
    }
};

GDF.setupNodeWebKit = function() {
    navigator.geolocation = navigator.geolocation || {};

    if (navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.oldGetCurrentPosition = navigator.geolocation.getCurrentPosition;
    }

    // using suggestion from https://github.com/rogerwang/node-webkit/issues/236
    navigator.geolocation.getCurrentPosition = function(callback, errorCallback) {
        if (typeof callback !== "function") {
            callback = function() {
            };
        }

        if (typeof errorCallback !== "function") {
            errorCallback = function() {
            };
        }

        var createError = function(msg) {
            var error = new Error(msg);

            error.UNKNOWN_ERROR = 0;
            error.PERMISSION_DENIED = 1;
            error.POSITION_UNAVAILABLE = 2;
            error.TIMEOUT = 3;
            error.code = error.UNKNOWN_ERROR;

            return error;
        };

        $.ajax({
            type: "GET",
            url: "https://maps.googleapis.com/maps/api/browserlocation/json?browser=chromium&sensor=true",
            dataType: "json",
            success: function(data) {
                if (data.status === "OK") {
                    var position = {
                        coords: {
                            latitude: data.location.lat,
                            longitude: data.location.lng,
                            accuracy: data.accuracy,
                            altitude: -1,
                            altitudeAccuracy: -1,
                            heading: -1,
                            speed: -1,
                            timestamp: (new Date()).getTime()
                        }
                    };
                    callback(position);
                } else {
                    errorCallback(createError(data.status));
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                errorCallback(createError(errorThrown));
            }
        });
    };
};

GDF.controllers.lookup = {
    autoScrollToTop: true,
    ds: null,
    dsOptions: null,
    listView: null,
    blockApp: false,
    multiple: false,
    checkAll: false,
    callback: null,
    baseTemplate: "",
    noDataMessage: "",
    returnFields: [],
    listTemplate: "",
    listSelection: [],
    defaultPageSize: 80, // param pageSize(number)
    defaultBlockApp: true, // param blockApp(true|false)
    defaultFullTitle: false, // param fullTitle(true|false)
    defaultMultiple: false, // param multiple(true|false)
    defaultCheckAll: false, // param checkAll(true|false)
    beforeClose: null,
    afterClose: null,
    result: undefined, // Aramazena o resultado a ser enviado no callback
    numericSearch: false, // Identifica se a busca sera numerica ou nao
    hasnodata: false,
    usefilter: false,
    multiplekey: "key",
    selectAll: false,
    unselectAll: false,

    viewBeforeShow: function () {
        var self = GDF.controllers.lookup;
        if (self.ds) {
            self.ds.data([]);
            self.listView.setDataSource(null);
        }
    },

    viewInit: function (e) {
        var self = GDF.controllers.lookup;

        self.dsOptions = {
            query: "",
            queryFilters: [],
            queryParams: [],
            keyField: null,
            start: function () {
                if (self.blockApp) {
                    GDF.blockApp(true);
                }
            },
            end: function () {
                if (self.blockApp) {
                    GDF.unblockApp();
                }
            }
        };

        self.ds = GDF.sql.createKendoDataSource({
            change: function () {
                // Quando clicar no botão para deselecionar todos
                if (self.unselectAll || self.selectAll) {
                    self.listSelection = [];
                }

                if (!self.hasnodata && self.multiple) {
                    $.each(this.data(), function (i, item) {
                        var key = "";

                        var obj = {};
                        $.each(self.returnFields, function (j, field) {
                            obj[field] = item[field];
                            key += item[field];
                        });

                        // Adiciona chave utilizada para identifica��o m�ltipla
                        item[self.multiplekey] = key;
                        obj[self.multiplekey] = key;

                        // Primeiro carregamento dos dados
                        if (self.firsttime) {
                            // Estiver marcado para selecionar todos, e nao estiver na lista de selecao 
                            if (self.checkAll && self.listSelection.filter(function (fitem) {
                                return fitem[self.multiplekey] == obj[self.multiplekey];
                            }).length === 0) {
                                self.listSelection.push(obj);
                            }
                        }

                        // Quando clicar no botão para selecionar todos
                        if (self.selectAll) {
                            self.listSelection.push(obj);
                        }
                    });

                    self.firsttime = false;
                }
            },
            schema: {
                parse: function (data) {
                    if (data.length === 0) {
                        self.hasnodata = true;
                        data = [{ Message: self.noDataMessage, IsNoDataMessage: true }];
                    } else {
                        self.hasnodata = false;
                    }
                    //Chamado [80572] - Quando pesquisar, forçar um ScrollToTop no final da pesquisa
                    scrollListViewToTop(e.view.element.find("[data-role=listview]"));
                    self.listView.refresh();
                    return data;
                }
            }
        }, self.dsOptions);

        self.listView = self.find("#list-lookup").kendoMobileListView({
            dataSource: self.ds,
            pullToRefresh: true,
            autoBind: false,
            endlessScroll: true,
            virtualViewSize: self.defaultPageSize,
            template: "#= GDF.controllers.lookup.parseTemplate(data) #",
            filterable: {
                field: "Dummy",
                operator: "startswith",
                placeholder: GDF.strings.searchPlaceHolder
            },
            click: function (e) {
                if (self.multiple || e.dataItem.IsNoDataMessage) {
                    return;
                }

                var listSelection = {};

                var returnFields = self.returnFields;

                for (var i = 0; i < returnFields.length; i++) {
                    var returnField = returnFields[i];

                    var returnValue = e.dataItem[returnField];

                    if (typeof returnValue !== "undefined") {
                        listSelection[returnField] = returnValue;
                    }
                }

                // Configura resultado a ser retornado
                self.result = listSelection;

                var callback = self.callback;

                if (callback) {
                    callback(self.result);
                }

                GDF.kendoMobileApp.navigate("#:back");
            }
        }).data("kendoMobileListView");
    },

    viewShow: function (e) {
        var self = GDF.controllers.lookup;

        if (!self.options) {
            return;
        }

        var params = [];
        var readData = {};

        var titleParam = self.options.title;
        var fullTitle = typeof self.options.fullTitle !== "undefined" ? self.options.fullTitle : self.defaultFullTitle;
        var pageSize = typeof self.options.pageSize !== "undefined" ? self.options.pageSize : self.defaultPageSize;
        var filters = typeof self.options.filters !== "undefined" ? self.options.filters : [];
        var keyField = typeof self.options.keyField !== "undefined" ? self.options.keyField : null;

        self.blockApp = typeof self.options.blockApp !== "undefined" ? self.options.blockApp : self.defaultBlockApp;
        self.multiple = typeof self.options.multiple !== "undefined" ? self.options.multiple : self.defaultMultiple;
        self.checkAll = typeof self.options.checkAll !== "undefined" ? self.options.checkAll : self.defaultCheckAll;
        self.noDataMessage = typeof self.options.noDataMessage !== "undefined" ? self.options.noDataMessage : GDF.strings.lookUpNoDataDefaultMessage;

        // Slice - para clonar o array em questão e evitar problemas de referências cruzadas
        self.listSelection = typeof self.options.selection !== "undefined" ? self.options.selection.slice(0) : [];

        self.callback = typeof self.options.callback === "function" ? self.options.callback : null;
        self.beforeClose = typeof self.options.beforeClose === "function" ? self.options.beforeClose : null;
        self.afterClose = typeof self.options.afterClose === "function" ? self.options.afterClose : null;
        self.numericSearch = self.options.numericSearch;
        self.baseTemplate = self.options.template;
        self.returnFields = self.options.fields;
        self.firsttime = true;

        // Limpa result
        self.result = undefined;

        if (typeof self.options.queryParams !== "undefined") {
            var pars = self.options.queryParams;
            for (var p in pars) {
                params.push(p.toString());
                readData[p] = pars[p];
            }
        }

        self.listTemplate = self.buildTemplate();
        self.find("[data-role=navbar]:first").data("kendoMobileNavBar").title(
            fullTitle ? titleParam : GDF.strings.lookUpTitle.format(titleParam)
        );

        self.ds.options.transport.read.data = readData;

        self.listView.options.virtualViewSize = pageSize;

        self.dsOptions.query = self.options.query;
        self.dsOptions.queryFilters = filters;
        self.dsOptions.queryParams = params;
        self.dsOptions.keyField = keyField;

        // Configura forma de entrada dos dados de filtro
        var searchField = self.find("[type=\"search\"]");
        if (self.numericSearch) {
            GDF.numberPicker.configField(searchField);
        } else {
            GDF.numberPicker.removePicker(searchField);
        }

        if (searchField.val() === "") {
            self.ds.filter("");
        } else {
            searchField.val("").trigger("change");
        }

        var saveButtonElement = self.find(".save-button");
        saveButtonElement.css("display", self.multiple ? "" : "none");

        // Exibe ou nao a navbar que contem o botao de selecao
        var selectFooter = this.find(".select-footer");
        selectFooter.css("display", this.multiple ? "" : "none");

        // Configura posição do estilo se tiver footer utiliza para calcular a posição, caso contrario utiliza o default 0 
        // Cria estilo inicial
        var style = "display: none;";

        var verticalPosRef = 0;
        if (this.multiple) {
            verticalPosRef += self.find(".km-footer").height();
        }

        // Adiciona a posição ao estilo
        style += " bottom: " + verticalPosRef + "px !important";

        // Adiciona o estilo        
        self.find(".km-header").find(".list-up-div").attr("style", style);

        //Exibindo botao de selecao
        var selectButton = this.find(".select-button");

        // Configura estado inicial do seletor
        self.selectState = Array.isArray(self.listSelection) && self.listSelection.length > 0;
        self.selectAll = false;
        self.unselectAll = false;

        // Configura texto do select all inicial
        selectButton.html(self.selectState ? GDF.strings.unselectAllLabel : GDF.strings.selectAllLabel);

        // Configura ação do botão
        selectButton.unbind().bind("click", function () {
            self.selectState = !self.selectState;

            self.selectAll = self.selectState;
            self.unselectAll = !self.selectState;

            selectButton.html(self.selectState ? GDF.strings.unselectAllLabel : GDF.strings.selectAllLabel);

            self.ds.read();
        });

        if (this.beforeClose) {
            var cancelButtonElement = self.find(".close-button");
            cancelButtonElement.data("kendoMobileBackButton").unbind("click").bind("click", function () {
                self.beforeClose();
                GDF.kendoMobileApp.navigate("#:back");
            });
        }

        self.listView.setDataSource(self.ds);
    },

    viewBeforeHide: function (e) {
        var self = GDF.controllers.lookup;

        var searchField = this.find("[type=\"search\"]");
        searchField.val("");

        self.usefilter = false;

        self.listSelection = [];
    },

    save: function () {
        var self = GDF.controllers.lookup;

        self.getSelection();

        GDF.kendoMobileApp.navigate("#:back");
    },

    getSelection: function () {
        var self = GDF.controllers.lookup;

        self.result = self.listSelection;

        var callback = self.callback;

        if (callback) {
            callback(self.result);
        }
    },

    setSelection: function (keyvalue) {
        var self = GDF.controllers.lookup;

        var selection = self.listSelection;
        if (!$.isArray(selection) || selection.length > 0) {
            if (selection.filter(function (elem) { return elem[self.multiplekey] == keyvalue; }).length > 0) {
                return " checked=\"checked\"";
            };
        }

        return "";
    },

    OnCheckItem: function (elem) {
        var self = GDF.controllers.lookup;

        // Configura objeto a ser localizado para selecao / deselecao
        var field;
        var value;
        var obj = {};

        for (var i = 0; i < self.returnFields.length; i++) {
            field = self.returnFields[i];
            value = $(elem).data(field.toLowerCase());
            obj[field] = value;
        }

        // Inclui chave de busca no objeto
        obj[self.multiplekey] = $(elem).data(self.multiplekey);

        // Realiza acao
        if (elem.checked) {
            self.listSelection.push(obj);
        } else {
            self.listSelection = $.grep(self.listSelection, function (item, i) {
                return item[self.multiplekey] !== obj[self.multiplekey];
            });
        }
    },

    buildTemplate: function () {
        var self = GDF.controllers.lookup;

        var baseTemplate = self.baseTemplate;

        var template = self.multiple ? "<label><input type=\"checkbox\" {0} #: GDF.controllers.lookup.setSelection({1}) # onclick=GDF.controllers.lookup.OnCheckItem(this) /><div>" + baseTemplate + "</div></label>" : "<a {0}>" + baseTemplate + "</a>";

        var key = "";
        var fields = "";

        var returnFields = self.returnFields;
        for (var i = 0; i < returnFields.length; i++) {
            var returnField = returnFields[i];

            if (i === 0) {
                if (!self.multiple) {
                    fields += "data-id=\"#: " + returnField + " #\" ";
                }
            }

            fields += "data-" + returnField + "=\"#: " + returnField + " #\" ";
        }

        // Quando multi-selecao, inclui a chave utilizada para configurar selecao/deselecao
        if (self.multiple) {
            key = self.multiplekey;
            fields += "data-" + key + "=\"#: " + key + " #\" ";
        }

        return template.format(fields, key);
    },

    parseTemplate: function (dataItem) {
        var templateContent = GDF.controllers.lookup.listTemplate;

        if (dataItem && dataItem.IsNoDataMessage) {
            templateContent = "<div class=\"listview-no-data\">#: Message #</div>";
        }

        var template = kendo.template(templateContent);

        return template(dataItem);
    },

    viewHide: function (e) {
        var self = GDF.controllers.lookup;

        if (self.afterClose) {
            self.afterClose(self.result);
        }
    }
};

GDF.controllers.imageviewer = {
    _firstShow: true,
    _picture: null,
    _pictureSrc: "",
    _pictureDescription: "",

    viewInit: function(e) {
        this._picture = this.find("#imageviewer-picture");
    },

    viewShow: function(e) {
        if (this._firstShow) {
            GDF.lang.translate(this.view.element);
            this._firstShow = false;
        }

        var el = this._picture.get(0);
        if (el.src !== this._pictureSrc) {
            el.src = this._pictureSrc;
        }

        var self = this;
        setTimeout(function() {
            self.zoomToMin();
        }, 0);
    },

    tapPicture: function(e) {
    },

    open: function(pictureSrc, description) {
        this._pictureSrc = pictureSrc || "";
        this._pictureDescription = description || "";

        GDF.kendoMobileApp.navigate("#imageviewer", "fade");
    },

    zoomToMin: function() {
        var scroller = this.view.scroller;

        try {
            var e = scroller.dimensions;
            e.refresh();
            scroller._scale(e.minScale);
            scroller.movable.moveTo(e.centerCoordinates());
        } catch (ex) {
            try {
                scroller.zoomOut();
            } catch (ex2) {
            }
        }
    }
};

var isCordovaApp = (typeof window.cordova !== "undefined");

if (isCordovaApp) {
    // Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    onDeviceReady();
};
