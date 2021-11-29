import { Bird } from "./species";
import * as Species from "./species";
import { Recording, XenoCantoApiResponse } from "./xeno_canto_api";
import * as XenoCantoApi from "./xeno_canto_api";

interface QueryOptions {
    birdQueryName: string,
}

function buildQuery(queryOptions: QueryOptions): string {
    return `${queryOptions.birdQueryName} area:europe q:A type:song`
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function selectRandomBird(birds: Bird[]): Bird {
    return birds[getRandomInt(birds.length)];
}

function selectRandomRecording(response: XenoCantoApiResponse): Recording {
    return response.recordings[getRandomInt(response.recordings.length)];
}

function updateHtmlElements(birdToGuess: Bird, birdOptions: Bird[], recording: Recording) {
    let audio_element: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement;
    audio_element.src = recording.soundFileUrl;
    audio_element.play();

    let choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    for (let bird of birdOptions) {
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
document.addEventListener("DOMContentLoaded", function () {
    let params: URLSearchParams = new URLSearchParams(document.location.search.substring(1));
    let birdOptions: Bird[] = Species.getBirdsFromSearchParamsOrAll(params);
    let birdToGuess = selectRandomBird(birdOptions);

    fetch(XenoCantoApi.getApiUrl(buildQuery({ birdQueryName: birdToGuess.queryName })))
        .then(response => response.json())
        .then(data => {
            let response: XenoCantoApiResponse = XenoCantoApi.makeXenoCantoApiResponse(data);
            let recording: Recording = selectRandomRecording(response)
            updateHtmlElements(birdToGuess, birdOptions, recording);
        });
});
