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

export function getApiUrl(raw_query: string): string {
    return wrapInJsonProxy(`https://www.xeno-canto.org/api/2/recordings?query=${raw_query}`)
}