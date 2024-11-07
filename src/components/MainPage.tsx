import React, { useEffect, useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainPageProps {
  onComplete: () => void;
}

export default function MainPage({ onComplete }: MainPageProps) {
  const [showRose, setShowRose] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showHearts, setShowHearts] = useState(false);
  const [showClickMe, setShowClickMe] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const message = `My dearest love, every moment with you feels like a beautiful dream come true. Your smile lights up my world, and your love makes my heart dance with joy. Thank you for being the most amazing person in my life. Happy Birthday! ❤️`;

  useEffect(() => {
    const audio = new Audio('https://dl.sndup.net/33q9w/Audio.mp3');
    audioRef.current = audio;
    audio.loop = true;
  }, []);

  const handleRoseClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setShowRose(false);
    setShowMessage(true);
    startTyping();
  };

  const startTyping = () => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(prev => prev + message[index]);
        index++;
      } else {
        clearInterval(timer);
        setShowHearts(true);
        setTimeout(() => {
          setShowClickMe(true);
        }, 1000);
      }
    }, 50);
  };

  const createHeart = (x: number, y: number) => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'absolute text-2xl animate-float-up';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    containerRef.current?.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  };

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    createHeart(x, y);
  };

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-200 p-6 relative overflow-hidden perspective-1000"
      onTouchStart={handleTouch}
      onMouseDown={handleTouch}
    >
      <AnimatePresence>
        {showRose && (
          <motion.div
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleRoseClick}
          >
            <img
              src="https://images.unsplash.com/photo-1548094967-e25a127d1f6d?w=600"
              alt="Beautiful Rose"
              className="w-64 h-64 object-cover rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 animate-water-drop" />
          </motion.div>
        )}

        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:rotate-1 transition-transform duration-300">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-serif">
                {displayedText}
                <span className="animate-pulse inline-block ml-1">|</span>
              </p>
            </div>
          </motion.div>
        )}

        {showClickMe && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-10 right-10 text-4xl cursor-pointer"
            onClick={onComplete}
          >
            ❤️ Click Me!
          </motion.button>
        )}
      </AnimatePresence>

      {showHearts && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth }}
              animate={{
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute text-2xl"
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}