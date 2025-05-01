interface Config {
    api: {
        baseUrl: string;
        timeout: number;
    };
    storage: {
        prefix: string;
    };
    app: {
        name: string;
        version: string;
        description: string;
    };
    services: {
        googleMaps: {
            apiKey: string;
        };
        firebase: {
            config: any;
        };
    };
}
declare const config: Config;
export default config;
