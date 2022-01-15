import { Bird, BIRDS } from "./species";

export interface QuizSearchParams {
    species: Bird[];
}

export function getQuizSearchParams(params: URLSearchParams): QuizSearchParams {
    return {
        species: getBirdsFromSearchParamsOrAll(params)
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