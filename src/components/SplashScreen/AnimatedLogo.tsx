import { useState } from 'react';

interface AnimatedLogoProps {
  size?: number;
}

export default function AnimatedLogo({ size = 200 }: AnimatedLogoProps) {
  const [imageError, setImageError] = useState(false);

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
        justifyContent: 'center',
        animation: 'fadeInScale 0.8s ease-out'
      }}
    >
      {!imageError ? (
        <img
          src="/logo.png"
          alt="Clarity Logo"
          onError={() => {
            console.warn('Logo image not found at /logo.png. Please add logo.png to the public folder.');
            setImageError(true);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            maxWidth: responsiveSize,
            maxHeight: responsiveSize
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: '#333',
          fontWeight: '700'
        }}>
          C
        </div>
      )}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
