GDF.settings.add({
    // Controle de sincronia, quando a sincronia é finalizada com sucesso o status é alterado para true
    hasData: false,

    // TODO - ALTERAR PARA FALSE AO CRIAR RELEASE
    devmode: false,

    deviceId: "",

    // Service URI
    apiServerUrlDev: "http://localhost:80/",
    apiServerUrlProd: "http://agentecidadao.mybluemix.net/",

    // Informacoes do login
    userdata: null,

    // Número máximo de fotos
    maxPicturePerOcurrence: 5,

    // Milisegundos
    defaultMessageTime: 2000,

    // Informações da ocorrência
    occurrenceLocal: null,

    // Referência do mapa
    map: null,
});