import { useState, useEffect, useRef } from 'react';

export default function TemporizadorElegante() {
  const [tiempoRestante, setTiempoRestante] = useState(25 * 60);
  const [duracionTotal, setDuracionTotal] = useState(25 * 60);
  const [enMarcha, setEnMarcha] = useState(false);
  const [hover, setHover] = useState(false);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (enMarcha) {
      intervaloRef.current = setInterval(() => {
        setTiempoRestante(t => {
          if (t <= 1) {
            setEnMarcha(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    }

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [enMarcha]);

  const alternar = () => {
    if (!enMarcha && tiempoRestante === 0) {
      setTiempoRestante(duracionTotal);
    }
    setEnMarcha(!enMarcha);
  };

  const reiniciar = () => {
    setEnMarcha(false);
    setTiempoRestante(duracionTotal);
  };

  const cambiarDuracion = (minutos) => {
    const nuevaDuracion = minutos * 60;
    setDuracionTotal(nuevaDuracion);
    setTiempoRestante(nuevaDuracion);
    setEnMarcha(false);
  };

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  const progreso = duracionTotal > 0 ? ((duracionTotal - tiempoRestante) / duracionTotal) * 100 : 0;
  const radio = 160;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (progreso / 100) * circunferencia;

  const duracionesPreset = [5, 10, 15, 25, 30, 45, 60];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: '#f5f5f7',
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '60px'
        }}>
          <svg width="400" height="400" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#007AFF' }} />
                <stop offset="100%" style={{ stopColor: '#5856D6' }} />
              </linearGradient>
            </defs>
            
            <circle
              cx="200"
              cy="200"
              r={radio}
              fill="none"
              stroke="#e5e5e7"
              strokeWidth="3"
            />
            
            <circle
              cx="200"
              cy="200"
              r={radio}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: enMarcha ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease-out'
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
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: '120px',
              fontWeight: '200',
              letterSpacing: '-0.03em',
              color: '#1d1d1f',
              lineHeight: 1
            }}>
              {String(minutos).padStart(2, '0')}
              <span style={{ 
                opacity: 0.3,
                fontSize: '100px'
              }}>:</span>
              {String(segundos).padStart(2, '0')}
            </div>
          </div>
        </div>

        <button
          onClick={alternar}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            padding: '14px 40px',
            background: '#007AFF',
            border: 'none',
            borderRadius: '24px',
            color: '#ffffff',
            fontSize: '17px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            transition: 'all 0.2s ease',
            boxShadow: hover ? '0 4px 20px rgba(0, 122, 255, 0.35)' : '0 2px 10px rgba(0, 122, 255, 0.2)',
            transform: hover ? 'translateY(-1px) scale(1.02)' : 'translateY(0) scale(1)',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}
        >
          <span style={{
            fontSize: '14px'
          }}>▶</span>
          {enMarcha ? 'Pausar' : tiempoRestante === 0 ? 'Reiniciar' : 'Iniciar'}
        </button>

        {(enMarcha || tiempoRestante !== duracionTotal) && (
          <button
            onClick={reiniciar}
            style={{
              padding: '10px 28px',
              background: 'transparent',
              border: '1px solid #d1d1d6',
              borderRadius: '20px',
              color: '#86868b',
              fontSize: '15px',
              fontWeight: '400',
              cursor: 'pointer',
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              transition: 'all 0.2s',
              outline: 'none',
              marginBottom: '32px'
            }}
          >
            Reiniciar
          </button>
        )}

        {!enMarcha && (
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '500px'
          }}>
            {duracionesPreset.map(mins => (
              <button
                key={mins}
                onClick={() => cambiarDuracion(mins)}
                style={{
                  padding: '8px 18px',
                  background: duracionTotal === mins * 60 
                    ? '#007AFF' 
                    : '#ffffff',
                  border: duracionTotal === mins * 60 
                    ? 'none' 
                    : '1px solid #d1d1d6',
                  borderRadius: '18px',
                  color: duracionTotal === mins * 60 
                    ? '#ffffff' 
                    : '#1d1d1f',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                  transition: 'all 0.2s',
                  outline: 'none',
                  boxShadow: duracionTotal === mins * 60 ? '0 2px 8px rgba(0, 122, 255, 0.25)' : 'none'
                }}
              >
                {mins} min
              </button>
            ))}
          </div>
        )}

        {!enMarcha && tiempoRestante > 0 && tiempoRestante === duracionTotal && (
          <div style={{
            marginTop: '24px',
            fontSize: '13px',
            color: '#86868b',
            fontWeight: '400',
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Listo para comenzar
          </div>
        )}
      </div>
    </div>
  );
}