var fs = require('fs');
var path = require('path');

exports.start = function (api) {
    startValidators(api);
    startControllers(api);
};

function startValidators (api) {

    var validatorsPath = path.resolve(__dirname + '/validators');
    var validators = fs.readdirSync(validatorsPath);

    for (var i = 0; i < validators.length; i++) {

        var validatorBasename = path.basename(validators[i], '.js')
            .replace('Validator', '');

        var validatorFullName = path.join(validatorsPath, validators[i])
            .replace(/\\/g, '/');

        var currentValidator = require(validatorFullName);

        var currentRoute = '/'.concat(validatorBasename);

        api.use(currentRoute, currentValidator);
    }

}

function startControllers (api) {

    var controllersPath = path.resolve(__dirname + '/controllers');
    var controllers = fs.readdirSync(controllersPath);

    for (var i = 0; i < controllers.length; i++) {
        var routeBasename = path.basename(controllers[i], '.js')
            .replace('Controller', '');

        var routeFullName = path.join(controllersPath, controllers[i])
            .replace(/\\/g, '/');

        var currentControllerModule = require(routeFullName);

        var currentController = '/'.concat(routeBasename);

        api.use(currentController, currentControllerModule);
    }

};