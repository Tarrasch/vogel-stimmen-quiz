export interface Bird {
    scientificName: string;
    germanName: string;
}

export const BIRDS: Bird[] = [
    { scientificName: "Parus Major", germanName: "Kohlmeise", },
    { scientificName: "Cyanistes Caeruleus", germanName: "Blaumeise", },
    { scientificName: "Periparus Ater", germanName: "Tannenmeise", },
    { scientificName: "Fringilla Coelebs", germanName: "Buchfink", },
    { scientificName: "Dendrocopos Major", germanName: "Buntspecht", },
    { scientificName: "Troglodytes Troglodytes", germanName: "Zaunkönig", },
    { scientificName: "Erithacus Rubecula", germanName: "Rotkehlchen", },
    { scientificName: "Phylloscopus Collybita", germanName: "Zilpzalp", },
    { scientificName: "Sitta Europaea", germanName: "Kleiber", },
    { scientificName: "Garrulus Glandarius", germanName: "Eichelhäher", },
]

export function getUniqueName(bird: Bird): string {
    return bird.scientificName.replace(" ", "-");
}