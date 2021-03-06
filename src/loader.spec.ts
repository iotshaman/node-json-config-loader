import { expect, should } from 'chai';
import 'mocha';
import { ConfigLoader } from './loader';
import { LoaderConfiguration } from 'loader-api';
import { FileSystemApi } from 'file-system-api';
import * as Promise from 'promise';
import * as node_cache from 'node-cache';
const empty_fs = {
    readJson: (path: string) => { return Promise.resolve({}); }
};

describe('Configuration Loader - Initialization', () => {
    it('Test Missing File System', (done) => {
        let config: LoaderConfiguration = {
            files: []            
        }
        let context: ConfigLoader = new ConfigLoader(config, null);
        context.Initialize().catch((ex) => {
            done();
        });        
    });

    it('Test Initialization', (done) => {
        let config: LoaderConfiguration = {
            files: []            
        }
        let context: ConfigLoader = new ConfigLoader(config, empty_fs);
        context.Initialize().then(() => {
            done();
        });
    });
});

describe('Configuration Loader - No Data Available', () => {
    it('Test Null File List', (done) => {
        let config: LoaderConfiguration = {
            files: null         
        }
        let context: ConfigLoader = new ConfigLoader(config, empty_fs);
        context.Initialize().then(() => {
            expect(context.get('')).to.equal(undefined);
            done();
        }).catch((Ex) => { console.dir(Ex); })
    });

    it('Test Empty Files List', (done) => {
        let config: LoaderConfiguration = {
            files: []            
        }
        let context: ConfigLoader = new ConfigLoader(config, empty_fs);
        context.Initialize().then(() => {
            let rslt = context.get('');
            console.dir(rslt);
            should().equal(rslt, undefined);
            done();
        });
    });
});

describe('Configuration Loader - File Retrieval', () => {
    it('Test Valid Get', (done) => {
        let config: LoaderConfiguration = {
            files: [
                { name: 'test1', path: './test1' }
            ]            
        }
        let fs: FileSystemApi = {
            readJson: (path: string) => {
                if (path != './test1') Promise.resolve({});
                return new Promise((res) => {
                    res({ val: 'value1' })
                });
            }
        }
        let context: ConfigLoader = new ConfigLoader(config, fs);
        context.Initialize().then(() => {
            var rslt = context.get('test1');
            should().not.equal(rslt, null);
            should().equal(rslt.val, 'value1');
            done();
        });
    });
    it('Test Valid Get - File Not Found', (done) => {
        let config: LoaderConfiguration = {
            files: [
                { name: 'test1', path: './test1' }
            ]            
        }
        let fs: FileSystemApi = {
            readJson: (path: string) => {
                if (path != './test1') Promise.resolve({});
                return new Promise((res, err) => {
                    err({});
                });
            }
        }
        let context: ConfigLoader = new ConfigLoader(config, fs);
        context.Initialize().then(() => {
            var rslt = context.get('test1');
            should().not.equal(rslt, null);
            should().not.equal(rslt.val, 'value1');
            done();
        });
    });
});

describe('Configuration Loader - Secret Retrieval', () => {
    it('Test Valid Get', (done) => {
        var store = {
            'key1': 'value1',
            'key2': 'value2'
        }
        let config: LoaderConfiguration = {
            files: [],
            secret_maps: [
                { name: 'test1', path: './test1', store: store }
            ]            
        }
        let fs: FileSystemApi = {
            readJson: (path: string) => {
                if (path != './test1') Promise.resolve({});
                return new Promise((res) => {
                    res({ 
                        'key1': true,
                        'key2': true
                     })
                });
            }
        }
        let context: ConfigLoader = new ConfigLoader(config, fs);
        context.Initialize().then(() => {
            var val = context.get('test1');
            should().not.equal(val, null);
            expect(val['key1']).to.equal('value1');
            expect(val['key2']).to.equal('value2');
            done();
        });
    });
});

describe('Configuration Loader - Cache', () => {

    it('Set Cache Value and Retrieve', (done) => {
        let config: LoaderConfiguration = {
            files: [],
            cache: new node_cache()           
        }
        let context: ConfigLoader = new ConfigLoader(config, empty_fs);
        context.Initialize().then(() => {
            context.setCahceValue('test1', { val: 'value1' })
            var rslt = context.get('test1');
            should().not.equal(rslt, null);
            expect(rslt.val).to.equal('value1');
            done();
        });
    });

    it('Set Cache Internally', (done) => {
        let cache = new node_cache();
        let config: LoaderConfiguration = {
            files: [
                { name: 'test1', path: './test1' }
            ],
            cache: cache         
        }
        let fs: FileSystemApi = {
            readJson: (path: string) => {
                if (path != './test1') Promise.resolve({});
                return new Promise((res) => {
                    res({ val: 'value1' })
                });
            }
        }
        let context: ConfigLoader = new ConfigLoader(config, fs);
        context.Initialize().then(() => {
            var tmp = context.get('test1');
            var rslt = cache.get('test1');
            should().not.equal(rslt, null);
            expect(rslt.val).to.equal('value1')
            done();
        });
    });
});