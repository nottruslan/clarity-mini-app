import { useEffect, useState, lazy, Suspense } from 'react';

// Динамический импорт Lottie - загружается только когда нужен
const Lottie = lazy(() => import('lottie-react'));

interface LottieAnimationProps {
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

let cachedAnimationData: any = null;

async function loadAnimation() {
  if (cachedAnimationData) return cachedAnimationData;
  try {
    const response = await fetch('/anim.json');
    cachedAnimationData = await response.json();
    return cachedAnimationData;
  } catch (error) {
    console.warn('[DEBUG] Failed to load animation data:', error);
    return null;
  }
}

// Fallback компонент пока загружается Lottie
function LottieFallback({ className }: { className: string }) {
  return (
    <div 
      className={className} 
      style={{ 
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5
      }}
    >
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid var(--tg-theme-hint-color, #999)',
        borderTopColor: 'var(--tg-theme-button-color, #3390ec)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LottieAnimation({ 
  className = '', 
  loop = true, 
  autoplay = true 
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadAnimation()
      .then(data => {
        if (data) {
          setAnimationData(data);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true));
  }, []);

  // Если не удалось загрузить анимацию, показываем fallback
  if (loadError || !animationData) {
    return <LottieFallback className={className} />;
  }

  return (
    <div className={className}>
      <Suspense fallback={<LottieFallback className="" />}>
        <Lottie 
          animationData={animationData} 
          loop={loop}
          autoplay={autoplay}
        />
      </Suspense>
    </div>
  );
}
