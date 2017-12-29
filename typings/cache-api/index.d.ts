declare module 'cache-api' {
    export interface CacheApi {
        set(key: string, value: any, ttl?: number, callback?: (success: boolean) => void);
        get(key: string, callback?: (value: any) => void);
    }
}