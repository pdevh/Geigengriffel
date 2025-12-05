import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ViolinNeck from './components/ViolinNeck';
import KeySelector from './components/KeySelector';
import { getRandomKey, getCorrectFingerings, STRINGS } from './lib/musicData';

function App() {
  const [currentKey, setCurrentKey] = useState(null);
  const [userVorzeichen, setUserVorzeichen] = useState(0);
  const [userFingerings, setUserFingerings] = useState({
    G: [0, 0, 0, 0],
    D: [0, 0, 0, 0],
    A: [0, 0, 0, 0],
    E: [0, 0, 0, 0]
  });

  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  const [streak, setStreak] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Initialize Game
  useEffect(() => {
    loadNewRound();
  }, []);

  const loadNewRound = () => {
    const key = getRandomKey();
    setCurrentKey(key);
    setUserVorzeichen(0);
    setUserFingerings({
      G: [0, 0, 0, 0],
      D: [0, 0, 0, 0],
      A: [0, 0, 0, 0],
      E: [0, 0, 0, 0]
    });
    setFeedback(null);
    setShowSolution(false);
  };

  const handleFingerChange = (stringName, fingerIndex, value) => {
    if (showSolution) return;
    setUserFingerings(prev => {
      const newArr = [...prev[stringName]];
      newArr[fingerIndex] = value;
      return { ...prev, [stringName]: newArr };
    });
  };

  const checkAnswer = () => {
    if (!currentKey) return;

    // 1. Check Vorzeichen
    const isVorzeichenCorrect = userVorzeichen === currentKey.signature;

    // 2. Check Fingerings
    const correctFingerings = getCorrectFingerings(currentKey.signature);
    let isFingeringsCorrect = true;

    STRINGS.forEach(str => {
      // Validation: Exact match (-1, 0, 1)
      for (let i = 0; i < 4; i++) {
        const userVal = userFingerings[str.name][i];
        const correctVal = correctFingerings[str.name][i];

        if (userVal !== correctVal) {
          isFingeringsCorrect = false;
          console.log(`Mismatch on ${str.name}${i + 1}: User ${userVal} vs Correct ${correctVal}`);
        }
      }
    });

    if (isVorzeichenCorrect && isFingeringsCorrect) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setTimeout(() => {
        loadNewRound();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden">
      <Header currentKey={currentKey} streak={streak} />

      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">

        {/* Left Panel: Inputs */}
        <div className="flex-1 w-full max-w-md mx-auto">

          {/* Instruction */}
          <div className="bg-[#3e2723] text-[#d4af37] p-4 rounded-lg mb-6 shadow-lg border border-[#5d4037]">
            <h3 className="font-bold border-b border-[#5d4037] pb-2 mb-2">Anleitung</h3>
            <ol className="list-decimal pl-4 space-y-1 text-sm opacity-90">
              <li>Wähle die korrekten Vorzeichen für <strong>{currentKey?.name}</strong>.</li>
              <li>Setze die Finger auf dem Griffbrett.</li>
              <li><strong>Blau</strong> = Tief (b), <strong>Gold</strong> = Normal, <strong>Rot</strong> = Hoch (#).</li>
            </ol>
          </div>

          <KeySelector value={userVorzeichen} onChange={showSolution ? () => { } : setUserVorzeichen} />

          <div className="text-center mt-8">
            <button
              onClick={checkAnswer}
              disabled={showSolution || feedback === 'correct'}
              className={`
                        px-8 py-3 rounded-full font-bold text-xl shadow-xl transition-all border-2
                        ${feedback === 'correct' ? 'bg-green-600 border-green-400 text-white' :
                  feedback === 'incorrect' ? 'bg-red-600 border-red-400 text-white animate-shake' :
                    'bg-[#d4af37] border-[#fff8e1] text-[#3e2723] hover:scale-105 hover:bg-[#ffca28]'}
                    `}
            >
              {feedback === 'correct' ? 'Richtig!' : feedback === 'incorrect' ? 'Leider falsch' : 'Prüfen'}
            </button>

            {feedback === 'incorrect' && (
              <p className="mt-4 text-red-400 font-bold bg-black/50 p-2 rounded inline-block">
                Prüfe Vorzeichen und Fingerstellung!
              </p>
            )}
          </div>

        </div>

        {/* Right Panel: Violin Neck */}
        <div className="flex-none mx-auto">
          <ViolinNeck fingerings={userFingerings} onChange={handleFingerChange} />
        </div>

      </main>

      {/* Footer / Deco */}
      <footer className="fixed bottom-0 w-full bg-[#1a110d] text-[#5d4037] text-center p-2 text-xs border-t border-[#3e2723]">
        Geigengriffel App v1.1 - Erste Lage
      </footer>
    </div>
  );
}

export default App;
