import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GamePageProps {
  onRestart: () => void;
}

export default function GamePage({ onRestart }: GamePageProps) {
  const [position, setPosition] = useState(50);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const bucketWidth = 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPosition(p => Math.max(0, p - 5));
      } else if (e.key === 'ArrowRight') {
        setPosition(p => Math.min(90, p + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const spawnHeart = () => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * (100 - 10),
        y: -10,
      };
      setHearts(prev => [...prev, newHeart]);
    };

    const interval = setInterval(spawnHeart, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateHearts = () => {
      setHearts(prev => {
        const newHearts = prev.map(heart => ({
          ...heart,
          y: heart.y + 2,
        }));

        newHearts.forEach(heart => {
          if (
            heart.y > 80 &&
            heart.y < 90 &&
            heart.x > position - bucketWidth / 2 &&
            heart.x < position + bucketWidth / 2
          ) {
            setScore(s => {
              const newScore = s + 1;
              if (newScore >= 10) {
                setWon(true);
                setGameOver(true);
              }
              return newScore;
            });
            const index = newHearts.indexOf(heart);
            if (index > -1) {
              newHearts.splice(index, 1);
            }
          }
        });

        return newHearts.filter(heart => heart.y < 100);
      });

      requestRef.current = requestAnimationFrame(updateHearts);
    };

    requestRef.current = requestAnimationFrame(updateHearts);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameAreaRef.current) {
      const touch = e.touches[0];
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(0, Math.min(90, x)));
    }
  };

  return (
    <div
      ref={gameAreaRef}
      className="min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-200 relative overflow-hidden"
      onTouchMove={handleTouchMove}
    >
      <div className="fixed top-4 right-4 text-xl font-bold">
        <div>Time: {timeLeft}s</div>
        <div>Hearts: {score}/10</div>
      </div>

      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute text-3xl"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-10 w-20 h-20 text-4xl flex items-center justify-center"
        style={{ left: `${position}%` }}
        animate={{ x: '-50%' }}
      >
        🪣
      </motion.div>

      {gameOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
        >
          <div className="bg-white p-8 rounded-xl text-center">
            {won ? (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl mb-4"
                >
                  😘
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">
                  YAYY The website creator loves you 😘
                </h2>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl mb-4"
                >
                  😔
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">You lost 😔</h2>
              </>
            )}
            <button
              onClick={onRestart}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              {won ? "Play Again!" : "It's okay, try again"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}