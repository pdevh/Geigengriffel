import React, { useEffect, useRef } from 'react';
import { Factory } from 'vexflow';

const KEY_SPECS = {
    0: "C",
    1: "G",
    2: "D",
    3: "A",
    4: "E",
    5: "B",
    6: "F#",
    7: "C#",
    [-1]: "F",
    [-2]: "Bb",
    [-3]: "Eb",
    [-4]: "Ab",
    [-5]: "Db",
    [-6]: "Gb",
    [-7]: "Cb"
};

export default function KeySelector({ value, onChange }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        try {
            // Clear previous
            containerRef.current.innerHTML = '';

            // Initialize VexFlow Factory
            const vf = new Factory({
                renderer: { elementId: containerRef.current, width: 250, height: 120 }
            });

            const context = vf.getContext();

            // Render Stave
            const stave = vf.Stave({ x: 10, y: 10, width: 230 });
            stave.addClef("treble");

            const keySpec = KEY_SPECS[value] || "C";
            stave.addKeySignature(keySpec);

            stave.setContext(context).draw();
        } catch (e) {
            console.error("VexFlow Error:", e);
            containerRef.current.innerHTML = `<div class='text-red-500'>Error loading score</div>`;
        }
    }, [value]);

    const handleInc = () => {
        if (value < 7) onChange(value + 1);
    };

    const handleDec = () => {
        if (value > -7) onChange(value - 1);
    };

    return (
        <div className="key-selector bg-[#f4ebd0] border-4 border-[#8d6e63] rounded-lg p-4 shadow-inner mb-6 relative paper-texture max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
                <button onClick={handleDec} className="bg-[#5d4037] text-[#efebe9] px-3 py-1 rounded shadow active:scale-95 font-serif">♭ hinzufügen</button>
                <span className="font-serif font-bold text-[#3e2723]">Vorzeichen wählen</span>
                <button onClick={handleInc} className="bg-[#5d4037] text-[#efebe9] px-3 py-1 rounded shadow active:scale-95 font-serif">♯ hinzufügen</button>
            </div>

            {/* VexFlow Container */}
            <div ref={containerRef} className="flex justify-center"></div>
        </div>
    );
}
