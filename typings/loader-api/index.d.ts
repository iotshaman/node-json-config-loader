/// <reference path="../cache-api/index.d.ts" />

declare module 'loader-api' {
    import { CacheApi } from 'cache-api';

    export interface LoaderConfiguration {
        files: Array<ConfigFile>;
        secret_maps?: Array<SecretMap>;
        cache?: CacheApi;
    }

    export interface ConfigFile {
        path: string;
        name: string;
    }

    export interface ConfigData {
        [key: string]: string;
    }

    export interface SecretMap extends ConfigFile {
        store: any;
    }
}