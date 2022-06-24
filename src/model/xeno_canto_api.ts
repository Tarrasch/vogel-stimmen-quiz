export interface Recording {
    soundFileUrl: string;
    recorderName: string;
    englishName: string;
    genericName: string;
    scientificName: string;
    id: string;
    url: string;
    also: string[];
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

function cleanArrayFromEmptySingleton(x: string[]):string[] {
    if(x.length === 1 && x[0] === "") {
        return [];
    }
    return x;
}

function makeRecording(input: any): Recording {
    return {
        soundFileUrl: input.file,
        recorderName: input.rec,
        englishName: input.en,
        genericName: input.gen,
        scientificName: input.sp,
        id: input.id,
        url: input.url,
        also: cleanArrayFromEmptySingleton(input.also),
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

export function getApiUrl(parameters: XenoCantoParameters): string {
    // The commented line is used when debugging.
    // return `http://127.0.0.1:5000/simple-xeno-canto?query=${parameters.query}&page=${parameters.pageNumber}`
    return `https://famous-hull-347520.ue.r.appspot.com/simple-xeno-canto?query=${parameters.query}&page=${parameters.pageNumber}`
}