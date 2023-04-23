export interface Bird {
    scientificName: string;
    germanName: string;
    difficulty: BirdDifficulty;
}

export enum BirdDifficulty {
    EASY,
    MEDIUM,
    HARD,
}

export const BIRDS: Bird[] = [
    { scientificName: "Anas Platyrhynchos", germanName: "Stockente", difficulty: BirdDifficulty.EASY },
    { scientificName: "Cinclus Cinclus", germanName: "Wasseramsel", difficulty: BirdDifficulty.HARD },
    { scientificName: "Cyanistes Caeruleus", germanName: "Blaumeise", difficulty: BirdDifficulty.EASY },
    { scientificName: "Erithacus Rubecula", germanName: "Rotkehlchen", difficulty: BirdDifficulty.MEDIUM },
    { scientificName: "Fringilla Coelebs", germanName: "Buchfink", difficulty: BirdDifficulty.EASY },
    { scientificName: "Hirundo Rustica", germanName: "Rauchschwalbe", difficulty: BirdDifficulty.MEDIUM },
    { scientificName: "Parus Major", germanName: "Kohlmeise", difficulty: BirdDifficulty.EASY },
    { scientificName: "Periparus Ater", germanName: "Tannenmeise", difficulty: BirdDifficulty.MEDIUM },
    { scientificName: "Phylloscopus Collybita", germanName: "Zilpzalp", difficulty: BirdDifficulty.EASY },
    { scientificName: "Regulus Ignicapilla", germanName: "Sommergoldhähnchen", difficulty: BirdDifficulty.HARD },
    { scientificName: "Regulus Regulus", germanName: "Wintergoldhähnchen", difficulty: BirdDifficulty.HARD },
    { scientificName: "Troglodytes Troglodytes", germanName: "Zaunkönig", difficulty: BirdDifficulty.MEDIUM },
];

// I've not included the following birds because they seem to have only calls and not songs.
// This could also explain why they have so few results for songs in xeno-canto.
//
// * Sperber
// * Eisvogel
// * Graureiher
// * Buntspecht
// * Eichelhäher
// * Kormoran
// * Kleiber

export function getUniqueName(bird: Bird): string {
    return bird.scientificName.replace(" ", "-");
}