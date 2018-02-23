var ConfigLoader = require('../dist/loader').ConfigLoader;
var fsx = require('fs-extra');
module.exports = function(config) {
    let loader = new ConfigLoader(config, fsx);
    return loader.Initialize().then(function() {
        return loader;
    });
}