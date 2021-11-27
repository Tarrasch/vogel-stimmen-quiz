"use strict";
function makeRecording(input) {
    return {
        soundFileUrl: `https:${input.file}`,
        recorderName: input.rec,
        englishName: input.en,
        genericName: input.gen,
        scientificName: input.sp,
    };
}
function makeXenoCantoApiResponse(input) {
    return {
        numRecordings: parseInt(input.numRecordings),
        page: input.page,
        numPages: input.numPages,
        recordings: input.recordings.map(makeRecording),
    };
}
function buildQuery(queryOptions) {
    return `${queryOptions.birdQueryName} area:europe q:A type:song`;
}
function wrapInJsonProxy(url) {
    return `https://jsonp.afeld.me/?url=${url}`;
}
function getApiUrl(raw_query) {
    return wrapInJsonProxy(`https://www.xeno-canto.org/api/2/recordings?query=${raw_query}`);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function selectRandomBird() {
    return BIRDS[getRandomInt(BIRDS.length)];
}
function selectRandomRecording(response) {
    return response.recordings[getRandomInt(response.recordings.length)];
}
function updateHtmlElements(birdToGuess, recording) {
    let audio_element = document.getElementById('audio');
    audio_element.src = recording.soundFileUrl;
    audio_element.play();
    let choicesDiv = document.getElementById('choices');
    for (let bird of BIRDS) {
        let isCorrectAnswer = bird.queryName === birdToGuess.queryName;
        let newButton = document.createElement("button");
        newButton.textContent = bird.germanName;
        newButton.addEventListener('click', _ => {
            let answerParagraph = document.getElementById('congratulation-p');
            answerParagraph.textContent = `${bird.germanName} is ${isCorrectAnswer ? "the" : "NOT"} correct answer`;
        });
        choicesDiv.appendChild(newButton);
    }
}
console.log("Got here!");
document.addEventListener("DOMContentLoaded", function () {
    let birdToGuess = selectRandomBird();
    fetch(getApiUrl(buildQuery({ birdQueryName: birdToGuess.queryName })))
        .then(response => response.json())
        .then(data => {
        let response = makeXenoCantoApiResponse(data);
        let recording = selectRandomRecording(response);
        updateHtmlElements(birdToGuess, recording);
    });
});
const BIRDS = [
    { queryName: "Parus Major", germanName: "Kohlmeise", },
    { queryName: "Cyanistes Caeruleus", germanName: "Blaumeise", },
];
