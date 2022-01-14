import { Bird } from "./species";
import { getApiUrl, makeXenoCantoApiResponse, Recording, XenoCantoApiResponse, XenoCantoParameters } from "./xeno_canto_api";

interface QueryOptions {
    birdQueryName: string,
}

function buildQuery(queryOptions: QueryOptions): string {
    return `${queryOptions.birdQueryName} area:europe q:A type:song`
}

function getRandomInts(max: number, outputLength: number): number[] {
    if (outputLength >= max) {
        return [-999999];
    }
    const output: number[] = Array(max).fill(undefined).map((_, ix) => ix);
    for (let i: number = 0; i < outputLength - 1; i++) {
        const j: number = i + getRandomInt(max - i);
        const val_at_i = output[i];
        const val_at_j = output[j];
        output[i] = val_at_j;
        output[j] = val_at_i;
    }

    return output.slice(0, outputLength);
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export interface QuizRound {
    correctBird: Bird,
    birdOptions: Bird[],
    recording: Recording,
}

class Storage {
    readonly birdsInQuiz: Bird[];
    readonly numRecordingsMap: Map<number, number>;
    readonly recordingsMap: Map<[number, number], Recording>;

    constructor(birdsInQuiz: Bird[]) {
        this.birdsInQuiz = birdsInQuiz;
        this.numRecordingsMap = new Map();
        this.recordingsMap = new Map();
    }

    maybeGetNumRecordings(birdIndex: number): number | undefined {
        return this.numRecordingsMap.get(birdIndex);
    }

    maybeGetBirdRecording(birdIndex: number, recordingIndex: number): Recording | undefined {
        return this.recordingsMap.get([birdIndex, recordingIndex]);
    }

    saveResult(birdIndex: number, result: XenoCantoApiResponse): void {
        this.numRecordingsMap.set(birdIndex, result.numRecordings);
        for (let index = 0; index < result.recordings.length; index++) {
            const recording: Recording = result.recordings[index];
            const recordingIndex: number = index + (result.page - 1) * 100;
            this.recordingsMap.set([birdIndex, recordingIndex], recording);
        }
    };
}

// Stores or fetches and stores Api responses and makes is queryable.
class Fetcher {
    readonly birdsInQuiz: Bird[];
    readonly storage: Storage;

    constructor(birdsInQuiz: Bird[]) {
        this.birdsInQuiz = birdsInQuiz;
        this.storage = new Storage(birdsInQuiz);
    }

    async getNumRecordingsInXenoCanto(birdIndex: number): Promise<number> {
        const maybeSavedValue = this.storage.maybeGetNumRecordings(birdIndex);
        if (!maybeSavedValue) {
            const response = await this.fetchApiResponse({
                query: buildQuery({ birdQueryName: this.birdsInQuiz[birdIndex].scientificName }),
                pageNumber: 1,
            });
            this.storage.saveResult(birdIndex, response);
            return response.numRecordings;
        }
        return maybeSavedValue;
    }

    async getBirdRecording(birdIndex: number, recordingIndex: number): Promise<Recording> {
        const maybeSavedValue = this.storage.maybeGetBirdRecording(birdIndex, recordingIndex);
        if (!maybeSavedValue) {
            const response = await this.fetchApiResponse({
                query: buildQuery({ birdQueryName: this.birdsInQuiz[birdIndex].scientificName }),
                pageNumber: recordingIndex / 100 + 1,
            });
            this.storage.saveResult(birdIndex, response);
            return response.recordings[recordingIndex % 100]
        };
        return maybeSavedValue;
    }

    private fetchApiResponse(parameters: XenoCantoParameters): Promise<XenoCantoApiResponse> {
        return fetch(getApiUrl(parameters))
            .then(response => response.json())
            .then(data => makeXenoCantoApiResponse(data));
    }
}

export class QuizDriver {
    readonly birdsInQuiz: Bird[];
    readonly fetcher: Fetcher;
    readonly numOptions: number;

    constructor(birdsInQuiz: Bird[], numOptions: number) {
        this.birdsInQuiz = birdsInQuiz;
        this.fetcher = new Fetcher(birdsInQuiz);
        this.numOptions = numOptions;
    }

    async getNewRound(): Promise<QuizRound> {
        const randomIndexes: number[] = getRandomInts(this.birdsInQuiz.length, this.numOptions);
        const options: Bird[] = randomIndexes.map((index) => this.birdsInQuiz[index]);
        const birdIndex = randomIndexes[getRandomInt(this.numOptions)];
        const recordingIndex = getRandomInt(await this.fetcher.getNumRecordingsInXenoCanto(birdIndex));
        const recording = await this.fetcher.getBirdRecording(birdIndex, recordingIndex);
        return {
            correctBird: this.birdsInQuiz[birdIndex],
            recording: recording,
            birdOptions: options,
        };
    }
}