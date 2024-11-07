import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import GamePage from './components/GamePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'main' | 'game'>('landing');
  const [showGameInstructions, setShowGameInstructions] = useState(false);

  const handleTransitionComplete = () => {
    setCurrentPage('main');
  };

  const handleMainComplete = () => {
    setShowGameInstructions(true);
    setTimeout(() => {
      setShowGameInstructions(false);
      setCurrentPage('game');
    }, 4000);
  };

  return (
    <div className="relative">
      {currentPage === 'landing' && (
        <LandingPage onTransitionComplete={handleTransitionComplete} />
      )}
      {currentPage === 'main' && (
        <MainPage onComplete={handleMainComplete} />
      )}
      {showGameInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-center p-8 bg-white rounded-xl transform animate-bounce">
            <h2 className="text-3xl font-comic mb-4">Game Instructions!</h2>
            <p className="text-xl">Collect 10 falling hearts in 15 seconds! 💝</p>
            <p className="text-lg mt-2">Use arrow keys or touch to move the bucket!</p>
          </div>
        </div>
      )}
      {currentPage === 'game' && (
        <GamePage onRestart={() => setCurrentPage('landing')} />
      )}
    </div>
  );
}