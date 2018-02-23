## Json Configuration Loader - IoT Shaman

![npm badge](https://img.shields.io/npm/v/node-json-config-loader.svg) ![Build Status](https://travis-ci.org/iotshaman/node-json-config-loader.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/iotshaman/node-json-config-loader/badge.svg?branch=master)](https://coveralls.io/github/iotshaman/node-json-config-loader?branch=master)

Load multiple configurations files with one easy API. Have application secrets stored in environmental variables or any other key store? No problem, simply pass in a mapping and the key store and it will resolve this just like a regular json configuration file.

### Requirements

In order to use node-json-file-tree you will need the following resource(s):

- npm

### Installation

```js
npm install node-json-file-tree --save
```

### Quick Start

The entry point into the application is a factory method that will generate the config loader. Simply pass in a configuration object containing your files list / secret mappings + key stores  (with names for later retrieval) and the factory will return a promise. When the promise resolves, you can access the config objects by calling 'get' on the return value.

```js
var path = require('path');
var config = {
    files: [{
        name: "myDefaultConfig",
        path: path.join(__dirname, 'config.json')
    }],
    secret_maps: [{
        name: "mySecretConfig",
        path: path.join(__dirname, 'secrets.map.json'),
        store: process.env
    }]
}
var loader = require('node-json-config-loader');
loader(config).then(function(rslt) {
    // ...
});
```

### API Reference

The factory method (read above section 'Quick Start') will return a config object with the following interface:

```ts
interface ConfigApi {
    get(key: string): any;
}
```

### Secret Maps

Secret maps are simple json objects that have the required keys as properties in the object, and the values should be boolean. For example:

```js
{
    "some_key": true,
    "some_other_key": true
}
```