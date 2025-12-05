import React from 'react';

const STRINGS = ['G', 'D', 'A', 'E'];

// Visual Y positions for fingers 1-4
// [FingerIndex]: { normal: Y, high: Y+Offset, low: Y-Offset }
// Increasing Y goes DOWN the fingerboard (Higher Pitch).
// So "Hoch" should be larger Y. "Tief" should be smaller Y.
// Base positions:
// F1: ~115
// F2: ~195
// F3: ~275
// F4: ~355

const OFFSET = 12; // Visual shift amount

const FINGER_POSITIONS = {
    0: 115,
    1: 195,
    2: 275,
    3: 355
};

export default function ViolinNeck({ fingerings, onChange }) {
    const handleToggle = (stringIndex, fingerIndex) => {
        // Cycle: Normal (0) -> Hoch (1) -> Tief (-1) -> Normal (0)
        // Or: Tief (-1) -> Normal (0) -> Hoch (1) -> Tief...
        // Let's do: 0 -> 1 -> -1 -> 0
        const currentVal = fingerings[STRINGS[stringIndex]][fingerIndex] ?? 0;

        let nextVal;
        if (currentVal === 0) nextVal = 1; // Normal -> Hoch
        else if (currentVal === 1) nextVal = -1; // Hoch -> Tief
        else nextVal = 0; // Tief -> Normal

        onChange(STRINGS[stringIndex], fingerIndex, nextVal);
    };

    const getY = (fingerIndex, state) => {
        const base = FINGER_POSITIONS[fingerIndex];
        if (state === 1) return base + OFFSET; // Hoch
        if (state === -1) return base - OFFSET; // Tief
        return base; // Normal
    };

    const getColor = (state) => {
        if (state === 1) return "#ef4444"; // Red for Hoch/Sharp
        if (state === -1) return "#3b82f6"; // Blue for Tief/Flat
        return "#d4af37"; // Gold for Normal
    };

    return (
        <div className="violin-neck-container shadow-2xl rounded-2xl overflow-hidden border-4 border-[#3e2723] bg-[#2a1b15] relative w-full max-w-[300px] aspect-[1/2] h-auto mx-auto select-none">
            {/* Wood Texture Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-50 mix-blend-overlay pointer-events-none"></div>

            <svg viewBox="0 0 200 600" className="w-full h-full">
                {/* Nut */}
                <rect x="20" y="20" width="160" height="30" fill="#1a110d" rx="2" />

                {/* Strings */}
                {STRINGS.map((str, idx) => {
                    const x = 50 + (idx * 33.3);
                    const thickness = 4 - idx * 0.8;
                    return (
                        <line
                            key={str}
                            x1={x} y1={50} x2={x} y2={600}
                            stroke={idx === 3 ? "#e0e0e0" : "#d4af37"}
                            strokeWidth={thickness}
                            className="drop-shadow-md"
                        />
                    );
                })}

                {/* Finger Zones */}
                {STRINGS.map((str, sIdx) => {
                    const x = 50 + (sIdx * 33.3);
                    return [0, 1, 2, 3].map((fIdx) => {
                        const state = fingerings[str][fIdx] ?? 0; // 0, 1, -1
                        const yPos = getY(fIdx, state);
                        const color = getColor(state);

                        return (
                            <g
                                key={`${str}-${fIdx}`}
                                onClick={() => handleToggle(sIdx, fIdx)}
                                className="cursor-pointer group"
                            >
                                {/* Hit Area (Static, covers all ranges) */}
                                <rect
                                    x={x - 15}
                                    y={FINGER_POSITIONS[fIdx] - 25}
                                    width="30"
                                    height={50}
                                    fill="transparent"
                                />

                                {/* Animated Group for Circle + Text */}
                                <g
                                    style={{ transform: `translate(${x}px, ${yPos}px)` }}
                                    className="transition-transform duration-300 ease-in-out"
                                >
                                    {/* Finger Marker (Centered at 0,0 relative to group) */}
                                    <circle
                                        cx={0}
                                        cy={0}
                                        r={10}
                                        fill={color}
                                        className="transition-colors duration-300 ease-in-out shadow-lg stroke-black stroke-1"
                                    />
                                    {/* Label */}
                                    <text
                                        x={0}
                                        y={4}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="black"
                                        className="pointer-events-none font-bold opacity-70"
                                    >
                                        {fIdx + 1}
                                    </text>
                                </g>

                                {/* Visual Guide for Standard Position (Optional, faint dot) */}
                                {state !== 0 && (
                                    <circle cx={x} cy={FINGER_POSITIONS[fIdx]} r={3} fill="#ffffff" opacity="0.2" pointerEvents="none" />
                                )}
                            </g>
                        );
                    });
                })}
            </svg>

            {/* Legend / Labels */}
            <div className="absolute top-2 left-2 text-[#d4af37] text-xs font-serif opacity-50">Sattel (Oben)</div>

            <div className="absolute bottom-2 left-4 text-[#d4af37] text-xs font-serif opacity-50 text-left pointer-events-none">
                <span className="text-[#3b82f6]">●</span> Tief (-)<br />
                <span className="text-[#d4af37]">●</span> Normal (♮)<br />
                <span className="text-[#ef4444]">●</span> Hoch (♯)
            </div>
        </div>
    );
}
