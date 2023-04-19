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
function choiceButtons(): HTMLButtonElement[] {
    return Array.from(document.getElementsByClassName('choice-button') as HTMLCollectionOf<HTMLButtonElement>);
}

function clearAllEventHandlers(button: HTMLButtonElement) {
    // https://stackoverflow.com/a/39026635/621449
    button.outerHTML = button.outerHTML;
}

function createEmptyChoiceButtons(numButtons: number): void {
    const choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    for (let i = 0; i < numButtons; i++) {
        const button: HTMLButtonElement = document.createElement('button') as HTMLButtonElement;
        button.className = 'choice-button';
        choicesDiv.appendChild(button);
    }
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
    for(const button of choiceButtons()) {
        button.textContent = "";
        clearAllEventHandlers(button);
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


    for (let i = 0; i < birdOptions.length; i++) {
        const bird: Bird = birdOptions[i];
        const button: HTMLButtonElement = choiceButtons()[i];
        const isCorrectAnswer = bird.scientificName === birdToGuess.scientificName;
        button.textContent = bird.germanName;
        button.addEventListener('click', _ => {
            answerParagraph().textContent = `${bird.germanName} ist ${isCorrectAnswer ? "RICHTIG" : "FALSCH"}`;
            if(isCorrectAnswer) {
                recordistAttributionAnchor().textContent = `Aufname XC${recording.id} [${recording.recorderName}]`;
                recordistAttributionAnchor().href = `https:${recording.url}`;
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const params: URLSearchParams = new URLSearchParams(document.location.search.substring(1));
    const quizSearchParams: QuizSearchParams = getQuizSearchParams(params);
    const birdsInQuiz: Bird[] = quizSearchParams.species;
    const driver: QuizDriver = new QuizDriver(birdsInQuiz, Math.min(birdsInQuiz.length, quizSearchParams.numOptions));

    createEmptyChoiceButtons(driver.numOptions);
    setEditQuizButton(params);
    setStaticHtmlElements(driver);
    prepareNewRound(driver);
});
