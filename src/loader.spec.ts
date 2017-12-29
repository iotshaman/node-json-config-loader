import { ConfigLoader } from './loader';
import { LoaderConfiguration } from 'loader-api';
import { FileSystemApi } from 'file-system-api';
import * as Promise from 'promise';

describe('Configuration Loader - Initialization', () => {
    it('Test Initialization', (done) => {
        let config: LoaderConfiguration = {
            files: []            
        }
        let context: ConfigLoader = new ConfigLoader(config, null);
        context.Initialize().then(() => {
            done();
        });
    });
});

describe('Configuration Loader - File Retrieval', () => {
    it('Test Null Get', (done) => {
        let config: LoaderConfiguration = {
            files: []            
        }
        let context: ConfigLoader = new ConfigLoader(config, null);
        context.Initialize().then(() => {
            expect(context.get('')).toBe(undefined);
            done();
        });
    });

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
                    res({ path: path })
                });
            }
        }
        let context: ConfigLoader = new ConfigLoader(config, fs);
        context.Initialize().then(() => {
            var val = context.get('test1');
            expect(val).not.toBe(null);
            expect(val.path).toBe('./test1');
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
            expect(val).not.toBe(null);
            expect(val['key1']).toBe('value1');
            expect(val['key2']).toBe('value2');
            done();
        });
    });
});

describe('Configuration Loader - Cache', () => {
    it('Test Valid Get - With Cache', (done) => {
        let config: LoaderConfiguration = {
            files: [],
            cache: {
                get: (key: string, callback?: (value: any) => void) => {
                    return { key: key };
                },
                set: (key: string, value: any, ttl: number, callback: (success: boolean) => void) => { }
            }            
        }
        let context: ConfigLoader = new ConfigLoader(config, null);
        context.Initialize().then(() => {
            var val = context.get('test1');
            expect(val).not.toBe(null);
            expect(val.key).toBe('test1');
            done();
        });
    });
});