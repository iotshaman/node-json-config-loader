declare module 'file-system-api' {
    export interface FileSystemApi {
        readJson(path: string): Promise<any>;
    }
}