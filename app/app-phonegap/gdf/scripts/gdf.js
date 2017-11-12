window.addEventListener("load", function() {
    var GDFloader = {
        _configured: false,
        _externalLoaded: false,
        _scriptsParent: null,
        _scripts: null,
        _scriptsLoadCount: 0,
        _scriptsInfos: null,
        _styles: null,
        _tabletStyles: null,
        _phoneStyles: null,

        _configure: function () {
            if (this._configured) {
                return;
            }

            this._configured = true;
            this._scriptsParent = document.body;
        },

        autoLoad: function() {
            var self = GDFloader;

            self._configure();
            self.appendScript("gdf/scripts/gdf/gdf.external.js", function() {
                self._externalLoaded = true;

                var appScripts = [],
                    pluginScripts = [],
                    styles = [],
                    tabletStyles = [],
                    phoneStyles = [];
                jQuery.ajax({
                    url: "app/config.json",
                    type: "GET",
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        if (typeof data !== "object") {
                            return;
                        }

                        if ($.isArray(data.scripts)) {
                            appScripts = data.scripts;
                        }

                        if ($.isArray(data.plugins)) {
                            pluginScripts = data.plugins;
                        }

                        if ($.isArray(data.styles)) {
                            styles = data.styles;
                        }

                        if ($.isArray(data.tabletStyles)) {
                            tabletStyles = data.tabletStyles;
                        }

                        if ($.isArray(data.phoneStyles)) {
                            phoneStyles = data.phoneStyles;
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert("Error loading \"app/config.json\" (" + textStatus + ")\n" + errorThrown);
                    }
                });

                appScripts = appScripts.map(function(file) {
                    return "app/scripts/" + file;
                });

                styles = styles.map(function(file) {
                    return "app/" + file;
                });

                tabletStyles = tabletStyles.map(function(file) {
                    return "app/" + file;
                });

                phoneStyles = phoneStyles.map(function (file) {
                    return "app/" + file;
                });

                appScripts = pluginScripts.concat(appScripts);
                self.load(appScripts, styles, tabletStyles, phoneStyles);
            });
        },

        load: function (appScripts, styles, tabletStyles, phoneStyles) {
            this._configure();
            this._styles = styles;
            this._tabletStyles = tabletStyles;
            this._phoneStyles = phoneStyles;

            this._scripts = [];
            this._scriptsInfos = {};

            // GDF Scripts
            if (!this._externalLoaded) {
                this._scripts.push("gdf/scripts/gdf/gdf.external.js");
            }

            this._scripts.push("gdf/scripts/gdf/gdf.lib.js");
            // App Scripts
            if (typeof appScripts === "string") {
                appScripts = [appScripts];
            }

            for (var s in appScripts) {
                this._scripts.push(appScripts[s]);
            }

            if (this._scripts.length > 0) {
                this.appendScript(this._scripts[0], this.loadedAppendedScript);
            }
        },

        appendScript: function(scriptPath, callback) {
            var newElement = document.createElement("script");

            newElement.src = scriptPath;
            newElement.async = false;
            newElement.defer = false;
            newElement.addEventListener("load", callback, false);
            newElement.addEventListener("error", callback, false);

            this._scriptsParent.appendChild(newElement);
        },

        loadedAppendedScript: function(e) {
            if (arguments && arguments.callee) {
                this.removeEventListener(e.type || "load", arguments.callee, false);
            }

            var self = GDFloader;

            var scriptInfo = self._scriptsInfos[this.src];

            if (!scriptInfo) {
                scriptInfo = { status: "error", tries: 0 };
                self._scriptsInfos[this.src] = scriptInfo;
            }

            scriptInfo.tries++;
            if (scriptInfo.status === "load") {
                return;
            }

            scriptInfo.status = typeof e.type === "string" ? e.type : "load";
            if (scriptInfo.tries > 1) {
                return;
            }

            self._scriptsLoadCount++;
            if (self._scriptsLoadCount < self._scripts.length) {
                self.appendScript(self._scripts[self._scriptsLoadCount], self.loadedAppendedScript);
            } else {
                GDF.start(self._styles, self._tabletStyles, self._phoneStyles);
            }
        }
    };

    GDFloader.autoLoad();
});