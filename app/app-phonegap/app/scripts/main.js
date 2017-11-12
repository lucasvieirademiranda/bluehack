GDF.onAppInit(function () {
    // Carrega tabelas fixas
    var voidf = function () { };
    GDF.sql.multipleInsert("Criticaly", ["Id", "Level"], [[1, "Emergencia"], [2, "Alta"], [3, "Media"], [4, "Baixa"]], true, voidf, voidf);
});