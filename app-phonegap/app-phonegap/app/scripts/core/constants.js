GDF.appTitle = "Cidadao Agente";
GDF.appVersion = "1.1.0";
GDF.hasMapDb = false;

GDF.mainView = "ocurrences";

GDF.rootViews.push("ocurrences");

GDF.menuItems.unshift({
    controller: "sync",
    refreshOnShow: true,
    hideFromMaster: true,
    showWhenBlock: true
});

GDF.menuItems.unshift({
    controller: "ocurrences",
    refreshOnShow: true,
    hideFromMaster: true
});

GDF.defaultExternalTimeout = 30000;
