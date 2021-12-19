import { Bird } from "./species";
import { getApiUrl, makeXenoCantoApiResponse, Recording, XenoCantoApiResponse, XenoCantoParameters } from "./xeno_canto_api";

interface QueryOptions {
    birdQueryName: string,
}

function buildQuery(queryOptions: QueryOptions): string {
    return `${queryOptions.birdQueryName} area:europe q:A type:song`
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export interface QuizRound {
    correctBird: Bird,
    recording: Recording,
}

// stores or fetches and stores Api responses and makes is queryable.
class Storage {
    readonly birdsInQuiz: Bird[];

    constructor(birdsInQuiz: Bird[]) {
        this.birdsInQuiz = birdsInQuiz;
    }

    async getNumRecordingsInXenoCanto(birdIndex: number): Promise<number> {
        const response: XenoCantoApiResponse = await this.fetchApiResponse({
            query: buildQuery({ birdQueryName: this.birdsInQuiz[birdIndex].queryName }),
            pageNumber: 1,
        });
        return response.numRecordings;
    }

    async getBirdRecording(birdIndex: number, recordingIndex: number): Promise<Recording> {
        const response: XenoCantoApiResponse = await this.fetchApiResponse({
            query: buildQuery({ birdQueryName: this.birdsInQuiz[birdIndex].queryName }),
            pageNumber: recordingIndex / 100 + 1,
        });
        console.log(response);

        return response.recordings[recordingIndex % 100]
    }

    private fetchApiResponse(parameters: XenoCantoParameters): Promise<XenoCantoApiResponse> {
        return fetch(getApiUrl(parameters))
            .then(response => response.json())
            .then(data => makeXenoCantoApiResponse(data));
    }
}

export class QuizDriver {
    readonly birdsInQuiz: Bird[];
    readonly storage: Storage;

    constructor(birdsInQuiz: Bird[]) {
        this.birdsInQuiz = birdsInQuiz;
        this.storage = new Storage(birdsInQuiz);
    }

    async getNewRound(): Promise<QuizRound> {
        const birdIndex = getRandomInt(this.birdsInQuiz.length);
        const recordingIndex = getRandomInt(await this.storage.getNumRecordingsInXenoCanto(birdIndex));
        const recording = await this.storage.getBirdRecording(birdIndex, recordingIndex);
        return {
            correctBird: this.birdsInQuiz[birdIndex],
            recording: recording,
        };
    }
}