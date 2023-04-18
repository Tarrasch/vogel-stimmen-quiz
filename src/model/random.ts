
function fisherYatesShuffle(array: number[]) {
    for (let i: number = 0; i < array.length - 1; i++) {
        const j: number = i + getRandomInt(array.length - i);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomInts(max: number, outputLength: number): number[] {
    if (outputLength > max) {
        console.log("ERROR!!! outputLength > max");
        return [-999999];
    }
    const output: number[] = Array(max).fill(undefined).map((_, ix) => ix);
    fisherYatesShuffle(output);  // This is O(n) independent of outputLength.

    return output.slice(0, outputLength);
}

function getRandomInt(max: number): number {
    return getRandomIntUsingFloat(max, Math.random());
}

function getRandomIntUsingFloat(max: number, float = Math.random()): number {
    return Math.floor(float * max);
}

export function getRandomDataForQuiz(input: {numBirdsInQuiz: number, numOptions: number}): RandomDataForQuiz {
    const optionIndexes: number[] = getRandomInts(input.numBirdsInQuiz, input.numOptions);
    const float = Math.random();
    return {
        optionIndexes: optionIndexes,
        correctOptionIndex: optionIndexes[getRandomInt(input.numOptions)],
        getStartIndexFromNumRecordings: (numRecordings: number) => getRandomIntUsingFloat(numRecordings, float),
    };
}

export interface RandomDataForQuiz {
    optionIndexes: number[],
    correctOptionIndex: number,  // A value in optionIndexes.
    getStartIndexFromNumRecordings: (max: number) => number,
}