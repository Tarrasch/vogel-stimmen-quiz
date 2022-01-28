import { Bird, BIRDS, getUniqueName } from "./model/species";
import { getQuizSearchParams, getSearchParamStringFromBirds, QuizSearchParams } from "./model/search_params";

function startQuiz(): void {
    let url = new URL("./quiz.html", document.baseURI);
    url.searchParams.set("species", getSearchParamStringFromBirds(getSelectedSpecies()));
    url.searchParams.set("numOptions", (document.getElementById('num-options') as HTMLInputElement).value);
    document.location.href = url.href;
}

function getCheckBoxId(bird: Bird) {
    return `specie-${getUniqueName(bird)}`;
}

function getSelectedSpecies(): Bird[] {
    const result: Bird[] = [];
    for (let bird of BIRDS) {
        const checkbox = document.getElementById(getCheckBoxId(bird)) as HTMLInputElement;
        if (checkbox.checked) {
            result.push(bird);
        }
    }
    return result;
}

function createDivWithCheckBox(bird: Bird): HTMLDivElement {
    const div = document.createElement("div") as HTMLDivElement;
    const checkbox = document.createElement("input") as HTMLInputElement;
    const label = document.createElement("label") as HTMLLabelElement;

    checkbox.type = 'checkbox';
    checkbox.id = getCheckBoxId(bird);
    label.innerText = bird.germanName;
    div.appendChild(checkbox)
    div.appendChild(label);

    return div;
}

function fillSpeciesList(): void {
    const speciesDiv = document.getElementById('species-list');
    for (let bird of BIRDS) {
        speciesDiv?.appendChild(createDivWithCheckBox(bird));
    }
}

function addDocumentListeners(): void {
    document.getElementById('start-quiz')?.addEventListener('click', startQuiz);
}

function fillOptionsFromParams(quizSearchParams: QuizSearchParams) {
    checkBirdCheckBoxes(quizSearchParams.species);
    (document.getElementById('num-options') as HTMLInputElement).valueAsNumber = quizSearchParams.numOptions;
}

function checkBirdCheckBoxes(birds: Bird[]) {
    for (let bird of birds) {
        const checkbox = document.getElementById(getCheckBoxId(bird)) as HTMLInputElement;
        checkbox.checked = true;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    addDocumentListeners();
    fillSpeciesList();
    const params: URLSearchParams = new URLSearchParams(document.location.search.substring(1));
    const quizSearchParams: QuizSearchParams = getQuizSearchParams(params);
    fillOptionsFromParams(quizSearchParams);
});
