export const STRINGS = [
    { name: 'G', base: 'G3', index: 0 },
    { name: 'D', base: 'D4', index: 1 },
    { name: 'A', base: 'A4', index: 2 },
    { name: 'E', base: 'E5', index: 3 }
];

export const TONARTEN = [
    { name: 'C-Dur', signature: 0 },
    { name: 'G-Dur', signature: 1 }, // F#
    { name: 'D-Dur', signature: 2 }, // F#, C#
    { name: 'A-Dur', signature: 3 }, // F#, C#, G#
    { name: 'E-Dur', signature: 4 }, // F#, C#, G#, D#
    { name: 'F-Dur', signature: -1 }, // Bb
    { name: 'B-Dur', signature: -2 }, // Bb, Eb
    { name: 'Es-Dur', signature: -3 }, // Bb, Eb, Ab
    { name: 'As-Dur', signature: -4 }  // Bb, Eb, Ab, Db
];

const KEY_SIGNATURES = {
    0: [], // C
    1: ['F#'], // G
    2: ['F#', 'C#'], // D
    3: ['F#', 'C#', 'G#'], // A
    4: ['F#', 'C#', 'G#', 'D#'], // E
    [-1]: ['Bb'], // F
    [-2]: ['Bb', 'Eb'], // B
    [-3]: ['Bb', 'Eb', 'Ab'], // Es
    [-4]: ['Bb', 'Eb', 'Ab', 'Db'] // As
};

function getNoteStatus(noteBase, signature) {
    const sigs = KEY_SIGNATURES[signature];
    if (!sigs) return 'Natural';
    if (sigs.includes(noteBase + '#')) return 'Sharp';
    if (sigs.includes(noteBase + 'b')) return 'Flat';
    return 'Natural';
}

export function getCorrectFingerings(signature) {
    const fingerings = {
        G: [0, 0, 0, 0],
        D: [0, 0, 0, 0],
        A: [0, 0, 0, 0],
        E: [0, 0, 0, 0]
    };

    // Logic: 
    // Flat = -1 (Tief)
    // Natural = 0 (Normal)
    // Sharp = 1 (Hoch)

    // G String (Base G)
    // 1: A
    fingerings.G[0] = getStatusValue('A', signature);
    // 2: B
    fingerings.G[1] = getStatusValue('B', signature);
    // 3: C
    fingerings.G[2] = getStatusValue('C', signature);
    // 4: D (Usually open next string, but as 4th finger it takes the signature of D)
    fingerings.G[3] = getStatusValue('D', signature);

    // D String (Base D)
    // 1: E
    fingerings.D[0] = getStatusValue('E', signature);
    // 2: F
    fingerings.D[1] = getStatusValue('F', signature);
    // 3: G
    fingerings.D[2] = getStatusValue('G', signature);
    // 4: A
    fingerings.D[3] = getStatusValue('A', signature);

    // A String (Base A)
    // 1: B
    fingerings.A[0] = getStatusValue('B', signature);
    // 2: C
    fingerings.A[1] = getStatusValue('C', signature);
    // 3: D
    fingerings.A[2] = getStatusValue('D', signature);
    // 4: E
    fingerings.A[3] = getStatusValue('E', signature);

    // E String
    // 1: F
    fingerings.E[0] = getStatusValue('F', signature);
    // 2: G
    fingerings.E[1] = getStatusValue('G', signature);
    // 3: A
    fingerings.E[2] = getStatusValue('A', signature);
    // 4: B
    fingerings.E[3] = getStatusValue('B', signature);

    return fingerings;
}

function getStatusValue(note, signature) {
    const status = getNoteStatus(note, signature);
    if (status === 'Flat') return -1;
    if (status === 'Sharp') return 1;
    return 0; // Natural
}

export function getRandomKey() {
    const validKeys = [0, 1, 2, 3, 4, -1, -2, -3, -4];
    const idx = Math.floor(Math.random() * validKeys.length);
    const sig = validKeys[idx];
    return TONARTEN.find(t => t.signature === sig);
}
