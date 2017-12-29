"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("promise");
var ConfigLoader = /** @class */ (function () {
    function ConfigLoader(config, fs) {
        var _this = this;
        this.config = config;
        this.fs = fs;
        this.Initialize = function () {
            return _this.loadConfigFiles(_this.config.files)
                .then(function () { return _this.loadAppSecrets(_this.config.secret_maps); });
        };
        this.loadConfigFiles = function (list) {
            if (list === void 0) { list = []; }
            var loaders = [];
            if (list.length == 0) {
                return Promise.resolve([]);
            }
            for (var i = 0; i < list.length; i++) {
                loaders.push(new Promise(function (res) {
                    var file = list[i];
                    _this.fs.readJson(file.path).then(function (rslt) {
                        _this.files[file.name] = rslt;
                        res();
                    });
                }));
            }
            return Promise.all(loaders);
        };
        this.loadAppSecrets = function (list) {
            if (list === void 0) { list = []; }
            var loaders = [];
            if (list.length == 0) {
                return Promise.resolve([]);
            }
            for (var i = 0; i < list.length; i++) {
                loaders.push(new Promise(function (res) {
                    var map = list[i];
                    _this.fs.readJson(map.path).then(function (rslt) {
                        var keys = Object.keys(rslt);
                        var obj = {};
                        for (var j = 0; j < keys.length; j++) {
                            obj[keys[j]] = map.store[keys[j]];
                        }
                        _this.files[map.name] = obj;
                        res();
                    });
                }));
            }
            return Promise.all(loaders);
        };
        this.get = function (key) {
            if (_this.config.cache != null) {
                var val = _this.config.cache.get(key);
                if (val != null)
                    return val;
                _this.config.cache.set(key, _this.files[key]);
            }
            return _this.files[key];
        };
        this.files = [];
    }
    return ConfigLoader;
}());
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=loader.js.map