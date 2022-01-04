import { Bird } from "./model/species";
import * as Species from "./model/species";
import { QuizDriver, QuizRound } from "./model/quiz_driver";
import { Recording } from "./model/xeno_canto_api";

function prepareNewRound(driver: QuizDriver) {
    clearDynamicQuizHtmlElements();
    driver.getNewRound()
        .then((round: QuizRound) => {
            updateQuizHtmlElements(round.correctBird, driver.birdsInQuiz, round.recording);
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
    const answerParagraph: HTMLParagraphElement = document.getElementById('congratulation-p') as HTMLParagraphElement;
    answerParagraph.textContent = "";
}

function updateQuizHtmlElements(birdToGuess: Bird, birdsInQuiz: Bird[], recording: Recording) {
    clearDynamicQuizHtmlElements();
    const audioElement: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement;
    audioElement.src = recording.soundFileUrl;
    audioElement.play();

    const choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    for (const bird of birdsInQuiz) {
        const isCorrectAnswer = bird.scientificName === birdToGuess.scientificName;
        const newButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        newButton.textContent = bird.germanName;
        newButton.addEventListener('click', _ => {
            const answerParagraph: HTMLParagraphElement = document.getElementById('congratulation-p') as HTMLParagraphElement;
            answerParagraph.textContent = `${bird.germanName} is ${isCorrectAnswer ? "the" : "NOT"} correct answer`;
        });
        choicesDiv.appendChild(newButton);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const params: URLSearchParams = new URLSearchParams(document.location.search.substring(1));
    const birdsInQuiz: Bird[] = Species.getBirdsFromSearchParamsOrAll(params);
    const driver: QuizDriver = new QuizDriver(birdsInQuiz);

    setStaticHtmlElements(driver);
    prepareNewRound(driver);
});
