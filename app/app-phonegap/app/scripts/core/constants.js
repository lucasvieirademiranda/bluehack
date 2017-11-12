GDF.appTitle = "Cidadao Agente";
GDF.appVersion = "1.0.0";
GDF.hasMapDb = false;

GDF.mainView = "ocurrences";

GDF.rootViews.push("ocurrences");

GDF.menuItems.unshift({
    controller: "ocurrences",
    refreshOnShow: true,
    hideFromMaster: true
});

GDF.menuItems.unshift({
    controller: "map",
    refreshOnShow: true,
    hideFromMaster: true
});

GDF.defaultExternalTimeout = 30000;
