GDFtemp = {
    shouldRefresh: true,

    viewInit: function (e) {
        var self = GDF.controllers.login;
        this.find(".version:first").html(GDF.strings.version.format(GDF.appVersion));
    },

    viewShow: function (e) {
        var self = GDF.controllers.login;

        GDF.enableDrawer = true;

        if (!self.shouldRefresh) {
            return;
        }

        self.shouldRefresh = false;

        // Ação quando já foi realizada login ao menos uma vez
        if (GDF.settings.userdata !== null) {
            self.login(GDF.settings.userdata.Username, GDF.settings.userdata.Password);
        }
    },

    onClickLogin: function(e) {
        var self = GDF.controllers.login;

        // Recupera dados informados para realização do login
        var loginBox = this.find("#login-box");
        var loginUsername = loginBox.find("#loginUser").val().trim();
        var loginPassword = loginBox.find("#loginPassword").val().trim();

        // Verifica se usuário e senha foram informados
        if (loginUsername.length <= 0 || loginPassword.length <= 0) {
            GDF.util.toast(GDF.strings.loginErrorUserPassword);
            return;
        }

        self.login(loginUsername, loginPassword);
    },

    login: function(username, password) {
        var self = GDF.controllers.login;

        var finish = function () {
            GDF.kendoMobileApp.navigate("views/map.html");
        };

        var fail = function (error) {
            GDF.unblockApp();

            if ($.isArray(error)) {
                GDF.util.toast(error[0]);
            } else {
                GDF.util.toast(error);
            }
        };

        var success = function (data) {
            GDF.settings.userdata = data;
            $("#username-value").text(GDF.settings.userdata.Username)
            GDF.util.downloadData(
                function () {
                    GDF.util.uploadOccurence(true, finish);
                }, fail);
        };

        //GDF.blockApp(GDF.strings.doingLogin);
        //GDF.util.Authenticate(username, password, success, fail);

        success({ Username: username, Password: password, Id: 1 });
    },

    onClickRegister: function (e) {

    },
};
