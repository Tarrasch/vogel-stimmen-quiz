export interface Bird {
    queryName: string; // Its scientific name
    germanName: string;
    searchParamCode: string;
}

export const BIRDS: Bird[] = [
    { queryName: "Parus Major", germanName: "Kohlmeise", searchParamCode: "km", },
    { queryName: "Cyanistes Caeruleus", germanName: "Blaumeise", searchParamCode: "bm", },
    { queryName: "Periparus ater", germanName: "Tannenmeise", searchParamCode: "tm", },
]

export function getBirdsFromSearchParamsOrAll(params: URLSearchParams): Bird[] {
    const searchParam: string | null = params.get("species");
    if (!searchParam) {
        return BIRDS;
    }
    let result: Bird[] = [];
    for (let part of searchParam.split(",")) {
        const needle = findBirdBySearchParamCode(part);
        if (needle != undefined) {
            result.push(needle);
        }
    }
    return result;
}

export function getSearchParamStringFromBirds(birds: Bird[]): string {
    return birds.map(bird => bird.searchParamCode).join(',');
}

function findBirdBySearchParamCode(searchParamCode: string): Bird | undefined {
    for (let bird of BIRDS) {
        if (searchParamCode === bird.searchParamCode) {
            return bird;
        }
    }
    return undefined;
}