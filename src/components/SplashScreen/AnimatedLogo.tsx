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
        justifyContent: 'center',
        animation: 'fadeInScale 0.8s ease-out'
      }}
    >
      <img
        src="/logo.png"
        alt="Clarity Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          maxWidth: responsiveSize,
          maxHeight: responsiveSize
        }}
        onError={(e) => {
          // Fallback на простой текст если изображение не найдено
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div style="font-size: 48px; color: #333; font-weight: 700;">C</div>
            `;
          }
        }}
      />
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
