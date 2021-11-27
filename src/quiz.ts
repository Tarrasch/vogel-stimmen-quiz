interface Recording {
    soundFileUrl: string;
    recorderName: string;
    englishName: string;
    genericName: string;
    scientificName: string;
}

interface XenoCantoApiResponse {
    numRecordings: number;
    page: number;
    numPages: number;
    recordings: Recording[];
}

function makeRecording(input: any): Recording {
    return {
        soundFileUrl: `https:${input.file}`,
        recorderName: input.rec,
        englishName: input.en,
        genericName: input.gen,
        scientificName: input.sp,
    };
}

function makeXenoCantoApiResponse(input: any): XenoCantoApiResponse {
    return {
        numRecordings: parseInt(input.numRecordings),
        page: input.page,
        numPages: input.numPages,
        recordings: input.recordings.map(makeRecording),
    }
}

interface QueryOptions {
    birdQueryName: string,
}

function buildQuery(queryOptions: QueryOptions): string {
    return `${queryOptions.birdQueryName} area:europe q:A type:song`
}

function wrapInJsonProxy(url: string): string {
    return `https://jsonp.afeld.me/?url=${url}`
}

function getApiUrl(raw_query: string): string {
    return wrapInJsonProxy(`https://www.xeno-canto.org/api/2/recordings?query=${raw_query}`)
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function selectRandomBird(): Bird {
    return BIRDS[getRandomInt(BIRDS.length)];
}

function selectRandomRecording(response: XenoCantoApiResponse): Recording {
    return response.recordings[getRandomInt(response.recordings.length)];
}

function updateHtmlElements(birdToGuess: Bird, recording: Recording) {
    let audio_element: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement;
    audio_element.src = recording.soundFileUrl;
    audio_element.play();

    let choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    for (let bird of BIRDS) {
        let isCorrectAnswer = bird.queryName === birdToGuess.queryName;
        let newButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        newButton.textContent = bird.germanName;
        newButton.addEventListener('click', _ => {
            let answerParagraph: HTMLParagraphElement = document.getElementById('congratulation-p') as HTMLParagraphElement;
            answerParagraph.textContent = `${bird.germanName} is ${isCorrectAnswer ? "the" : "NOT"} correct answer`;
        })
        choicesDiv.appendChild(newButton);
    }
}
console.log("Got here!");
document.addEventListener("DOMContentLoaded", function() {
    let birdToGuess = selectRandomBird();

    fetch(getApiUrl(buildQuery({ birdQueryName: birdToGuess.queryName })))
        .then(response => response.json())
        .then(data => {
            let response: XenoCantoApiResponse = makeXenoCantoApiResponse(data);
            let recording: Recording = selectRandomRecording(response)
            updateHtmlElements(birdToGuess, recording);
        });
});
