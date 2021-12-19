export interface Recording {
    soundFileUrl: string;
    recorderName: string;
    englishName: string;
    genericName: string;
    scientificName: string;
}

export interface XenoCantoApiResponse {
    numRecordings: number;
    page: number;
    numPages: number;
    recordings: Recording[];
}

export interface XenoCantoParameters {
    query: string,
    pageNumber: number,  // Note: xeno-canto API uses a 1 indexed number here.
}

function makeRecording(input: any): Recording {
    return {
        soundFileUrl: input.file,
        recorderName: input.rec,
        englishName: input.en,
        genericName: input.gen,
        scientificName: input.sp,
    };
}

export function makeXenoCantoApiResponse(input: any): XenoCantoApiResponse {
    return {
        numRecordings: parseInt(input.numRecordings),
        page: input.page,
        numPages: input.numPages,
        recordings: input.recordings.map(makeRecording),
    }
}

function wrapInJsonProxy(url: string): string {
    return `https://jsonp.afeld.me/?url=${url}`
}

export function getApiUrl(parameters: XenoCantoParameters): string {
    return wrapInJsonProxy(`https://www.xeno-canto.org/api/2/recordings?query=${parameters.query}&page=${parameters.pageNumber}`)
}