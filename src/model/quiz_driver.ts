import { RandomDataForQuiz, getRandomDataForQuiz } from "./random";
import { Bird } from "./species";
import { getApiUrl, makeXenoCantoApiResponse, Recording, XenoCantoApiResponse, XenoCantoParameters } from "./xeno_canto_api";

const MAX_RESULTS_PER_QUERY = 500;

interface QueryOptions {
    birdQueryName: string,
}

function buildQuery(queryOptions: QueryOptions): string {
    return `${queryOptions.birdQueryName} area:europe q:A type:song`
}

export interface QuizRound {
    correctBird: Bird,
    birdOptions: Bird[],
    recording: Recording,
}

class Storage {
    readonly birdsInQuiz: Bird[];
    readonly numRecordingsMap: Map<number, number>;
    readonly recordingsMap: Map<string, Recording>;

    constructor(birdsInQuiz: Bird[]) {
        this.birdsInQuiz = birdsInQuiz;
        this.numRecordingsMap = new Map();
        this.recordingsMap = new Map();
    }

    maybeGetNumRecordings(birdIndex: number): number | undefined {
        return this.numRecordingsMap.get(birdIndex);
    }

    maybeGetBirdRecording(birdIndex: number, recordingIndex: number): Recording | undefined {
        return this.recordingsMap.get(`${birdIndex}-${recordingIndex}`);
    }

    saveResult(birdIndex: number, result: XenoCantoApiResponse): void {
        this.numRecordingsMap.set(birdIndex, result.numRecordings);
        for (let index = 0; index < result.recordings.length; index++) {
            const recording: Recording = result.recordings[index];
            const recordingIndex: number = index + (result.page - 1) * MAX_RESULTS_PER_QUERY;
            this.recordingsMap.set(`${birdIndex}-${recordingIndex}`, recording);
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
                pageNumber: Math.trunc(recordingIndex / MAX_RESULTS_PER_QUERY + 1),
            });
            this.storage.saveResult(birdIndex, response);
            return response.recordings[recordingIndex % MAX_RESULTS_PER_QUERY]
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
    nextRandomData: RandomDataForQuiz;

    constructor(birdsInQuiz: Bird[], numOptions: number) {
        this.birdsInQuiz = birdsInQuiz;
        this.fetcher = new Fetcher(birdsInQuiz);
        this.numOptions = numOptions;
        const numBirdsInQuiz = birdsInQuiz.length;
        this.nextRandomData = getRandomDataForQuiz({ numBirdsInQuiz, numOptions });
    }

    async getGoodBirdRecording(randomData: RandomDataForQuiz): Promise<Recording> {
        const birdIndex: number = randomData.correctOptionIndex;
        const numRecordings = await this.fetcher.getNumRecordingsInXenoCanto(birdIndex);
        const startIndex: number = randomData.getStartIndexFromNumRecordings(numRecordings);
        let recordingIndex: number = startIndex;
        let count: number = 0;
        while (true) {
            const recording: Recording = await this.fetcher.getBirdRecording(birdIndex, recordingIndex);
            const shouldStopLooping: boolean = count >= 30;
            if (recording.also.length === 0 || shouldStopLooping) {
                return recording;
            }
            recordingIndex = (recordingIndex + 1) % numRecordings;
            count++;
        }
    }

    async getNewRoundUsingRandomData(randomData: RandomDataForQuiz): Promise<QuizRound> {
        const options: Bird[] = randomData.optionIndexes.map((index) => this.birdsInQuiz[index]);
        const recording: Recording = await this.getGoodBirdRecording(randomData);
        return {
            correctBird: this.birdsInQuiz[randomData.correctOptionIndex],
            recording: recording,
            birdOptions: options,
        };
    }

    preFetchNextRound(): void {
        this.getNewRoundUsingRandomData(this.nextRandomData);
    }

    async getNewRound(): Promise<QuizRound> {
        const result: QuizRound = await this.getNewRoundUsingRandomData(this.nextRandomData);
        this.nextRandomData = getRandomDataForQuiz({ numBirdsInQuiz: this.birdsInQuiz.length, numOptions: this.numOptions });
        return result;
    }
}