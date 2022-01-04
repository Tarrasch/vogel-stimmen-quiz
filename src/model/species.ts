export interface Bird {
    scientificName: string;
    germanName: string;
}

export const BIRDS: Bird[] = [
    { scientificName: "Parus Major", germanName: "Kohlmeise", },
    { scientificName: "Cyanistes Caeruleus", germanName: "Blaumeise", },
    { scientificName: "Periparus Ater", germanName: "Tannenmeise", },
    { scientificName: "Dendrocopos Major", germanName: "Buntspecht", },
    { scientificName: "Troglodytes Troglodytes", germanName: "Zaunkönig", },
    { scientificName: "Erithacus Rubecula", germanName: "Rotkehlchen", },
    { scientificName: "Phylloscopus Collybita", germanName: "Zilpzalp", },
    { scientificName: "Sitta Europaea", germanName: "Kleiber", },
    { scientificName: "Garrulus Glandarius", germanName: "Eichelhäher", },
]

export function getBirdsFromSearchParamsOrAll(params: URLSearchParams): Bird[] {
    const searchParam: string | null = params.get("species");
    if (!searchParam) {
        return BIRDS;
    }
    let result: Bird[] = [];
    for (let part of searchParam.split(",")) {
        const needle = findBirdByScientificName(part);
        if (needle != undefined) {
            result.push(needle);
        }
    }
    return result;
}

export function getSearchParamStringFromBirds(birds: Bird[]): string {
    return birds.map(bird => bird.scientificName).join(',');
}

export function getUniqueName(bird: Bird): string {
    return bird.scientificName.replace(" ", "-");
}

function findBirdByScientificName(maybeScientificName: string): Bird | undefined {
    for (let bird of BIRDS) {
        if (maybeScientificName === bird.scientificName) {
            return bird;
        }
    }
    return undefined;
}