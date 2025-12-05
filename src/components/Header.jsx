import React from 'react';

export default function Header({ currentKey, streak }) {
    return (
        <header className="text-center mb-8 pt-6">
            <h1 className="text-4xl font-serif text-[#d4af37] drop-shadow-lg mb-2 tracking-widest uppercase" style={{ textShadow: '2px 2px 4px #000' }}>
                Geigengriffel
            </h1>
            <div className="inline-block relative">
                <div className="absolute inset-0 bg-[#3e2723] opacity-80 blur-md rounded-lg transform scale-110"></div>
                <div className="relative bg-[#f4ebd0] border-2 border-[#d4af37] px-8 py-3 rounded shadow-xl text-[#3e2723]">
                    <p className="text-sm uppercase tracking-wide opacity-70 mb-1">Aktuelle Tonart</p>
                    <h2 className="text-3xl font-bold">{currentKey ? currentKey.name : 'Lade...'}</h2>
                </div>
            </div>

            {/* Streak / Score (Optional pill) */}
            <div className="mt-4">
                <div className="inline-flex items-center gap-2 bg-[#1a110d] px-4 py-1 rounded-full border border-[#5d4037]">
                    <span className="text-amber-500">★</span>
                    <span className="text-[#efebe9] font-mono">{streak} Richtig in Folge</span>
                </div>
            </div>
        </header>
    );
}
