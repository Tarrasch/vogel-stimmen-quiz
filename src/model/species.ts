export interface Bird {
    scientificName: string;
    germanName: string;
    searchParamCode: string;
}

export const BIRDS: Bird[] = [
    { scientificName: "Parus Major", germanName: "Kohlmeise", searchParamCode: "km", },
    { scientificName: "Cyanistes Caeruleus", germanName: "Blaumeise", searchParamCode: "bm", },
    { scientificName: "Periparus ater", germanName: "Tannenmeise", searchParamCode: "tm", },
    { scientificName: "Dendrocopos major", germanName: "Buntspecht", searchParamCode: "bs", },
    { scientificName: "Troglodytes troglodytes", germanName: "Zaunkönig", searchParamCode: "zk", },
    { scientificName: "Erithacus rubecula", germanName: "Rotkehlchen", searchParamCode: "rk", },
    { scientificName: "Phylloscopus collybita", germanName: "Zilpzalp", searchParamCode: "zz", },
    { scientificName: "Sitta europaea", germanName: "Kleiber", searchParamCode: "kl", },
    { scientificName: "Garrulus glandarius", germanName: "Eichelhäher", searchParamCode: "eh", },
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