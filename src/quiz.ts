import { Bird } from "./model/species";
import * as Species from "./model/species";
import { QuizDriver, QuizRound } from "./model/quiz_driver";
import { Recording } from "./model/xeno_canto_api";


function updateHtmlElements(birdToGuess: Bird, birdsInQuiz: Bird[], recording: Recording) {
    const audio_element: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement;
    audio_element.src = recording.soundFileUrl;
    audio_element.play();

    const choicesDiv: HTMLDivElement = document.getElementById('choices') as HTMLDivElement;
    for (const bird of birdsInQuiz) {
        const isCorrectAnswer = bird.queryName === birdToGuess.queryName;
        const newButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        newButton.textContent = bird.germanName;
        newButton.addEventListener('click', _ => {
            const answerParagraph: HTMLParagraphElement = document.getElementById('congratulation-p') as HTMLParagraphElement;
            answerParagraph.textContent = `${bird.germanName} is ${isCorrectAnswer ? "the" : "NOT"} correct answer`;
        })
        choicesDiv.appendChild(newButton);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const params: URLSearchParams = new URLSearchParams(document.location.search.substring(1));
    const birdsInQuiz: Bird[] = Species.getBirdsFromSearchParamsOrAll(params);

    const driver: QuizDriver = new QuizDriver(birdsInQuiz);

    driver.getNewRound()
        .then((round: QuizRound) => {
            updateHtmlElements(round.correctBird, birdsInQuiz, round.recording);
        });
});
