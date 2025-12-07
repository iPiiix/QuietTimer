import { useState, useEffect, useRef, useMemo } from 'react';

const THEMES = {
  light: {
    bg: '#f5f5f7',
    text: '#1d1d1f',
    textSecondary: '#86868b',
    circle: '#e5e5e7',
    border: '#d1d1d6',
  },
  dark: {
    bg: '#000000',
    text: '#f5f5f7',
    textSecondary: '#98989d',
    circle: '#1d1d1f',
    border: '#2c2c2e',
  },
  industrial: {
    bg: '#0f0f0f',
    text: '#e8e8e8',
    textSecondary: '#6b6b6b',
    circle: '#1a1a1a',
    border: '#3a3a3a',
  }
};

const ACCENTS = {
  blue: {
    name: 'Blue',
    gradient: ['#007AFF', '#5856D6'],
    solid: '#007AFF',
    shadow: 'rgba(0, 122, 255, 0.2)',
    shadowHover: 'rgba(0, 122, 255, 0.35)',
  },
  purple: {
    name: 'Purple',
    gradient: ['#BF5AF2', '#AF52DE'],
    solid: '#BF5AF2',
    shadow: 'rgba(191, 90, 242, 0.2)',
    shadowHover: 'rgba(191, 90, 242, 0.35)',
  },
  pink: {
    name: 'Pink',
    gradient: ['#FF2D55', '#FF375F'],
    solid: '#FF2D55',
    shadow: 'rgba(255, 45, 85, 0.2)',
    shadowHover: 'rgba(255, 45, 85, 0.35)',
  },
  red: {
    name: 'Red',
    gradient: ['#FF3B30', '#FF453A'],
    solid: '#FF3B30',
    shadow: 'rgba(255, 59, 48, 0.2)',
    shadowHover: 'rgba(255, 59, 48, 0.35)',
  },
  orange: {
    name: 'Orange',
    gradient: ['#FF9500', '#FF9F0A'],
    solid: '#FF9500',
    shadow: 'rgba(255, 149, 0, 0.2)',
    shadowHover: 'rgba(255, 149, 0, 0.35)',
  },
  yellow: {
    name: 'Yellow',
    gradient: ['#FFCC00', '#FFD60A'],
    solid: '#FFCC00',
    shadow: 'rgba(255, 204, 0, 0.2)',
    shadowHover: 'rgba(255, 204, 0, 0.35)',
  },
  green: {
    name: 'Green',
    gradient: ['#34C759', '#30D158'],
    solid: '#34C759',
    shadow: 'rgba(52, 199, 89, 0.2)',
    shadowHover: 'rgba(52, 199, 89, 0.35)',
  },
  teal: {
    name: 'Teal',
    gradient: ['#5AC8FA', '#64D2FF'],
    solid: '#5AC8FA',
    shadow: 'rgba(90, 200, 250, 0.2)',
    shadowHover: 'rgba(90, 200, 250, 0.35)',
  },
  indigo: {
    name: 'Indigo',
    gradient: ['#5856D6', '#5E5CE6'],
    solid: '#5856D6',
    shadow: 'rgba(88, 86, 214, 0.2)',
    shadowHover: 'rgba(88, 86, 214, 0.35)',
  },
  slate: {
    name: 'Slate',
    gradient: ['#8E8E93', '#98989D'],
    solid: '#8E8E93',
    shadow: 'rgba(142, 142, 147, 0.2)',
    shadowHover: 'rgba(142, 142, 147, 0.35)',
  },
  mint: {
    name: 'Mint',
    gradient: ['#00C7BE', '#32D4CC'],
    solid: '#00C7BE',
    shadow: 'rgba(0, 199, 190, 0.2)',
    shadowHover: 'rgba(0, 199, 190, 0.35)',
  },
  cyan: {
    name: 'Cyan',
    gradient: ['#32ADE6', '#50C8FF'],
    solid: '#32ADE6',
    shadow: 'rgba(50, 173, 230, 0.2)',
    shadowHover: 'rgba(50, 173, 230, 0.35)',
  }
};

export default function QuietTimer({ 
  duration = 25 * 60,
  theme = 'light',
  accent = 'blue',
  onComplete = null,
  showAccentPicker = true
}) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [presetHover, setPresetHover] = useState(null);
  const [currentAccent, setCurrentAccent] = useState(accent);
  const [showPicker, setShowPicker] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const colors = THEMES[theme] || THEMES.light;
  const accentColors = ACCENTS[currentAccent] || ACCENTS.blue;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onComplete]);

  const toggleTimer = () => {
    if (!isRunning && timeRemaining === 0) {
      setTimeRemaining(totalDuration);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(totalDuration);
  };

  const setDuration = (minutes) => {
    const newDuration = minutes * 60;
    setTotalDuration(newDuration);
    setTimeRemaining(newDuration);
    setIsRunning(false);
  };

  const { minutes, seconds, progress, strokeDashoffset } = useMemo(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    const prog = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;
    const radius = 160;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (prog / 100) * circumference;
    
    return {
      minutes: mins,
      seconds: secs,
      progress: prog,
      strokeDashoffset: offset
    };
  }, [timeRemaining, totalDuration]);

  const presetDurations = [5, 10, 15, 25, 30, 45, 60];

  const buttonLabel = isRunning ? 'Pause' : timeRemaining === 0 ? 'Restart' : 'Start';
  const showReset = isRunning || timeRemaining !== totalDuration;
  const showPresets = !isRunning;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: colors.bg,
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 0,
      padding: '20px',
      overflow: 'hidden',
      userSelect: 'none',
      transition: 'background 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKjo77RgGwU7k9n0yHkpBSh+zPLaizsKElyx6uum" type="audio/wav" />
      </audio>

      {showAccentPicker && (
        <button
          onClick={() => setShowPicker(!showPicker)}
          aria-label="Choose color accent"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '22px',
            border: `2px solid ${colors.border}`,
            background: accentColors.solid,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 12px ${accentColors.shadow}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 100,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColors.gradient[0]}, ${accentColors.gradient[1]})`,
            boxShadow: '0 0 0 2px rgba(255,255,255,0.3)'
          }} />
        </button>
      )}

      {showPicker && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: theme === 'light' ? '#ffffff' : '#1c1c1e',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: theme === 'light' 
            ? '0 8px 32px rgba(0,0,0,0.12)' 
            : '0 8px 32px rgba(0,0,0,0.5)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          zIndex: 99,
          border: `1px solid ${colors.border}`,
          opacity: 0,
          animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}>
          {Object.entries(ACCENTS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setCurrentAccent(key);
                setShowPicker(false);
              }}
              aria-label={`Select ${value.name} color`}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: currentAccent === key 
                  ? `3px solid ${value.solid}` 
                  : `2px solid ${colors.border}`,
                background: `linear-gradient(135deg, ${value.gradient[0]}, ${value.gradient[1]})`,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                boxShadow: currentAccent === key 
                  ? `0 0 0 4px ${value.shadow}` 
                  : 'none',
                transform: currentAccent === key ? 'scale(1.1)' : 'scale(1)',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
          ))}
        </div>
      )}

      <div style={{ 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '60px'
        }}>
          <svg 
            width="400" 
            height="400" 
            style={{ 
              transform: 'rotate(-90deg)',
              filter: `drop-shadow(0 0 1px ${accentColors.shadow})`
            }}
          >
            <defs>
              <linearGradient id={`gradient-${currentAccent}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: accentColors.gradient[0], stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: accentColors.gradient[1], stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke={colors.circle}
              strokeWidth="2"
              opacity="0.3"
            />
            
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke={`url(#gradient-${currentAccent})`}
              strokeWidth="2"
              strokeDasharray="1005.31"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: isRunning 
                  ? 'stroke-dashoffset 1s linear, stroke 0.5s ease' 
                  : 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
                filter: progress > 0 ? 'url(#glow)' : 'none'
              }}
            />
          </svg>

          <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: 'clamp(80px, 15vw, 120px)',
              fontWeight: '200',
              letterSpacing: '-0.04em',
              color: colors.text,
              lineHeight: 1,
              transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {String(minutes).padStart(2, '0')}
              <span style={{ 
                opacity: 0.25,
                fontSize: 'clamp(70px, 13vw, 100px)',
                fontWeight: '100'
              }}>:</span>
              {String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        <button
          onClick={toggleTimer}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
          aria-label={buttonLabel}
          style={{
            padding: '16px 48px',
            background: accentColors.solid,
            border: 'none',
            borderRadius: '28px',
            color: '#ffffff',
            fontSize: '17px',
            fontWeight: '510',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: buttonHover 
              ? `0 8px 30px ${accentColors.shadowHover}` 
              : `0 4px 16px ${accentColors.shadow}`,
            transform: buttonHover ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <span style={{
            fontSize: '12px',
            transform: isRunning ? 'scale(0.9)' : 'scale(1)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {isRunning ? '⏸' : '▶'}
          </span>
          {buttonLabel}
        </button>

        {showReset && (
          <button
            onClick={resetTimer}
            aria-label="Reset timer"
            style={{
              padding: '12px 32px',
              background: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: '22px',
              color: colors.textSecondary,
              fontSize: '15px',
              fontWeight: '400',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              outline: 'none',
              marginBottom: '36px',
              opacity: 0,
              animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Reset
          </button>
        )}

        {showPresets && (
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '520px',
            opacity: 0,
            animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards'
          }}>
            {presetDurations.map(mins => {
              const isActive = totalDuration === mins * 60;
              const isHovered = presetHover === mins;
              
              return (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  onMouseEnter={() => setPresetHover(mins)}
                  onMouseLeave={() => setPresetHover(null)}
                  aria-label={`Set timer to ${mins} minutes`}
                  aria-pressed={isActive}
                  style={{
                    padding: '10px 22px',
                    background: isActive ? accentColors.solid : 'transparent',
                    border: `1px solid ${isActive ? 'transparent' : colors.border}`,
                    borderRadius: '20px',
                    color: isActive ? '#ffffff' : colors.text,
                    fontSize: '14px',
                    fontWeight: isActive ? '500' : '400',
                    letterSpacing: '-0.01em',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    boxShadow: isActive 
                      ? `0 2px 12px ${accentColors.shadow}` 
                      : 'none',
                    transform: isHovered && !isActive ? 'scale(1.05)' : 'scale(1)',
                    opacity: isHovered || isActive ? 1 : 0.7,
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {mins}m
                </button>
              );
            })}
          </div>
        )}

        {!isRunning && timeRemaining > 0 && timeRemaining === totalDuration && (
          <div style={{
            marginTop: '28px',
            fontSize: '13px',
            color: colors.textSecondary,
            fontWeight: '400',
            letterSpacing: '0.01em',
            opacity: 0,
            animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards'
          }}>
            Ready to begin
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        button:active {
          transform: scale(0.97) !important;
        }

        @media (max-width: 480px) {
          svg {
            width: 320px !important;
            height: 320px !important;
          }
        }
      `}</style>
    </div>
  );
}