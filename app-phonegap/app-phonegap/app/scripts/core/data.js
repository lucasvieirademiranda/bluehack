//Types
// int, number, decimal, string, date, datetime, bool

// Tabelas de cadastro
$data.Entity.extend("User", {
    Id: { type: "int", key: true },
    Username: { type: "string" },
    Email: { type: "string" },
    InstitutionId: { type: "int" }
});

$data.Entity.extend("Institution", {
    Id: { type: "int", key: true },
    Name: { type: "string" },
    Phone: { type: "string" },
    Email: { type: "string" }
});

$data.Entity.extend("OccurenceType", {
    Id: { type: "int", key: true },
    Name: { type: "string" }
});

$data.Entity.extend("OccurrenceSubtype", {
    Id: { type: "int", key: true },
    OccurenceTypeId: { type: "int" },
    Name: { type: "string" }
});

$data.Entity.extend("SubtypeInstitution", {
    Id: { type: "int", key: true },
    SubtypeId: { type: "int" },
    InstitutionId: { type: "int" }
});

// Tabelas de movimento
$data.Entity.extend("Occurrence", {
    Uuid: { type: "string", key: true },
    OccurenceTypeId: { type: "int" },
    OccurenceSubtypeId: { type: "int" },
    OwnerUserId: { type: "int" },
    ResponsableUserId: { type: "int" },
    InstitutionId: { type: "int" },
    Title: { type: "string" },
    Description: { type: "string" },
    CreateDate: { type: "datetime" },
    Latitude: { type: "decimal" },
    Longitude: { type: "decimal" },
    Cep: { type: "string" },
    City: { type: "string" },
    State: { type: "string" },
    Address1: { type: "string" },
    Address2: { type: "string" },
    Criticality: { type: "int" },
    Status: { type: "int" },
    InternalStatus: { type: "int" }
});

$data.Entity.extend("OccurrenceImage", {
    Id: { type: "int", key: true, computed: true },
    UuidOccurrence: { type: "int" },
    Src: { type: "string"},
    Thumbnail: { type: "string" }
});

function Appdata(dbname, mapdbname) {
    this._dbname = dbname;
    this._dbdefinition = {
        User: { type: $data.EntitySet, elementType: User },
        Institution: { type: $data.EntitySet, elementType: Institution },
        OccurenceType: { type: $data.EntitySet, elementType: OccurenceType },
        OccurrenceSubtype: { type: $data.EntitySet, elementType: OccurrenceSubtype },
        SubtypeInstitution: { type: $data.EntitySet, elementType: SubtypeInstitution },
        Occurrence: { type: $data.EntitySet, elementType: Occurrence },
        OccurrenceImage: { type: $data.EntitySet, elementType: OccurrenceImage }       
    };
};

Appdata.prototype.loadDb = function () {
    var self = this;
    GDF.dbCreate(self._dbname, self._dbdefinition, false);
};

(function () {
    if (!GDF) {
        return;
    }
    new Appdata("CIDADAO-AGENTE-DB").loadDb();
})();
