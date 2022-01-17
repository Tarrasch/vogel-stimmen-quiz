import { Bird, BIRDS } from "./species";

export interface QuizSearchParams {
    species: Bird[];
    numOptions: number;
}

export function getQuizSearchParams(params: URLSearchParams): QuizSearchParams {
    return {
        species: getBirdsFromSearchParamsOrAll(params),
        numOptions: getNumOptionsFromSearchParamsOrDefault4(params),
    }
}

function getBirdsFromSearchParamsOrAll(params: URLSearchParams): Bird[] {
    const searchParam: string | null = params.get("species");
    if (!searchParam) {
        return BIRDS;
    }
    let species: Bird[] = [];
    for (let part of searchParam.split(",")) {
        const needle = findBirdByScientificName(part);
        if (needle != undefined) {
            species.push(needle);
        }
    }
    return species;
}

export function getSearchParamStringFromBirds(birds: Bird[]): string {
    return birds.map(bird => bird.scientificName).join(',');
}

function findBirdByScientificName(maybeScientificName: string): Bird | undefined {
    for (let bird of BIRDS) {
        if (maybeScientificName === bird.scientificName) {
            return bird;
        }
    }
    return undefined;
}

function getNumOptionsFromSearchParamsOrDefault4(params: URLSearchParams): number {
    const parsed :number = parseInt(params.get("numOptions") || '4');
    if(Number.isNaN(parsed)) {
        return 4;
    }
    return parsed;
}
