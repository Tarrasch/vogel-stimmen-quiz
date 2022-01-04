import { Bird, BIRDS, getSearchParamStringFromBirds, getUniqueName } from "./model/species";

function startQuiz(): void {
    let url = new URL("./quiz.html", document.baseURI);
    url.searchParams.set("species", getSearchParamStringFromBirds(getSelectedSpecies()));
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

function getDivWithCheckBox(bird: Bird): HTMLDivElement {
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
        speciesDiv?.appendChild(getDivWithCheckBox(bird));
    }
}

function addDocumentListeners(): void {
    document.getElementById('start-quiz')?.addEventListener('click', startQuiz);
}

document.addEventListener("DOMContentLoaded", function () {
    addDocumentListeners();
    fillSpeciesList();
});
