export interface DiashowApiVersions {
    readonly chrome: () => string;
    readonly electron: () => string;
    readonly node: () => string;
}

export interface DiashowImageInfo {
    readonly folder: string;
    readonly filename: string;
    readonly lastModified: number;
}

export interface DiashowApi {
    readonly versions: DiashowApiVersions;
    readonly openFolder: () => Promise<string | undefined>;
    readonly readImageInfos: (folder: string) => Promise<readonly DiashowImageInfo[]>;
    readonly readImage: (folder: string, filename: string) => Promise<Uint8Array>;
}

export const diashowApi: DiashowApi = (window as any)['diashow-api'];