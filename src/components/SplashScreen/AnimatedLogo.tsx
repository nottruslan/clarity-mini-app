interface AnimatedLogoProps {
  size?: number;
}

export default function AnimatedLogo({ size = 200 }: AnimatedLogoProps) {
  // Адаптивный размер на основе размера экрана
  const responsiveSize = typeof window !== 'undefined' 
    ? Math.min(size, window.innerWidth * 0.6, window.innerHeight * 0.4)
    : size;

  return (
    <div
      style={{
        width: responsiveSize,
        height: responsiveSize,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width={responsiveSize}
        height={responsiveSize}
        viewBox="0 0 200 200"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
        }}
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.6)" />
          </linearGradient>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 1)" />
          </linearGradient>
        </defs>

        {/* Верхний луч - сходящийся */}
        <path
          d="M 20 25 L 90 85 L 85 95 Z"
          fill="black"
          opacity={0.9}
        >
          <animate
            attributeName="d"
            values="M 20 25 L 90 85 L 85 95 Z;M 10 15 L 90 88 L 85 92 Z;M 20 25 L 90 85 L 85 95 Z"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Средний луч - горизонтальный */}
        <path
          d="M 15 100 L 85 100 L 95 105 Z"
          fill="black"
          opacity={0.9}
        >
          <animate
            attributeName="d"
            values="M 15 100 L 85 100 L 95 105 Z;M 5 100 L 85 100 L 95 105 Z;M 15 100 L 85 100 L 95 105 Z"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Центральная звезда - пульсирующая */}
        <polygon
          points="90,60 95,80 115,80 98,92 103,112 90,100 77,112 82,92 65,80 85,80"
          fill="url(#starGradient)"
          opacity={0.95}
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.1;1"
            dur="1.5s"
            repeatCount="indefinite"
            origin="90 90"
          />
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </polygon>

        {/* Геометрическая форма справа - отражающая поверхность */}
        <path
          d="M 100 65 L 180 50 L 180 130 L 100 115 Z"
          fill="black"
          opacity={0.85}
        >
          <animate
            attributeName="opacity"
            values="0.75;0.95;0.75"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Нижний фрагмент - расходящийся */}
        <path
          d="M 85 115 L 60 145 L 50 155 Z"
          fill="black"
          opacity={0.8}
        >
          <animate
            attributeName="d"
            values="M 85 115 L 60 145 L 50 155 Z;M 85 115 L 50 165 L 40 175 Z;M 85 115 L 60 145 L 50 155 Z"
            dur="2.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.9;0.6"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Нижний треугольник */}
        <path
          d={`M 70 160 L 50 180 L 30 170 Z`}
          fill="black"
          opacity={0.75}
        >
          <animate
            attributeName="opacity"
            values="0.6;0.85;0.6"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes converge {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

