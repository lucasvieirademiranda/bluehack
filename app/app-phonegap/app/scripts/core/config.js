GDF.settings.add({
    // Controle de sincronia, quando a sincronia � finalizada com sucesso o status � alterado para true
    hasData: false,

    // TODO - ALTERAR PARA FALSE AO CRIAR RELEASE
    devmode: false,

    deviceId: "",

    // Service URI
    apiServerUrlDev: "http://localhost:80/",
    apiServerUrlProd: "http://agentecidadao.mybluemix.net/",

    // Informacoes do login
    userdata: null,

    // N�mero m�ximo de fotos
    maxPicturePerOcurrence: 5,

    // Milisegundos
    defaultMessageTime: 2000,

    // Informa��es da ocorr�ncia
    occurrenceLocal: null,

    // Refer�ncia do mapa
    map: null,
});