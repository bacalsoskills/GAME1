import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import ProblemBlock from './ProblemBlock';
import InputBox from './InputBox';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import PauseOverlay from './PauseOverlay';
import Settings from './Settings';
import LevelComplete from './LevelComplete';
import audioManager from '../utils/AudioManager';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
`;

const PauseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 850px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 50px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SettingsButton = styled(PauseButton)`
  right: 950px;
`;

const Game = () => {
  // Game state
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [problems, setProblems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [inputValue, setInputValue] = useState('');
  
  // Pause and settings state
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);

  // Fixed settings
  const MAX_NUMBER = 10;
  const SPAWN_RATE = 3000; // 3 seconds in milliseconds
  const STARTING_LIVES = 3;

  // Add a ref to track if we're currently processing a wrong answer
  const isProcessingWrongAnswer = useRef(false);

  const [audioError, setAudioError] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const audioInitialized = useRef(false);
  const inputRef = useRef(null);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  // Function to handle first user interaction and start the game
  const handleFirstInteraction = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      setGameStarted(true);
      setShouldFocusInput(true);
      
      // Initialize and start audio after first interaction
      if (!audioInitialized.current) {
        audioInitialized.current = true;
        audioManager.init('/playlist for studying - music for study - music for reading, writing and studying.mp3');
        
        const savedMusicEnabled = localStorage.getItem('musicEnabled');
        if (savedMusicEnabled === null || JSON.parse(savedMusicEnabled)) {
          audioManager.restart();
        }
      }
    }
  }, [hasUserInteracted]);

  // Initialize audio handlers without playing
  useEffect(() => {
    audioManager.setLoadingCallback(setIsAudioLoading);
    audioManager.setErrorCallback((error) => {
      setAudioError(error.message || 'Failed to play audio');
      // Auto-retry after 3 seconds, but only if user has interacted
      if (hasUserInteracted) {
        setTimeout(() => {
          setAudioError(null);
          const musicEnabled = localStorage.getItem('musicEnabled');
          if (musicEnabled === null || JSON.parse(musicEnabled)) {
            audioManager.restart();
          }
        }, 3000);
      }
    });

    return () => {
      audioManager.setLoadingCallback(null);
      audioManager.setErrorCallback(null);
    };
  }, [hasUserInteracted]);

  // Add interaction listeners
  useEffect(() => {
    const handleInteraction = () => {
      handleFirstInteraction();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [handleFirstInteraction]);

  // Get level requirements
  const getLevelRequirements = (level) => {
    if (level <= 11) {
      return {
        table: level + 1,
        problemsNeeded: level + 4
      };
    } else {
      return {
        table: 'random',
        problemsNeeded: level + 4
      };
    }
  };

  const generateProblem = useCallback(() => {
    const { table } = getLevelRequirements(level);
    let num1, num2;

    if (table === 'random') {
      // For level 12 and beyond, use random tables from 2 to 12
      num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
      num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    } else {
      // For levels 1-11, focus on specific tables
      num1 = table;
      num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    }

    const x = Math.random() * (window.innerWidth - 100);
    const speed = Math.random() * 4 + 1;
    
    return {
      id: Date.now(),
      num1,
      num2,
      answer: num1 * num2,
      x,
      y: 0,
      speed,
    };
  }, [level]);

  const spawnProblem = useCallback(() => {
    if (!isPaused && !gameOver && gameStarted) {
      setProblems(prev => [...prev, generateProblem()]);
    }
  }, [generateProblem, isPaused, gameOver, gameStarted]);

  const handleCorrectAnswer = useCallback((problemId) => {
    setScore(prev => prev + 10);
    setLevelProgress(prev => prev + 1);
    setProblems(prev => prev.filter(p => p.id !== problemId));
    setInputValue('');

    const { problemsNeeded } = getLevelRequirements(level);
    if (levelProgress + 1 >= problemsNeeded) {
      setShowLevelComplete(true);
      setIsPaused(true);
    }
  }, [level, levelProgress]);

  const handleWrongAnswer = useCallback((problemId) => {
    // Prevent multiple wrong answer processing
    if (isProcessingWrongAnswer.current) return;
    
    isProcessingWrongAnswer.current = true;
    
    setLives(prev => {
      if (prev <= 1) {
        setGameOver(true);
        return 0;
      }
      return prev - 1;
    });

    // Remove the problem that caused the wrong answer
    setProblems(prev => prev.filter(p => p.id !== problemId));
    setInputValue('');

    // Reset the processing flag after a short delay
    setTimeout(() => {
      isProcessingWrongAnswer.current = false;
    }, 100);
  }, []);

  const handleInputChange = (e) => {
    handleFirstInteraction();
    if (!isPaused && gameStarted) {
      setInputValue(e.target.value);
    }
  };

  const handleKeyPress = (e) => {
    handleFirstInteraction();
    if (e.key === 'Enter' && problems.length > 0 && !isPaused && gameStarted) {
      const answer = parseInt(inputValue);
      if (isNaN(answer)) return;

      const matchingProblem = problems.find(problem => problem.answer === answer);
      
      if (matchingProblem) {
        handleCorrectAnswer(matchingProblem.id);
      } else {
        handleWrongAnswer(problems[0].id);
      }
    } else if (e.key === 'Escape') {
      togglePause();
    }
  };

  const handleLevelComplete = () => {
    setLevel(prev => prev + 1);
    setLevelProgress(0);
    setShowLevelComplete(false);
    setIsPaused(false);
    setProblems([]);
    setShouldFocusInput(true);
  };

  const resetGame = () => {
    setLevel(1);
    setLevelProgress(0);
    setScore(0);
    setLives(STARTING_LIVES);
    setProblems([]);
    setGameOver(false);
    setCorrectAnswers(0);
    setInputValue('');
    setIsPaused(false);
    setShowLevelComplete(false);
    setGameStarted(true);
    setShouldFocusInput(true);
    
    // Ensure audio is playing if enabled
    const musicEnabled = localStorage.getItem('musicEnabled');
    if (musicEnabled === null || JSON.parse(musicEnabled)) {
      audioManager.restart();
    }
  };

  const togglePause = () => {
    handleFirstInteraction();
    setIsPaused(prev => !prev);
  };

  // Spawn problems periodically
  useEffect(() => {
    const spawnInterval = setInterval(spawnProblem, SPAWN_RATE);
    return () => clearInterval(spawnInterval);
  }, [spawnProblem]);

  // Update problem positions
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!isPaused && !gameOver && gameStarted) {
        setProblems(prev => {
          const newProblems = prev.map(problem => ({
            ...problem,
            y: problem.y + problem.speed,
          }));

          const bottomProblems = newProblems.filter(problem => problem.y > window.innerHeight);
          
          if (bottomProblems.length > 0 && !isProcessingWrongAnswer.current) {
            handleWrongAnswer(bottomProblems[0].id);
          }

          return newProblems;
        });
      }
    }, 16);

    return () => clearInterval(moveInterval);
  }, [handleWrongAnswer, isPaused, gameOver, gameStarted]);

  // Handle escape key for pause
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handlePause = () => {
    setIsPaused(true);
    if (audioManager.isPlaying) {
      audioManager.pause();
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setShouldFocusInput(true);
    if (musicEnabled && !audioManager.isPlaying) {
      audioManager.restart();
    }
  };

  // Update Settings component to handle user interaction
  const handleSettingsClick = () => {
    handleFirstInteraction();
    setShowSettings(true);
  };

  // Add useEffect for input focus
  useEffect(() => {
    if (shouldFocusInput && inputRef.current && !isPaused && gameStarted) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput, isPaused, gameStarted]);

  return (
    <GameContainer onClick={handleFirstInteraction}>
      <HUD 
        level={level} 
        score={score} 
        lives={lives} 
        progress={levelProgress}
        total={getLevelRequirements(level).problemsNeeded}
      />
      <SettingsButton onClick={handleSettingsClick}>
        Settings
      </SettingsButton>
      <PauseButton onClick={togglePause}>
        {isPaused ? 'Resume' : 'Pause'}
      </PauseButton>
      
      {gameStarted && problems.map(problem => (
        <ProblemBlock
          key={problem.id}
          num1={problem.num1}
          num2={problem.num2}
          x={problem.x}
          y={problem.y}
        />
      ))}
      
      <InputBox
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={isPaused || !gameStarted}
        shouldFocus={shouldFocusInput}
      />
      
      {isPaused && !showLevelComplete && (
        <PauseOverlay
          onResume={togglePause}
          onSettings={() => setShowSettings(true)}
          onRestart={resetGame}
        />
      )}
      
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSave={() => setShowSettings(false)}
          isOpen={showSettings}
        />
      )}
      
      {showLevelComplete && (
        <LevelComplete
          level={level}
          onContinue={handleLevelComplete}
        />
      )}
      
      {gameOver && <GameOverScreen score={score} onRestart={resetGame} />}

      {!hasUserInteracted && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center',
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease-in-out',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          maxWidth: '90%',
          width: '400px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'bounce 1s infinite'
          }}>
            🎮
          </div>
          <div style={{ 
            fontSize: '24px', 
            marginBottom: '15px',
            fontFamily: "'Comic Sans MS', 'Arial Rounded MT Bold', 'Arial', sans-serif"
          }}>
            Welcome to Math Adventure!
          </div>
          <div style={{ 
            marginBottom: '20px',
            fontSize: '18px',
            lineHeight: '1.5'
          }}>
            Click anywhere or press any key to start playing!
          </div>
          <div style={{ 
            fontSize: '16px', 
            opacity: 0.8,
            fontStyle: 'italic'
          }}>
            (This will also start the background music)
          </div>
          <style>
            {`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}
          </style>
        </div>
      )}
    </GameContainer>
  );
};

export default Game; 