import { LoaderConfiguration, ConfigData, ConfigFile, SecretMap } from 'loader-api';
import { FileSystemApi } from 'file-system-api';
import * as Promise from 'promise';

export class ConfigLoader {
	
	private files: Array<ConfigData>;

	constructor(private config: LoaderConfiguration, private fs: FileSystemApi) {
		this.files = [];		
	}

	public Initialize = () => {
		if (!this.fs) { return Promise.reject('No file-system was provided.'); }
		return this.loadConfigFiles(this.config.files)
			.then(() => { return this.loadAppSecrets(this.config.secret_maps) });
	}
	
	private loadConfigFiles = (list: Array<ConfigFile>) => {
		let loaders: Array<any> = [];
		if (list == null || list.length == 0) { return Promise.resolve([]); }
		for (var i = 0; i < list.length; i++) {
			loaders.push(new Promise((res) => {
				let file: ConfigFile = list[i];
				this.fs.readJson(file.path).then((rslt: any) => {
					this.files[file.name] = rslt;
					res();
				});
			}));
		}
		return Promise.all(loaders);
	}		

	private loadAppSecrets = (list: Array<SecretMap>) => {
		let loaders: Array<any> = [];
		if (list == null || list.length == 0) { return Promise.resolve([]); }
		for (var i = 0; i < list.length; i++) {
			loaders.push(new Promise((res) => {
				let map: SecretMap = list[i];
				this.fs.readJson(map.path).then((rslt: any) => {
					var keys = Object.keys(rslt);
					var obj = {};
					for (var j = 0; j < keys.length; j++) {
						obj[keys[j]] = map.store[keys[j]];
					}
					this.files[map.name] = obj;
					res();
				});
			}));
		}
		return Promise.all(loaders);
	}

	public setCahceValue = (key: string, val: any) => {
		this.config.cache.set(key, val);
	}

	public get = (key: string) => {
		if (this.config.cache != null) {
			let val = this.getFromCache(key);
			if (!!val) return val;
		}

		var rslt = this.files[key];
		if (this.config.cache != null) { 
			this.setCahceValue(key, rslt);
		}
		return rslt;
	}

	private getFromCache = (key: string) => {
		return this.config.cache.get(key);
	}
}