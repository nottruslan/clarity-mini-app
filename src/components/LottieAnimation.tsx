import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

let cachedAnimationData: any = null;

async function loadAnimation() {
  if (cachedAnimationData) return cachedAnimationData;
  const response = await fetch('/anim.json');
  cachedAnimationData = await response.json();
  return cachedAnimationData;
}

export default function LottieAnimation({ 
  className = '', 
  loop = true, 
  autoplay = true 
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    loadAnimation().then(setAnimationData);
  }, []);

  if (!animationData) {
    return <div className={className} style={{ minHeight: '200px' }} />;
  }

  return (
    <div className={className}>
      <Lottie 
        animationData={animationData} 
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
}

