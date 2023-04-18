import { Bird } from "./model/species";
import { QuizDriver, QuizRound } from "./model/quiz_driver";
import { Recording } from "./model/xeno_canto_api";
import { getQuizSearchParams, QuizSearchParams } from "./model/search_params";

function answerParagraph(): HTMLParagraphElement {
    return document.getElementById('answer-p') as HTMLParagraphElement;
}
function recordistAttributionAnchor(): HTMLAnchorElement {
    return document.getElementById('recordist-attribution') as HTMLAnchorElement;
}

function setEditQuizButton(params: URLSearchParams) {
    const url:URL = new URL("quiz_starter.html", document.URL);
    url.search = params.toString();
    const anchor: HTMLAnchorElement = document.getElementById("edit-quiz") as HTMLAnchorElement;
    anchor.setAttribute("href", url.href);
}

function prepareNewRound(driver: QuizDriver) {
    clearDynamicQuizHtmlElements();
    driver.getNewRound()
        .then((round: QuizRound) => {
            driver.preFetchNextRound();
            updateQuizHtmlElements(round.correctBird, round.birdOptions, round.recording);
        });
}

function setStaticHtmlElements(driver: QuizDriver) {
    const nextQuizButton: HTMLButtonElement = document.getElementById("next-question") as HTMLButtonElement;
    nextQuizButton.addEventListener('click', _ => {
        prepareNewRound(driver);
    });
}

function clearDynamicQuizHtmlElements(): void {
    const choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    while (choicesDiv.firstChild) {
        choicesDiv.removeChild(choicesDiv.firstChild);
    }
    answerParagraph().textContent = "";
    recordistAttributionAnchor().textContent = "";
    recordistAttributionAnchor().href = "";
}

function updateQuizHtmlElements(birdToGuess: Bird, birdOptions: Bird[], recording: Recording) {
    clearDynamicQuizHtmlElements();
    const audioElement: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement;
    audioElement.src = recording.soundFileUrl;
    audioElement.play();

    const choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    for (const bird of birdOptions) {
        const isCorrectAnswer = bird.scientificName === birdToGuess.scientificName;
        const newButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        newButton.textContent = bird.germanName;
        newButton.addEventListener('click', _ => {
            answerParagraph().textContent = `${bird.germanName} ist ${isCorrectAnswer ? "RICHTIG" : "FALSCH"}`;
            if(isCorrectAnswer) {
                recordistAttributionAnchor().textContent = `Aufname XC${recording.id} [${recording.recorderName}]`;
                recordistAttributionAnchor().href = `https:${recording.url}`;
            }
        });
        choicesDiv.appendChild(newButton);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const params: URLSearchParams = new URLSearchParams(document.location.search.substring(1));
    const quizSearchParams: QuizSearchParams = getQuizSearchParams(params);
    const birdsInQuiz: Bird[] = quizSearchParams.species;
    const driver: QuizDriver = new QuizDriver(birdsInQuiz, Math.min(birdsInQuiz.length, quizSearchParams.numOptions));

    setEditQuizButton(params);
    setStaticHtmlElements(driver);
    prepareNewRound(driver);
});
