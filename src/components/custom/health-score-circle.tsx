'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface HealthScoreCircleProps {
  score: number; // 0-100
  size?: number; // tamanho do círculo em pixels
}

export function HealthScoreCircle({ score, size = 200 }: HealthScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  // Animação do score ao carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Detectar movimento do dispositivo (giroscópio)
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        // beta: inclinação frente-trás (-180 a 180)
        // gamma: inclinação esquerda-direita (-90 a 90)
        const x = Math.max(-15, Math.min(15, event.gamma / 6)); // Limitar movimento
        const y = Math.max(-15, Math.min(15, event.beta / 6));
        setTilt({ x, y });
      }
    };

    // Solicitar permissão para iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // Para Android e navegadores que não precisam de permissão
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Calcular cor baseada no score com transição suave
  const getColor = (score: number) => {
    if (score >= 80) return { from: '#10b981', to: '#059669', shadow: '#10b981' }; // Verde
    if (score >= 60) return { from: '#3b82f6', to: '#2563eb', shadow: '#3b82f6' }; // Azul
    if (score >= 40) return { from: '#f59e0b', to: '#d97706', shadow: '#f59e0b' }; // Amarelo/Laranja
    return { from: '#ef4444', to: '#dc2626', shadow: '#ef4444' }; // Vermelho
  };

  const colors = getColor(score);
  const fillPercentage = animatedScore;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="overflow-visible transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <defs>
          {/* Gradiente da água com transição suave */}
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.from} stopOpacity="0.9">
              <animate
                attributeName="stop-color"
                values={`${colors.from};${colors.to};${colors.from}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={colors.to} stopOpacity="1">
              <animate
                attributeName="stop-color"
                values={`${colors.to};${colors.from};${colors.to}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Gradiente de brilho */}
          <radialGradient id="shineGradient">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>

          {/* Máscara circular */}
          <clipPath id="circleClip">
            <circle cx="100" cy="100" r="90" />
          </clipPath>

          {/* Filtro para o efeito de brilho */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sombra interna */}
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Círculo de fundo (borda externa) */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Círculo interno (fundo da água) */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="rgba(255, 255, 255, 0.15)"
          filter="url(#innerShadow)"
        />

        {/* Grupo da água com máscara circular */}
        <g clipPath="url(#circleClip)">
          {/* Água com animação de preenchimento */}
          <rect
            x="10"
            y={200 - (fillPercentage * 1.8)}
            width="180"
            height="180"
            fill="url(#waterGradient)"
            style={{
              transition: 'y 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Ondas superiores - primeira camada (mais pronunciada) */}
          <path
            d={`M 10 ${200 - (fillPercentage * 1.8)} Q 55 ${200 - (fillPercentage * 1.8) - 10} 100 ${200 - (fillPercentage * 1.8)} T 190 ${200 - (fillPercentage * 1.8)}`}
            fill="rgba(255, 255, 255, 0.4)"
            style={{
              transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(${tilt.x * 2}px) translateY(${tilt.y * 2}px)`,
            }}
          >
            <animate
              attributeName="d"
              dur="3.5s"
              repeatCount="indefinite"
              values={`
                M 10 ${200 - (fillPercentage * 1.8)} Q 55 ${200 - (fillPercentage * 1.8) - 10} 100 ${200 - (fillPercentage * 1.8)} T 190 ${200 - (fillPercentage * 1.8)};
                M 10 ${200 - (fillPercentage * 1.8)} Q 55 ${200 - (fillPercentage * 1.8) + 10} 100 ${200 - (fillPercentage * 1.8)} T 190 ${200 - (fillPercentage * 1.8)};
                M 10 ${200 - (fillPercentage * 1.8)} Q 55 ${200 - (fillPercentage * 1.8) - 10} 100 ${200 - (fillPercentage * 1.8)} T 190 ${200 - (fillPercentage * 1.8)}
              `}
            />
          </path>

          {/* Ondas superiores - segunda camada */}
          <path
            d={`M 10 ${200 - (fillPercentage * 1.8) + 5} Q 55 ${200 - (fillPercentage * 1.8) - 5} 100 ${200 - (fillPercentage * 1.8) + 5} T 190 ${200 - (fillPercentage * 1.8) + 5}`}
            fill="rgba(255, 255, 255, 0.3)"
            style={{
              transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(${-tilt.x * 1.5}px) translateY(${-tilt.y * 1.5}px)`,
            }}
          >
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values={`
                M 10 ${200 - (fillPercentage * 1.8) + 5} Q 55 ${200 - (fillPercentage * 1.8) - 5} 100 ${200 - (fillPercentage * 1.8) + 5} T 190 ${200 - (fillPercentage * 1.8) + 5};
                M 10 ${200 - (fillPercentage * 1.8) + 5} Q 55 ${200 - (fillPercentage * 1.8) + 15} 100 ${200 - (fillPercentage * 1.8) + 5} T 190 ${200 - (fillPercentage * 1.8) + 5};
                M 10 ${200 - (fillPercentage * 1.8) + 5} Q 55 ${200 - (fillPercentage * 1.8) - 5} 100 ${200 - (fillPercentage * 1.8) + 5} T 190 ${200 - (fillPercentage * 1.8) + 5}
              `}
            />
          </path>

          {/* Ondas superiores - terceira camada (mais sutil) */}
          <path
            d={`M 10 ${200 - (fillPercentage * 1.8) + 10} Q 55 ${200 - (fillPercentage * 1.8)} 100 ${200 - (fillPercentage * 1.8) + 10} T 190 ${200 - (fillPercentage * 1.8) + 10}`}
            fill="rgba(255, 255, 255, 0.2)"
            style={{
              transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(${tilt.x}px) translateY(${tilt.y}px)`,
            }}
          >
            <animate
              attributeName="d"
              dur="2.5s"
              repeatCount="indefinite"
              values={`
                M 10 ${200 - (fillPercentage * 1.8) + 10} Q 55 ${200 - (fillPercentage * 1.8)} 100 ${200 - (fillPercentage * 1.8) + 10} T 190 ${200 - (fillPercentage * 1.8) + 10};
                M 10 ${200 - (fillPercentage * 1.8) + 10} Q 55 ${200 - (fillPercentage * 1.8) + 20} 100 ${200 - (fillPercentage * 1.8) + 10} T 190 ${200 - (fillPercentage * 1.8) + 10};
                M 10 ${200 - (fillPercentage * 1.8) + 10} Q 55 ${200 - (fillPercentage * 1.8)} 100 ${200 - (fillPercentage * 1.8) + 10} T 190 ${200 - (fillPercentage * 1.8) + 10}
              `}
            />
          </path>
        </g>

        {/* Brilho no topo (reflexo de luz) */}
        <ellipse
          cx="100"
          cy="50"
          rx="40"
          ry="25"
          fill="url(#shineGradient)"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.7;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Partículas flutuantes (bolhas) */}
        <circle cx="70" cy={150 - (fillPercentage * 1.5)} r="3" fill="rgba(255, 255, 255, 0.5)">
          <animate
            attributeName="cy"
            values={`${150 - (fillPercentage * 1.5)};${50 - (fillPercentage * 1.5)};${150 - (fillPercentage * 1.5)}`}
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.8;0.5"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="130" cy={160 - (fillPercentage * 1.5)} r="2" fill="rgba(255, 255, 255, 0.5)">
          <animate
            attributeName="cy"
            values={`${160 - (fillPercentage * 1.5)};${60 - (fillPercentage * 1.5)};${160 - (fillPercentage * 1.5)}`}
            dur="5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.8;0.5"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Texto do Score sobreposto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="mb-1 text-5xl font-bold text-white drop-shadow-2xl sm:text-6xl"
               style={{
                 textShadow: `0 0 20px ${colors.shadow}, 0 4px 8px rgba(0,0,0,0.3)`,
               }}>
            {Math.round(animatedScore)}
          </div>
          <div className="text-sm font-medium text-white/95 drop-shadow-lg">
            Score de Saúde
          </div>
        </div>
      </div>

      {/* Ícone decorativo */}
      <div className="absolute -right-2 -top-2 rounded-full bg-white/30 p-2 backdrop-blur-sm shadow-lg">
        <TrendingUp className="h-5 w-5 text-white drop-shadow" />
      </div>
    </div>
  );
}
