GDF.settings.add({
    // Controle de sincronia, quando a sincronia é finalizada com sucesso o status é alterado para true
    hasData: false,

    // TODO - ALTERAR PARA FALSE AO CRIAR RELEASE
    devmode: true,

    deviceId: "",

    // Service URI
    apiServerUrlDev: "http://localhost:54904/",
    apiServerUrlProd: "http://tst-mapfy-api.gatec.com.br/",

    // Informacoes do login
    userdata: null,

    maxPicturePerOcurrence: 5,

    defaultMessageTime: 2000 //ms
});