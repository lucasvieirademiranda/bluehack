GDF.settings.add({
    // Controle de sincronia, quando a sincronia � finalizada com sucesso o status � alterado para true
    hasData: false,

    // TODO - ALTERAR PARA FALSE AO CRIAR RELEASE
    devmode: true,

    deviceId: "",

    // Service URI
    apiServerUrlDev: "http://localhost:54904/",
    apiServerUrlProd: "http://tst-mapfy-api.gatec.com.br/",

    // Informacoes do login
    userdata: null,

    // N�mero m�ximo de fotos
    maxPicturePerOcurrence: 5,

    // Milisegundos
    defaultMessageTime: 2000,

    // Informa��es da ocorr�ncia
    occurrence: {}
});